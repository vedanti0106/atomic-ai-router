"""
reputation_contract.py
On-Chain Agent Reputation Registry Smart Contract for Atomic AI Router
Built with Beaker (higher-level PyTeal framework) + AVM 8 Box Storage

Stores agent reputation data in boxes keyed by agent addresses.
Provides atomic reputation updates integrated with escrow system.

Requirements:
    pip install beaker-pyteal==1.0.0 pyteal==0.25.0 py-algorand-sdk==2.7.0

Deploy:
    python reputation_contract.py deploy
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


# ─── Box schema (ABI-encoded struct per agent address) ───────────────────────
# Layout (fixed 81 bytes):
#   reputation_score    [0:8]   — uint64 (0-1000 range)
#   total_calls         [8:16]  — uint64 total tasks completed
#   successful_calls    [16:24] — uint64 successful completions
#   disputed_calls      [24:32] — uint64 disputed tasks
#   total_volume        [32:40] — uint64 cumulative microAlgos volume
#   avg_response_time   [40:48] — uint64 weighted average seconds
#   avg_quality_rating  [48:56] — uint64 weighted average (1-500, scale 1-5 * 100)
#   registration_round  [56:64] — uint64 AVM round when agent registered
#   last_updated_round  [64:72] — uint64 AVM round of last update
#   is_active           [72:73] — uint8  (1=active, 0=inactive)
#   specializations     [73:81] — bytes8 specialization flags (8 categories max)
AGENT_BOX_SIZE = 81

# Default reputation score for new agents (neutral)
DEFAULT_REPUTATION = Int(500)

# Reputation score bounds
MIN_REPUTATION = Int(0)
MAX_REPUTATION = Int(1000)

# Specialization categories (bit flags)
SPEC_AI_ANALYSIS = Int(1)      # 2^0
SPEC_DATA_PROC = Int(2)        # 2^1  
SPEC_NLP = Int(4)              # 2^2
SPEC_VISION = Int(8)           # 2^3
SPEC_AUTOMATION = Int(16)      # 2^4
SPEC_RESEARCH = Int(32)        # 2^5
SPEC_CONTENT = Int(64)         # 2^6
SPEC_GENERAL = Int(128)        # 2^7


# ─── Application state ───────────────────────────────────────────────────────
class ReputationState:
    # Global state (3 slots)
    admin = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Contract administrator address",
    )
    escrow_contract = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Authorized escrow contract app address",
    )
    router_address = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Authorized router backend address",
    )


app = Application("ReputationRegistry", state=ReputationState())


# ─── Helper subroutines ──────────────────────────────────────────────────────
@Subroutine(TealType.bytes)
def agent_box_key(agent_addr: Expr) -> Expr:
    """Use the agent address directly as the box key."""
    return agent_addr


@Subroutine(TealType.uint64)
def get_reputation_score(agent_addr: Expr) -> Expr:
    """Get agent's current reputation score (0-1000)."""
    val, exists = App.box_get(agent_addr)
    return If(exists, Btoi(Extract(val, Int(0), Int(8))), DEFAULT_REPUTATION)


@Subroutine(TealType.uint64)
def get_total_calls(agent_addr: Expr) -> Expr:
    """Get agent's total task count."""
    val, exists = App.box_get(agent_addr)
    return If(exists, Btoi(Extract(val, Int(8), Int(8))), Int(0))


@Subroutine(TealType.uint64)
def get_successful_calls(agent_addr: Expr) -> Expr:
    """Get agent's successful task count."""
    val, exists = App.box_get(agent_addr)
    return If(exists, Btoi(Extract(val, Int(16), Int(8))), Int(0))


@Subroutine(TealType.uint64)
def get_disputed_calls(agent_addr: Expr) -> Expr:
    """Get agent's disputed task count."""
    val, exists = App.box_get(agent_addr)
    return If(exists, Btoi(Extract(val, Int(24), Int(8))), Int(0))


@Subroutine(TealType.uint64)
def get_total_volume(agent_addr: Expr) -> Expr:
    """Get agent's total transaction volume."""
    val, exists = App.box_get(agent_addr)
    return If(exists, Btoi(Extract(val, Int(32), Int(8))), Int(0))


