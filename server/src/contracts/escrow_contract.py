"""
escrow_contract.py
Trustless Escrow Smart Contract for Atomic AI Router
Built with Beaker (higher-level PyTeal framework) + AVM 8 Box Storage

One reusable application handles unlimited tasks via Box Storage keyed by task_id.
No per-payer opt-in required — boxes are app-scoped.

Deploy once to Algorand TestNet, then pass the resulting APP_ID to the Router server
via the ESCROW_APP_ID env var.

Requirements:
    pip install beaker-pyteal==1.0.0 pyteal==0.25.0 py-algorand-sdk==2.7.0

Deploy:
    python escrow_contract.py deploy
"""

from beaker import Application, GlobalStateValue, unconditional_create_approval
from beaker.lib.storage import BoxMapping
from pyteal import *
from pyteal.ast.bytes import Bytes
import beaker
import algosdk
from algosdk.v2client import algod
from algosdk import transaction, account, mnemonic
import json, os, sys, hashlib, struct


# ─── Box schema (ABI-encoded struct per task_id) ─────────────────────────────
# Layout (fixed 113 bytes):
#   payer    [0:32]   — 32-byte Algorand address (decoded from base32)
#   agent    [32:64]  — 32-byte Algorand address
#   amount   [64:72]  — uint64 microUSDC
#   status   [72:73]  — uint8  (0=FUNDED, 1=RELEASED, 2=REFUNDED, 3=DISPUTED)
#   deadline [73:81]  — uint64 AVM round
#   proof_hash[81:113] — bytes32 (SHA-256 of delivery payload, zeroed until release)
BOX_SIZE = 113

# Status constants
STATUS_FUNDED   = Int(0)
STATUS_RELEASED = Int(1)
STATUS_REFUNDED = Int(2)
STATUS_DISPUTED = Int(3)


# ─── Application state ───────────────────────────────────────────────────────
class EscrowState:
    # Global state (2 slots)
    admin = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Router operator address — can force-resolve disputes",
    )
    facilitator_addr = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Trusted address allowed to confirm delivery and release funds",
    )


app = Application("TrustlessEscrow", state=EscrowState())


# ─── Helpers ──────────────────────────────────────────────────────────────────
@Subroutine(TealType.bytes)
def box_key(task_id: Expr) -> Expr:
    """Use the task_id string directly as the box name."""
    return task_id


@Subroutine(TealType.uint64)
def box_get_amount(task_id: Expr) -> Expr:
    val, _ = App.box_get(task_id)
    return Btoi(Extract(val, Int(64), Int(8)))


@Subroutine(TealType.uint64)
def box_get_status(task_id: Expr) -> Expr:
    val, _ = App.box_get(task_id)
    return Btoi(Extract(val, Int(72), Int(1)))


@Subroutine(TealType.bytes)
def box_get_payer(task_id: Expr) -> Expr:
    val, _ = App.box_get(task_id)
    return Extract(val, Int(0), Int(32))


@Subroutine(TealType.bytes)
def box_get_agent(task_id: Expr) -> Expr:
    val, _ = App.box_get(task_id)
    return Extract(val, Int(32), Int(32))


@Subroutine(TealType.uint64)
def box_get_deadline(task_id: Expr) -> Expr:
    val, _ = App.box_get(task_id)
    return Btoi(Extract(val, Int(73), Int(8)))


@Subroutine(TealType.none)
def box_set_status(task_id: Expr, new_status: Expr) -> Expr:
    val, _ = App.box_get(task_id)
    return App.box_put(
        task_id,
        Concat(
            Extract(val, Int(0), Int(72)),   # payer + agent + amount
            Extract(Itob(new_status), Int(7), Int(1)),  # 1-byte status
            Extract(val, Int(73), Int(40)),  # deadline + proof_hash
        ),
    )


@Subroutine(TealType.none)
def box_set_proof(task_id: Expr, proof: Expr) -> Expr:
    val, _ = App.box_get(task_id)
    return App.box_put(
        task_id,
        Concat(
            Extract(val, Int(0), Int(81)),   # payer + agent + amount + status + deadline
            Extract(proof, Int(0), Int(32)), # proof_hash (first 32 bytes)
        ),
    )


@Subroutine(TealType.none)
def inner_usdc_transfer(receiver: Expr, amount: Expr, usdc_asset_id: Expr) -> Expr:
    """Issue an inner USDC ASA transfer from the app's escrow address."""
    return Seq(
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.asset_receiver: receiver,
            TxnField.asset_amount: amount,
            TxnField.xfer_asset: usdc_asset_id,
            TxnField.fee: Int(0),  # covered by outer txn fee
        }),
        InnerTxnBuilder.Submit(),
    )