@Subroutine(TealType.uint64)
def get_avg_response_time(agent_addr: Expr) -> Expr:
    """Get agent's average response time in seconds."""
    val, exists = App.box_get(agent_addr)
    return If(exists, Btoi(Extract(val, Int(40), Int(8))), Int(0))


@Subroutine(TealType.uint64)
def get_avg_quality(agent_addr: Expr) -> Expr:
    """Get agent's average quality rating (1-500, representing 1-5 * 100)."""
    val, exists = App.box_get(agent_addr)
    return If(exists, Btoi(Extract(val, Int(48), Int(8))), Int(300))  # Default 3.0


@Subroutine(TealType.uint64)
def get_is_active(agent_addr: Expr) -> Expr:
    """Check if agent is active (1=active, 0=inactive)."""
    val, exists = App.box_get(agent_addr)
    return If(exists, Btoi(Extract(val, Int(72), Int(1))), Int(1))


@Subroutine(TealType.uint64)
def get_specializations(agent_addr: Expr) -> Expr:
    """Get agent's specialization flags."""
    val, exists = App.box_get(agent_addr)
    return If(exists, Btoi(Extract(val, Int(73), Int(8))), SPEC_GENERAL)


@Subroutine(TealType.uint64)
def calculate_reputation_score(
    total: Expr,
    successful: Expr,
    disputed: Expr,
    avg_response: Expr,
    avg_quality: Expr,
) -> Expr:
    """
    Calculate reputation score using weighted formula.
    Formula: success_rate(40%) + response_time(25%) + quality(25%) + recency(10%)
    Returns score in 0-1000 range.
    """
    # Success rate calculation (0-400 points)
    success_rate_points = If(
        total > Int(0),
        ((successful - disputed) * Int(400)) / total,
        Int(200)  # Neutral for new agents
    )
    
    # Response time points (0-250, inverse relationship - faster is better)
    # Normalize against expected 1 hour = 3600 seconds max
    response_time_points = If(
        avg_response <= Int(3600),
        Int(250) - (avg_response * Int(250)) / Int(3600),
        Int(0)
    )
    
    # Quality points (0-250, direct relationship)
    # avg_quality is 1-500 (representing 1.0-5.0), normalize to 0-250
    quality_points = If(
        avg_quality >= Int(100),
        ((avg_quality - Int(100)) * Int(250)) / Int(400),
        Int(0)
    )
    
    # Recency bonus (0-100 points) - simplified version for contract
    recency_points = Int(100)  # Constant for now, could be enhanced
    
    raw_score = success_rate_points + response_time_points + quality_points + recency_points
    
    # Ensure bounds [0, 1000]
    return If(
        raw_score > MAX_REPUTATION,
        MAX_REPUTATION,
        If(raw_score < MIN_REPUTATION, MIN_REPUTATION, raw_score)
    )


@Subroutine(TealType.none)
def update_agent_metrics(
    agent_addr: Expr,
    response_time: Expr,
    quality_rating: Expr,
    task_value: Expr,
    is_successful: Expr,
    is_disputed: Expr,
) -> Expr:
    """Update agent metrics and recalculate reputation score."""
    
    # Get current values
    current_total = ScratchVar(TealType.uint64)
    current_successful = ScratchVar(TealType.uint64)
    current_disputed = ScratchVar(TealType.uint64)
    current_volume = ScratchVar(TealType.uint64)
    current_avg_response = ScratchVar(TealType.uint64)
    current_avg_quality = ScratchVar(TealType.uint64)
    current_specializations = ScratchVar(TealType.uint64)
    
    # New calculated values
    new_total = ScratchVar(TealType.uint64)
    new_successful = ScratchVar(TealType.uint64)
    new_disputed = ScratchVar(TealType.uint64)
    new_volume = ScratchVar(TealType.uint64)
    new_avg_response = ScratchVar(TealType.uint64)
    new_avg_quality = ScratchVar(TealType.uint64)
    new_reputation = ScratchVar(TealType.uint64)
    
    return Seq(
        # Load current values
        current_total.store(get_total_calls(agent_addr)),
        current_successful.store(get_successful_calls(agent_addr)),
        current_disputed.store(get_disputed_calls(agent_addr)),
        current_volume.store(get_total_volume(agent_addr)),
        current_avg_response.store(get_avg_response_time(agent_addr)),
        current_avg_quality.store(get_avg_quality(agent_addr)),
        current_specializations.store(get_specializations(agent_addr)),
        
        # Calculate new totals
        new_total.store(current_total.load() + Int(1)),
        new_successful.store(
            current_successful.load() + If(is_successful, Int(1), Int(0))
        ),
        new_disputed.store(
            current_disputed.load() + If(is_disputed, Int(1), Int(0))
        ),
        new_volume.store(current_volume.load() + task_value),
        
        # Calculate new averages using exponential moving average (alpha = 0.1)
        # new_avg = old_avg * 0.9 + new_value * 0.1
        new_avg_response.store(
            If(
                current_total.load() == Int(0),
                response_time,  # First task
                (current_avg_response.load() * Int(9) + response_time) / Int(10)
            )
        ),
        new_avg_quality.store(
            If(
                current_total.load() == Int(0),
                quality_rating,  # First task
                (current_avg_quality.load() * Int(9) + quality_rating) / Int(10)
            )
        ),
        
        # Calculate new reputation score
        new_reputation.store(
            calculate_reputation_score(
                new_total.load(),
                new_successful.load(),
                new_disputed.load(),
                new_avg_response.load(),
                new_avg_quality.load()
            )
        ),
        
        # Store updated agent data
        App.box_put(
            agent_addr,
            Concat(
                Itob(new_reputation.load()),           # [0:8]   reputation_score
                Itob(new_total.load()),                # [8:16]  total_calls
                Itob(new_successful.load()),           # [16:24] successful_calls
                Itob(new_disputed.load()),             # [24:32] disputed_calls
                Itob(new_volume.load()),               # [32:40] total_volume
                Itob(new_avg_response.load()),         # [40:48] avg_response_time
                Itob(new_avg_quality.load()),          # [48:56] avg_quality_rating
                Extract(
                    App.box_get(agent_addr)[0], Int(56), Int(8)
                ) if App.box_get(agent_addr)[1] else Itob(Global.round()),  # registration_round
                Itob(Global.round()),                  # [64:72] last_updated_round
                Bytes("base16", "01"),                 # [72:73] is_active = 1
                Itob(current_specializations.load()),  # [73:81] specializations
            )
        )
    )


# ─── Lifecycle ────────────────────────────────────────────────────────────────
@app.create
def create(
    admin_addr: abi.Address,
    escrow_contract_addr: abi.Address,
    router_addr: abi.Address
) -> Expr:
    """Deploy the reputation registry with authorized addresses."""
    return Seq(
        app.state.admin.set(admin_addr.get()),
        app.state.escrow_contract.set(escrow_contract_addr.get()),
        app.state.router_address.set(router_addr.get()),
        Approve(),
    )


@app.update(authorize=beaker.Authorize.only(app.state.admin))
def update() -> Expr:
    return Approve()


@app.delete(authorize=beaker.Authorize.only(app.state.admin))
def delete() -> Expr:
    return Approve()