# ─── Lifecycle ────────────────────────────────────────────────────────────────
@app.create
def create(admin_addr: abi.Address, facilitator: abi.Address) -> Expr:
    """Deploy the contract with admin and facilitator addresses."""
    return Seq(
        app.state.admin.set(admin_addr.get()),
        app.state.facilitator_addr.set(facilitator.get()),
        Approve(),
    )


@app.update(authorize=beaker.Authorize.only(app.state.admin))
def update() -> Expr:
    return Approve()


@app.delete(authorize=beaker.Authorize.only(app.state.admin))
def delete() -> Expr:
    return Approve()


# ─── fund_escrow ──────────────────────────────────────────────────────────────
@app.external
def fund_escrow(
    task_id: abi.String,
    agent: abi.Address,
    amount: abi.Uint64,
    deadline: abi.Uint64,
    payment: abi.AssetTransferTransaction,
) -> Expr:
    """
    Lock USDC into escrow for a task.
    The payment txn must be an ASA transfer to this app's address for the correct amount.
    Creates a new Box keyed by task_id — fails if already exists (prevents double-funding).
    """
    task_bytes = task_id.get()
    payer_bytes = Txn.sender()
    agent_bytes = agent.get()

    return Seq(
        # Verify the USDC transfer targets this app and matches declared amount
        Assert(payment.get().asset_receiver() == Global.current_application_address()),
        Assert(payment.get().asset_amount() == amount.get()),
        Assert(payment.get().xfer_asset() == Int(10458941)),  # TestNet USDC ASA ID

        # Deadline must be in the future
        Assert(deadline.get() > Global.round()),

        # Create the box — will FAIL (opcode error) if box already exists
        App.box_create(task_bytes, Int(BOX_SIZE)),

        # Write the struct into the box
        App.box_put(
            task_bytes,
            Concat(
                payer_bytes,                          # [0:32]  payer address
                agent_bytes,                          # [32:64] agent address
                Itob(amount.get()),                   # [64:72] amount uint64
                Bytes("base16", "00"),                # [72:73] status = FUNDED (0)
                Itob(deadline.get()),                 # [73:81] deadline round
                BytesZero(Int(32)),                   # [81:113] proof_hash (zeroed)
            ),
        ),
        Approve(),
    )


# ─── release_escrow ───────────────────────────────────────────────────────────
@app.external
def release_escrow(
    task_id: abi.String,
    proof_hash: abi.DynamicBytes,
) -> Expr:
    """
    Release held USDC to the agent after delivery is verified.
    Only callable by facilitator_addr.
    Stores the proof_hash on-chain for permanent auditability.
    """
    task_bytes = task_id.get()
    amount = ScratchVar(TealType.uint64)
    agent  = ScratchVar(TealType.bytes)

    return Seq(
        # Auth: only facilitator can release
        Assert(Txn.sender() == app.state.facilitator_addr.get()),

        # Must be in FUNDED state
        Assert(box_get_status(task_bytes) == STATUS_FUNDED),

        # Must still be within deadline
        Assert(Global.round() <= box_get_deadline(task_bytes)),

        # Cache amount and agent address
        amount.store(box_get_amount(task_bytes)),
        agent.store(box_get_agent(task_bytes)),

        # Store proof hash permanently
        box_set_proof(task_bytes, proof_hash.get()),

        # Update status to RELEASED
        box_set_status(task_bytes, STATUS_RELEASED),

        # Inner txn: send USDC to agent
        inner_usdc_transfer(agent.load(), amount.load(), Int(10458941)),

        Approve(),
    )


# ─── refund_escrow ────────────────────────────────────────────────────────────
@app.external
def refund_escrow(task_id: abi.String) -> Expr:
    """
    Return held USDC to the payer after the deadline passes.
    PERMISSIONLESS — callable by anyone once deadline round has elapsed.
    This is the auto-refund trigger for the demo moment.
    """
    task_bytes = task_id.get()
    amount = ScratchVar(TealType.uint64)
    payer  = ScratchVar(TealType.bytes)

    return Seq(
        # Must be in FUNDED state
        Assert(box_get_status(task_bytes) == STATUS_FUNDED),

        # Deadline MUST have passed
        Assert(Global.round() > box_get_deadline(task_bytes)),

        # Cache
        amount.store(box_get_amount(task_bytes)),
        payer.store(box_get_payer(task_bytes)),

        # Update status to REFUNDED
        box_set_status(task_bytes, STATUS_REFUNDED),

        # Inner txn: send USDC back to payer
        inner_usdc_transfer(payer.load(), amount.load(), Int(10458941)),

        Approve(),
    )


# ─── raise_dispute ────────────────────────────────────────────────────────────
@app.external
def raise_dispute(task_id: abi.String) -> Expr:
    """
    Payer raises a dispute — freezes both release and refund until admin resolves.
    Only callable by the original payer.
    """
    task_bytes = task_id.get()

    return Seq(
        # Only payer can dispute
        Assert(Txn.sender() == box_get_payer(task_bytes)),

        # Must be in FUNDED state
        Assert(box_get_status(task_bytes) == STATUS_FUNDED),

        # Freeze: set status to DISPUTED
        box_set_status(task_bytes, STATUS_DISPUTED),

        Approve(),
    )