# ─── Core Methods ─────────────────────────────────────────────────────────────
@app.external
def register_agent(
    agent_addr: abi.Address,
    specialization_flags: abi.Uint64,
) -> Expr:
    """
    Register a new agent with initial reputation.
    Only callable by router address or the agent themselves.
    """
    agent_address = agent_addr.get()
    
    return Seq(
        # Authorization: router or the agent themselves
        Assert(
            Or(
                Txn.sender() == app.state.router_address.get(),
                Txn.sender() == agent_address
            )
        ),
        
        # Ensure agent not already registered
        Assert(Not(App.box_get(agent_address)[1])),
        
        # Create agent box with initial data
        App.box_create(agent_address, Int(AGENT_BOX_SIZE)),
        App.box_put(
            agent_address,
            Concat(
                Itob(DEFAULT_REPUTATION),              # [0:8]   reputation_score = 500
                BytesZero(Int(8)),                     # [8:16]  total_calls = 0
                BytesZero(Int(8)),                     # [16:24] successful_calls = 0
                BytesZero(Int(8)),                     # [24:32] disputed_calls = 0
                BytesZero(Int(8)),                     # [32:40] total_volume = 0
                BytesZero(Int(8)),                     # [40:48] avg_response_time = 0
                Itob(Int(300)),                        # [48:56] avg_quality_rating = 3.0
                Itob(Global.round()),                  # [56:64] registration_round
                Itob(Global.round()),                  # [64:72] last_updated_round
                Bytes("base16", "01"),                 # [72:73] is_active = 1
                Itob(specialization_flags.get()),      # [73:81] specializations
            )
        ),
        
        # Emit registration event
        Log(Concat(
            Bytes("AGENT_REGISTERED:"),
            agent_address,
            Bytes(":"),
            Itob(DEFAULT_REPUTATION)
        )),
        
        Approve(),
    )


@app.external
def record_success(
    agent_addr: abi.Address,
    response_time: abi.Uint64,
    quality_rating: abi.Uint64,
    task_value: abi.Uint64,
) -> Expr:
    """
    Record a successful task completion for an agent.
    Only callable by authorized escrow contract or router.
    """
    agent_address = agent_addr.get()
    
    return Seq(
        # Authorization check
        Assert(
            Or(
                Txn.sender() == app.state.escrow_contract.get(),
                Txn.sender() == app.state.router_address.get()
            )
        ),
        
        # Ensure agent exists
        Assert(App.box_get(agent_address)[1]),
        
        # Ensure agent is active
        Assert(get_is_active(agent_address)),
        
        # Validate input ranges
        Assert(quality_rating.get() >= Int(100)),  # Min 1.0 * 100
        Assert(quality_rating.get() <= Int(500)),  # Max 5.0 * 100
        Assert(response_time.get() <= Int(86400)), # Max 24 hours
        
        # Update metrics
        update_agent_metrics(
            agent_address,
            response_time.get(),
            quality_rating.get(),
            task_value.get(),
            Int(1),  # is_successful = True
            Int(0),  # is_disputed = False
        ),
        
        # Emit success event
        Log(Concat(
            Bytes("SUCCESS_RECORDED:"),
            agent_address,
            Bytes(":"),
            Itob(get_reputation_score(agent_address))
        )),
        
        Approve(),
    )


@app.external
def record_dispute(
    agent_addr: abi.Address,
    task_value: abi.Uint64,
) -> Expr:
    """
    Record a disputed task for an agent.
    Only callable by authorized escrow contract or router.
    """
    agent_address = agent_addr.get()
    
    return Seq(
        # Authorization check
        Assert(
            Or(
                Txn.sender() == app.state.escrow_contract.get(),
                Txn.sender() == app.state.router_address.get()
            )
        ),
        
        # Ensure agent exists
        Assert(App.box_get(agent_address)[1]),
        
        # Update metrics (no response time or quality for disputes)
        update_agent_metrics(
            agent_address,
            Int(0),     # No response time
            Int(100),   # Minimum quality (1.0)
            task_value.get(),
            Int(0),     # is_successful = False
            Int(1),     # is_disputed = True
        ),
        
        # Emit dispute event
        Log(Concat(
            Bytes("DISPUTE_RECORDED:"),
            agent_address,
            Bytes(":"),
            Itob(get_reputation_score(agent_address))
        )),
        
        Approve(),
    )


@app.external
def update_reputation(
    agent_addr: abi.Address,
    response_time: abi.Uint64,
    quality_rating: abi.Uint64,
    task_value: abi.Uint64,
    successful: abi.Bool,
    disputed: abi.Bool,
) -> Expr:
    """
    Generic reputation update method for atomic escrow transactions.
    Only callable by authorized escrow contract.
    """
    agent_address = agent_addr.get()
    
    return Seq(
        # Strict authorization - only escrow contract for atomic updates
        Assert(Txn.sender() == app.state.escrow_contract.get()),
        
        # Ensure agent exists
        Assert(App.box_get(agent_address)[1]),
        
        # Validate inputs for successful tasks
        If(successful.get())
        .Then(Seq(
            Assert(quality_rating.get() >= Int(100)),
            Assert(quality_rating.get() <= Int(500)),
            Assert(response_time.get() <= Int(86400)),
        )),
        
        # Update metrics
        update_agent_metrics(
            agent_address,
            response_time.get(),
            quality_rating.get(),
            task_value.get(),
            If(successful.get(), Int(1), Int(0)),
            If(disputed.get(), Int(1), Int(0)),
        ),
        
        # Emit update event
        Log(Concat(
            Bytes("REPUTATION_UPDATED:"),
            agent_address,
            Bytes(":"),
            Itob(get_reputation_score(agent_address)),
            Bytes(":"),
            If(successful.get(), Bytes("SUCCESS"), Bytes("FAILURE")),
            If(disputed.get(), Bytes(":DISPUTED"), Bytes(""))
        )),
        
        Approve(),
    )


# ─── Read-only queries ────────────────────────────────────────────────────────
@app.external(read_only=True)
def get_score(agent_addr: abi.Address, *, output: abi.Uint64) -> Expr:
    """Get agent's current reputation score (0-1000)."""
    return output.set(get_reputation_score(agent_addr.get()))


@app.external(read_only=True)
def get_agent_reputation(
    agent_addr: abi.Address,
    *,
    output: abi.Tuple[
        abi.Uint64,  # reputation_score
        abi.Uint64,  # total_calls
        abi.Uint64,  # successful_calls
        abi.Uint64,  # disputed_calls
        abi.Uint64,  # total_volume
        abi.Uint64,  # avg_response_time
        abi.Uint64,  # avg_quality_rating
        abi.Uint64,  # registration_round
        abi.Uint64,  # last_updated_round
        abi.Bool,    # is_active
        abi.Uint64,  # specializations
    ]
) -> Expr:
    """Get complete agent reputation data."""
    agent_address = agent_addr.get()
    box_data, exists = App.box_get(agent_address)
    
    return If(exists).Then(
        output.set(
            get_reputation_score(agent_address),
            get_total_calls(agent_address),
            get_successful_calls(agent_address),
            get_disputed_calls(agent_address),
            get_total_volume(agent_address),
            get_avg_response_time(agent_address),
            get_avg_quality(agent_address),
            Btoi(Extract(box_data, Int(56), Int(8))),  # registration_round
            Btoi(Extract(box_data, Int(64), Int(8))),  # last_updated_round
            Btoi(Extract(box_data, Int(72), Int(1))),  # is_active
            get_specializations(agent_address),
        )
    ).Else(
        # Return default values for non-existent agent
        output.set(
            DEFAULT_REPUTATION, Int(0), Int(0), Int(0), Int(0), 
            Int(0), Int(300), Int(0), Int(0), Int(0), SPEC_GENERAL
        )
    )


@app.external(read_only=True)
def get_success_rate(agent_addr: abi.Address, *, output: abi.Uint64) -> Expr:
    """Get agent's success rate as percentage (0-100)."""
    agent_address = agent_addr.get()
    total = get_total_calls(agent_address)
    successful = get_successful_calls(agent_address)
    disputed = get_disputed_calls(agent_address)
    
    return output.set(
        If(
            total > Int(0),
            ((successful - disputed) * Int(100)) / total,
            Int(0)  # No tasks yet
        )
    )


# ─── Administrative functions ─────────────────────────────────────────────────
@app.external
def set_agent_active(agent_addr: abi.Address, active: abi.Bool) -> Expr:
    """Set agent active status. Only callable by admin."""
    agent_address = agent_addr.get()
    
    return Seq(
        # Only admin can modify agent status
        Assert(Txn.sender() == app.state.admin.get()),
        
        # Ensure agent exists
        Assert(App.box_get(agent_address)[1]),
        
        # Update active status in box
        If(App.box_get(agent_address)[1]).Then(Seq(
            box_data := App.box_get(agent_address)[0],
            App.box_put(
                agent_address,
                Concat(
                    Extract(box_data, Int(0), Int(72)),    # Keep all data up to is_active
                    If(active.get(), Bytes("base16", "01"), Bytes("base16", "00")),  # is_active
                    Extract(box_data, Int(73), Int(8)),    # specializations
                )
            )
        )),
        
        # Emit status change event
        Log(Concat(
            Bytes("AGENT_STATUS_CHANGED:"),
            agent_address,
            Bytes(":"),
            If(active.get(), Bytes("ACTIVE"), Bytes("INACTIVE"))
        )),
        
        Approve(),
    )