# ─── resolve_dispute ──────────────────────────────────────────────────────────
@app.external
def resolve_dispute(
    task_id: abi.String,
    release_to_agent: abi.Bool,
) -> Expr:
    """
    Admin arbitrates a disputed escrow.
    release_to_agent=True  → sends funds to agent (delivery accepted)
    release_to_agent=False → refunds payer (delivery rejected)
    Only callable by the admin address (Router operator).
    """
    task_bytes = task_id.get()
    amount = ScratchVar(TealType.uint64)
    payer  = ScratchVar(TealType.bytes)
    agent  = ScratchVar(TealType.bytes)

    return Seq(
        # Auth: only admin
        Assert(Txn.sender() == app.state.admin.get()),

        # Must be in DISPUTED state
        Assert(box_get_status(task_bytes) == STATUS_DISPUTED),

        amount.store(box_get_amount(task_bytes)),
        payer.store(box_get_payer(task_bytes)),
        agent.store(box_get_agent(task_bytes)),

        If(release_to_agent.get())
        .Then(
            Seq(
                box_set_status(task_bytes, STATUS_RELEASED),
                inner_usdc_transfer(agent.load(), amount.load(), Int(10458941)),
            )
        )
        .Else(
            Seq(
                box_set_status(task_bytes, STATUS_REFUNDED),
                inner_usdc_transfer(payer.load(), amount.load(), Int(10458941)),
            )
        ),

        Approve(),
    )


# ─── Read-only: get_escrow_status ─────────────────────────────────────────────
@app.external(read_only=True)
def get_escrow_status(task_id: abi.String, *, output: abi.Uint64) -> Expr:
    """Read the status byte of an escrow box (0=FUNDED,1=RELEASED,2=REFUNDED,3=DISPUTED)."""
    return output.set(box_get_status(task_id.get()))


# ─── Deploy helper ────────────────────────────────────────────────────────────
def deploy():
    """Deploy the contract to Algorand TestNet. Reads env vars for credentials."""
    algod_client = algod.AlgodClient(
        "",
        os.environ.get("ALGOD_URL", "https://testnet-api.algonode.cloud"),
    )

    deployer_mnemonic = os.environ.get("ROUTER_MNEMONIC", "")
    if not deployer_mnemonic:
        print("ERROR: ROUTER_MNEMONIC env var not set.")
        sys.exit(1)

    deployer_key   = mnemonic.to_private_key(deployer_mnemonic)
    deployer_addr  = account.address_from_private_key(deployer_key)

    facilitator_addr = os.environ.get(
        "FACILITATOR_ADDRESS",
        deployer_addr,  # default to same account for hackathon simplicity
    )

    print(f"Deploying TrustlessEscrow from {deployer_addr} …")

    # Build approval + clear programs
    approval, clear = app.build().programs  # type: ignore[attr-defined]

    sp = algod_client.suggested_params()
    sp.flat_fee = True
    sp.fee = 2000

    # Create application transaction
    txn = transaction.ApplicationCreateTxn(
        sender=deployer_addr,
        sp=sp,
        on_complete=transaction.OnComplete.NoOpOC,
        approval_program=approval,
        clear_program=clear,
        global_schema=transaction.StateSchema(num_uints=0, num_byte_slices=2),
        local_schema=transaction.StateSchema(num_uints=0, num_byte_slices=0),
        app_args=[
            algosdk.encoding.decode_address(deployer_addr),
            algosdk.encoding.decode_address(facilitator_addr),
        ],
        extra_pages=1,
    )

    signed = txn.sign(deployer_key)
    tx_id  = algod_client.send_transaction(signed)
    print(f"Deploy txn sent: {tx_id}")

    result = transaction.wait_for_confirmation(algod_client, tx_id, 4)
    app_id = result["application-index"]
    app_addr = algosdk.logic.get_application_address(app_id)

    print(f"\n✅ TrustlessEscrow deployed!")
    print(f"   App ID      : {app_id}")
    print(f"   App Address : {app_addr}")
    print(f"\nAdd to your .env:")
    print(f"   ESCROW_APP_ID={app_id}")
    print(f"\nNext: opt the app address into USDC ASA (ID 10458941) and fund it with ALGO for fees.")

    return app_id


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "deploy":
        deploy()
    else:
        # Export ABI JSON for the TypeScript SDK
        spec = app.build()
        with open("escrow_abi.json", "w") as f:
            json.dump(spec.to_json(), f, indent=2)
        print("ABI written to escrow_abi.json")
        print("Run with `python escrow_contract.py deploy` to deploy to TestNet.")