@app.external
def update_authorized_addresses(
    new_escrow: abi.Address,
    new_router: abi.Address,
) -> Expr:
    """Update authorized contract addresses. Only callable by admin."""
    return Seq(
        # Only admin can update authorized addresses
        Assert(Txn.sender() == app.state.admin.get()),
        
        app.state.escrow_contract.set(new_escrow.get()),
        app.state.router_address.set(new_router.get()),
        
        # Emit authorization update event
        Log(Concat(
            Bytes("AUTHORIZATION_UPDATED:"),
            new_escrow.get(),
            Bytes(":"),
            new_router.get()
        )),
        
        Approve(),
    )


# ─── Deploy helper ────────────────────────────────────────────────────────────
def deploy():
    """Deploy the reputation registry to Algorand TestNet."""
    algod_client = algod.AlgodClient(
        "",
        os.environ.get("ALGOD_URL", "https://testnet-api.algonode.cloud"),
    )

    deployer_mnemonic = os.environ.get("ROUTER_MNEMONIC", "")
    if not deployer_mnemonic:
        print("ERROR: ROUTER_MNEMONIC env var not set.")
        sys.exit(1)

    deployer_key = mnemonic.to_private_key(deployer_mnemonic)
    deployer_addr = account.address_from_private_key(deployer_key)

    # Default addresses for initial deployment
    escrow_contract_addr = os.environ.get("ESCROW_CONTRACT_ADDRESS", deployer_addr)
    router_addr = os.environ.get("ROUTER_ADDRESS", deployer_addr)

    print(f"Deploying ReputationRegistry from {deployer_addr} …")
    print(f"Admin: {deployer_addr}")
    print(f"Escrow Contract: {escrow_contract_addr}")
    print(f"Router Address: {router_addr}")

    # Build approval + clear programs
    approval, clear = app.build().programs

    sp = algod_client.suggested_params()
    sp.flat_fee = True
    sp.fee = 3000  # Higher fee for box operations

    # Create application transaction
    txn = transaction.ApplicationCreateTxn(
        sender=deployer_addr,
        sp=sp,
        on_complete=transaction.OnComplete.NoOpOC,
        approval_program=approval,
        clear_program=clear,
        global_schema=transaction.StateSchema(num_uints=0, num_byte_slices=3),
        local_schema=transaction.StateSchema(num_uints=0, num_byte_slices=0),
        app_args=[
            algosdk.encoding.decode_address(deployer_addr),
            algosdk.encoding.decode_address(escrow_contract_addr),
            algosdk.encoding.decode_address(router_addr),
        ],
        extra_pages=2,  # Additional pages for box operations
    )

    signed = txn.sign(deployer_key)
    tx_id = algod_client.send_transaction(signed)
    print(f"Deploy txn sent: {tx_id}")

    result = transaction.wait_for_confirmation(algod_client, tx_id, 4)
    app_id = result["application-index"]
    app_addr = algosdk.logic.get_application_address(app_id)

    print(f"\n✅ ReputationRegistry deployed!")
    print(f"   App ID      : {app_id}")
    print(f"   App Address : {app_addr}")
    print(f"\nAdd to your .env:")
    print(f"   REPUTATION_APP_ID={app_id}")
    print(f"\nNext: Fund the app address with ALGO for box storage fees.")

    return app_id


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "deploy":
        deploy()
    else:
        # Export ABI JSON for the TypeScript SDK
        spec = app.build()
        with open("reputation_abi.json", "w") as f:
            json.dump(spec.to_json(), f, indent=2)
        print("ABI written to reputation_abi.json")
        print("Run with `python reputation_contract.py deploy` to deploy to TestNet.")