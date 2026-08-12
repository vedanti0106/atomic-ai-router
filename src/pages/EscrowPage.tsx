import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { 
  Lock, 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle, 
  Plane, 
  Stethoscope, 
  Scale, 
  Tag, 
  ExternalLink,
  FileCode
} from 'lucide-react';

type EscrowStatus = 'FUNDED' | 'RELEASED' | 'REFUNDED' | 'DISPUTED';

interface EscrowRecord {
  id: string;
  taskId: string;
  taskGoal: string;
  appId: number;
  boxKey: string;
  payerAddress: string;
  agentAddress: string;
  agentName: string;
  agentIcon: React.ReactNode;
  amountUsdc: number;
  status: EscrowStatus;
  deadlineRound: number;
  currentRound: number;
  roundsLeft: number;
  secondsLeft: number;
  canRefundNow: boolean;
  proofHash?: string;
  txidFund?: string;
  txidRelease?: string;
  txidRefund?: string;
  createdAt: string;
}

const MOCK_CURRENT_ROUND = 47_312_450;

const mockEscrows: EscrowRecord[] = [
  {
    id: 'escrow_task_88c42d',
    taskId: 'task_88c42d',
    taskGoal: 'Compare prices across 5 online stores for Sony WH-1000XM5 headphones.',
    appId: 741_209_831,
    boxKey: 'task_88c42d',
    payerAddress: 'ALGO_ROUTER_MAIN_W9812A4789X012',
    agentAddress: 'ALGO_SHOP_W109...8L',
    agentName: 'Price Scraper AI',
    agentIcon: <Tag className="w-4 h-4 text-blue-600" />,
    amountUsdc: 2.50,
    status: 'FUNDED',
    deadlineRound: MOCK_CURRENT_ROUND + 187,
    currentRound: MOCK_CURRENT_ROUND,
    roundsLeft: 187,
    secondsLeft: 748,
    canRefundNow: false,
    txidFund: 'TX_ALG_54109E334B',
    createdAt: 'Just now',
  },
  {
    id: 'escrow_task_9f31ab',
    taskId: 'task_9f31ab',
    taskGoal: 'Plan a 3-day trip to Goa under ₹20,000 with flights, hotels and weather.',
    appId: 741_209_831,
    boxKey: 'task_9f31ab',
    payerAddress: 'ALGO_ROUTER_MAIN_W9812A4789X012',
    agentAddress: 'ALGO_FLIGHT_W481...9X',
    agentName: 'Flight AI',
    agentIcon: <Plane className="w-4 h-4 text-blue-600" />,
    amountUsdc: 7.00,
    status: 'RELEASED',
    deadlineRound: MOCK_CURRENT_ROUND - 50,
    currentRound: MOCK_CURRENT_ROUND,
    roundsLeft: 0,
    secondsLeft: 0,
    canRefundNow: false,
    proofHash: 'a3f8c2d9e1b047...6f2a',
    txidFund: 'TX_ALG_99201A843F',
    txidRelease: 'TX_ALG_REL_9921B',
    createdAt: '3 mins ago',
  },
  {
    id: 'escrow_task_77a11e',
    taskId: 'task_77a11e',
    taskGoal: 'Hospital Assistant: Symptom triage, pharmacy check, and insurance verification.',
    appId: 741_209_831,
    boxKey: 'task_77a11e',
    payerAddress: 'ALGO_ROUTER_MAIN_W9812A4789X012',
    agentAddress: 'ALGO_HEALTH_W331...2M',
    agentName: 'Symptom Checker AI',
    agentIcon: <Stethoscope className="w-4 h-4 text-emerald-600" />,
    amountUsdc: 6.00,
    status: 'REFUNDED',
    deadlineRound: MOCK_CURRENT_ROUND - 320,
    currentRound: MOCK_CURRENT_ROUND,
    roundsLeft: 0,
    secondsLeft: 0,
    canRefundNow: false,
    txidFund: 'TX_ALG_77810C110A',
    txidRefund: 'REFUND_TX_1102A',
    createdAt: '18 mins ago',
  },
  {
    id: 'escrow_task_disp_01',
    taskId: 'task_disp_01',
    taskGoal: 'Legal document review and clause extraction for NDA agreement.',
    appId: 741_209_831,
    boxKey: 'task_disp_01',
    payerAddress: 'ALGO_ROUTER_MAIN_W9812A4789X012',
    agentAddress: 'ALGO_LEGAL_W554...3Q',
    agentName: 'Legal Review AI',
    agentIcon: <Scale className="w-4 h-4 text-purple-600" />,
    amountUsdc: 8.50,
    status: 'DISPUTED',
    deadlineRound: MOCK_CURRENT_ROUND + 12,
    currentRound: MOCK_CURRENT_ROUND,
    roundsLeft: 12,
    secondsLeft: 48,
    canRefundNow: false,
    txidFund: 'TX_ALG_DISP_8812A',
    createdAt: '32 mins ago',
  },
];

const STATUS_CONFIG: Record<EscrowStatus, { label: string; color: string; bg: string; border: string; dot: string; icon: string }> = {
  FUNDED:   { label: 'Funds Locked',  color: 'text-amber-800',   bg: 'bg-amber-100',   border: 'border-amber-300',  dot: 'bg-amber-500',   icon: '🔒' },
  RELEASED: { label: 'Released',      color: 'text-[#0E7D69]', bg: 'bg-[#E3FBF5]', border: 'border-emerald-200',dot: 'bg-emerald-500', icon: '✅' },
  REFUNDED: { label: 'Auto-Refunded', color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',   dot: 'bg-blue-500',    icon: '↩' },
  DISPUTED: { label: 'Disputed',      color: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200',   dot: 'bg-rose-500',    icon: '⚠' },
};

function CountdownTimer({ secondsLeft, deadlineRound }: { secondsLeft: number; deadlineRound: number }) {
  const [secs, setSecs] = useState(secondsLeft);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(secs / 60);
  const s    = secs % 60;
  const pct  = Math.min(100, Math.max(0, ((secondsLeft - secs) / secondsLeft) * 100));
  const urgent = secs < 120;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-slate-500 font-medium">Deadline</span>
        <span className={`font-mono font-bold ${urgent && secs > 0 ? 'text-rose-600 animate-pulse' : 'text-navy'}`}>
          {secs > 0 ? `${mins}m ${s.toString().padStart(2,'0')}s` : 'Expired'}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${urgent ? 'bg-rose-400' : 'bg-amber-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-[11px] text-slate-400">Round {deadlineRound.toLocaleString()}</div>
    </div>
  );
}

function EscrowCard({ escrow, onAction }: { escrow: EscrowRecord; onAction: (action: string, taskId: string) => void }) {
  const cfg = STATUS_CONFIG[escrow.status];

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-400">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100/80 border border-slate-200/60 flex items-center justify-center text-blue-brand shrink-0 shadow-xs">
            {escrow.agentIcon}
          </div>
          <div>
            <div className="text-[14px] font-bold text-navy leading-tight">{escrow.agentName}</div>
            <div className="font-mono text-[11px] text-blue-brand font-bold">{escrow.taskId}</div>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-bold border shadow-xs ${cfg.bg} ${cfg.color} ${cfg.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${escrow.status === 'FUNDED' ? 'animate-pulse' : ''}`} />
          {cfg.icon} {cfg.label}
        </div>
      </div>

      {/* Goal */}
      <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2">{escrow.taskGoal}</p>

      {/* Amount + App ID */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50/80 rounded-[14px] p-3 border border-slate-200/60">
          <div className="text-[11px] text-slate-400 font-semibold mb-0.5">Locked Amount</div>
          <div className="text-[18px] font-bold font-display text-navy">{escrow.amountUsdc.toFixed(2)} <span className="text-[12px] text-blue-brand">USDC</span></div>
        </div>
        <div className="bg-slate-50/80 rounded-[14px] p-3 border border-slate-200/60">
          <div className="text-[11px] text-slate-400 font-semibold mb-0.5">Escrow App ID</div>
          <div className="font-mono text-[13px] font-bold text-navy">{escrow.appId.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Box: {escrow.boxKey}</div>
        </div>
      </div>

      {/* Countdown (only for FUNDED / DISPUTED) */}
      {(escrow.status === 'FUNDED' || escrow.status === 'DISPUTED') && escrow.secondsLeft > 0 && (
        <CountdownTimer secondsLeft={escrow.secondsLeft} deadlineRound={escrow.deadlineRound} />
      )}

      {/* Proof hash (RELEASED) */}
      {escrow.status === 'RELEASED' && escrow.proofHash && (
        <div className="bg-[#E3FBF5] border border-emerald-200 rounded-[14px] p-3">
          <div className="text-[11px] font-bold text-[#0E7D69] mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivery Proof (SHA-256)
          </div>
          <div className="font-mono text-[11px] text-[#0E7D69] break-all">{escrow.proofHash}</div>
        </div>
      )}

      {/* TxID links */}
      <div className="flex flex-col gap-1">
        {escrow.txidFund && (
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-slate-400 w-14 shrink-0 font-medium">Fund:</span>
            <span className="font-mono text-blue-brand font-bold">{escrow.txidFund}</span>
          </div>
        )}
        {escrow.txidRelease && (
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-slate-400 w-14 shrink-0 font-medium">Release:</span>
            <span className="font-mono text-emerald-600 font-bold">{escrow.txidRelease}</span>
          </div>
        )}
        {escrow.txidRefund && (
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-slate-400 w-14 shrink-0 font-medium">Refund:</span>
            <span className="font-mono text-blue-brand font-bold">{escrow.txidRefund}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-200/80 flex flex-wrap gap-2 mt-auto">
        {escrow.status === 'FUNDED' && (
          <>
            <button
              onClick={() => onAction('release', escrow.taskId)}
              className="flex-1 px-3 py-2 bg-emerald-600 text-white text-[12px] font-bold rounded-full hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
            >
              ✅ Release Funds
            </button>
            <button
              onClick={() => onAction('dispute', escrow.taskId)}
              className="px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 text-[12px] font-bold rounded-full hover:bg-rose-100 transition-colors cursor-pointer"
            >
              ⚠ Dispute
            </button>
            {escrow.canRefundNow && (
              <button
                onClick={() => onAction('refund', escrow.taskId)}
                className="flex-1 px-3 py-2 bg-blue-brand text-white text-[12px] font-bold rounded-full hover:bg-blue-dark transition-colors cursor-pointer shadow-xs"
              >
                ↩ Trigger Refund
              </button>
            )}
          </>
        )}
        {escrow.status === 'DISPUTED' && (
          <>
            <button
              onClick={() => onAction('resolve-release', escrow.taskId)}
              className="flex-1 px-3 py-2 bg-emerald-600 text-white text-[12px] font-bold rounded-full hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
            >
              Release to Agent
            </button>
            <button
              onClick={() => onAction('resolve-refund', escrow.taskId)}
              className="flex-1 px-3 py-2 bg-blue-brand text-white text-[12px] font-bold rounded-full hover:bg-blue-dark transition-colors cursor-pointer shadow-xs"
            >
              Refund Payer
            </button>
          </>
        )}
        <button
          onClick={() => alert(`Opening Algorand TestNet Explorer for App ID ${escrow.appId}…`)}
          className="px-3 py-2 bg-blue-50 text-blue-brand text-[12px] font-bold rounded-full hover:bg-blue-brand hover:text-white transition-colors cursor-pointer flex items-center gap-1 border border-blue-100"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Explorer
        </button>
      </div>

      <div className="text-[11px] text-slate-400">{escrow.createdAt}</div>
    </div>
  );
}

const EscrowPage: React.FC = () => {
  const [escrows, setEscrows] = useState<EscrowRecord[]>(mockEscrows);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [actionLog, setActionLog] = useState<{ msg: string; txId: string; ts: string }[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  const filtered = filterStatus === 'ALL' ? escrows : escrows.filter(e => e.status === filterStatus);

  const counts = {
    ALL: escrows.length,
    FUNDED: escrows.filter(e => e.status === 'FUNDED').length,
    RELEASED: escrows.filter(e => e.status === 'RELEASED').length,
    REFUNDED: escrows.filter(e => e.status === 'REFUNDED').length,
    DISPUTED: escrows.filter(e => e.status === 'DISPUTED').length,
  };

  const totalLocked = escrows.filter(e => e.status === 'FUNDED' || e.status === 'DISPUTED')
    .reduce((s, e) => s + e.amountUsdc, 0);

  const totalReleased = escrows.filter(e => e.status === 'RELEASED')
    .reduce((s, e) => s + e.amountUsdc, 0);

  const totalRefunded = escrows.filter(e => e.status === 'REFUNDED')
    .reduce((s, e) => s + e.amountUsdc, 0);

  function mockTxId() {
    return 'TX_ALG_' + Math.random().toString(36).slice(2, 10).toUpperCase();
  }

  function handleAction(action: string, taskId: string) {
    setProcessing(taskId);
    setTimeout(() => {
      const txId = mockTxId();
      setEscrows(prev => prev.map(e => {
        if (e.taskId !== taskId) return e;
        if (action === 'release')         return { ...e, status: 'RELEASED', txidRelease: txId, proofHash: 'sha256_proof_' + txId.toLowerCase(), roundsLeft: 0, secondsLeft: 0, canRefundNow: false };
        if (action === 'refund')          return { ...e, status: 'REFUNDED', txidRefund: txId, roundsLeft: 0, secondsLeft: 0, canRefundNow: false };
        if (action === 'dispute')         return { ...e, status: 'DISPUTED' };
        if (action === 'resolve-release') return { ...e, status: 'RELEASED', txidRelease: txId, proofHash: 'admin_resolved_' + txId.toLowerCase(), roundsLeft: 0, secondsLeft: 0 };
        if (action === 'resolve-refund')  return { ...e, status: 'REFUNDED', txidRefund: txId, roundsLeft: 0, secondsLeft: 0 };
        return e;
      }));

      const msgs: Record<string, string> = {
        release:          `✅ Funds released to agent`,
        refund:           `↩ Auto-refund triggered — funds returned to payer`,
        dispute:          `⚠ Dispute raised — funds frozen pending admin`,
        'resolve-release':`Admin resolved: funds released to agent`,
        'resolve-refund': `Admin resolved: funds refunded to payer`,
      };
      setActionLog(prev => [{ msg: `${msgs[action]} for ${taskId}`, txId, ts: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
      setProcessing(null);
    }, 1400);
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[24px] md:text-[32px] font-bold font-display text-navy leading-tight">
              Trustless Escrow
            </h1>
            <p className="text-[14px] md:text-[15px] text-slate-500 mt-1 max-w-[600px]">
              Funds are held by a neutral Algorand smart contract (App ID 741,209,831) and only released on verified delivery — or auto-refunded after deadline.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12.5px] font-bold text-emerald-800">Algorand TestNet — Round {MOCK_CURRENT_ROUND.toLocaleString()}</span>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Locked',    value: `$${totalLocked.toFixed(2)}`,    sub: `${counts.FUNDED + counts.DISPUTED} escrows active`,  color: 'text-amber-800',   bg: 'bg-white hover:border-amber-400 hover:shadow-amber-500/10 hover:bg-gradient-to-br hover:from-white hover:to-amber-50/20', icon: <Lock className="w-5 h-5 text-amber-600" />, iconBg: 'bg-amber-100 border border-amber-200' },
            { label: 'Total Released',  value: `$${totalReleased.toFixed(2)}`,  sub: `${counts.RELEASED} successful deliveries`,            color: 'text-[#0E7D69]', bg: 'bg-white hover:border-emerald-400 hover:shadow-emerald-500/10 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/20', icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, iconBg: 'bg-emerald-100 border border-emerald-200' },
            { label: 'Total Refunded',  value: `$${totalRefunded.toFixed(2)}`,  sub: `${counts.REFUNDED} auto-refunds triggered`,           color: 'text-blue-700',    bg: 'bg-white hover:border-blue-400 hover:shadow-blue-500/10 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/20', icon: <RotateCcw className="w-5 h-5 text-blue-600" />, iconBg: 'bg-blue-100 border border-blue-200' },
            { label: 'Open Disputes',   value: `${counts.DISPUTED}`,            sub: 'Awaiting admin resolution',                           color: 'text-rose-700',    bg: 'bg-white hover:border-rose-400 hover:shadow-rose-500/10 hover:bg-gradient-to-br hover:from-white hover:to-rose-50/20', icon: <AlertTriangle className="w-5 h-5 text-rose-600" />, iconBg: 'bg-rose-100 border border-rose-200' },
          ].map((m, i) => (
            <div key={i} className={`rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${m.bg}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-medium text-slate-500">{m.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${m.iconBg}`}>
                  {m.icon}
                </div>
              </div>
              <div className={`text-[26px] font-bold font-display ${m.color}`}>{m.value}</div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* How it works banner */}
        <div className="bg-white rounded-[24px] border border-slate-200/90 p-7 mb-8 shadow-[0_4px_24px_rgba(15,27,61,0.03)] hover:border-blue-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[16px] font-bold text-navy">Escrow State Machine</h3>
              <p className="text-[12.5px] text-slate-500 mt-0.5">Every escrow box lives on-chain. No human can touch funds outside these transitions.</p>
            </div>
            <span className="text-[11px] font-bold text-blue-brand bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wide">AVM Box Storage</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            {[
              { label: '① fund_escrow', desc: 'Client → Contract', color: 'bg-amber-100 text-amber-800 border-amber-300' },
              { label: '→', desc: '', color: 'bg-transparent text-slate-400 border-transparent' },
              { label: '② release_escrow', desc: 'Facilitator proof ✓', color: 'bg-[#E3FBF5] text-[#0E7D69] border-emerald-200' },
              { label: '/ refund_escrow', desc: 'Deadline passed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
              { label: '/ raise_dispute', desc: 'Payer flags issue', color: 'bg-rose-100 text-rose-800 border-rose-200' },
              { label: '→', desc: '', color: 'bg-transparent text-slate-400 border-transparent' },
              { label: '③ resolve_dispute', desc: 'Admin arbitrates', color: 'bg-purple-100 text-purple-800 border-purple-200' },
            ].map((s, i) => s.desc ? (
              <div key={i} className={`px-3 py-1.5 rounded-full border font-bold ${s.color}`}>
                {s.label} <span className="font-normal opacity-70">— {s.desc}</span>
              </div>
            ) : (
              <span key={i} className="text-slate-400 font-bold text-[16px]">{s.label}</span>
            ))}
          </div>
        </div>

        {/* Action log */}
        {actionLog.length > 0 && (
          <div className="bg-slate-900 rounded-[16px] p-4 mb-6 font-mono text-[12px] flex flex-col gap-1.5 shadow-xs">
            <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">On-chain Actions — Live Feed</div>
            {actionLog.map((l, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <span className="text-slate-500 flex-shrink-0">{l.ts}</span>
                <span className="text-emerald-400">{l.msg}</span>
                <span className="text-blue-400 ml-auto font-bold">{l.txId}</span>
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-[14px] w-fit mb-6 border border-slate-200/60">
          {(['ALL', 'FUNDED', 'RELEASED', 'REFUNDED', 'DISPUTED'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                filterStatus === s ? 'bg-blue-brand text-white shadow-xs' : 'text-slate-600 hover:bg-white hover:text-navy'
              }`}
            >
              {s !== 'ALL' && <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s].dot}`} />}
              {s} <span className="text-[11px] opacity-70">({counts[s as keyof typeof counts] ?? escrows.length})</span>
            </button>
          ))}
        </div>

        {/* Escrow cards grid */}
        {processing && (
          <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-300 rounded-[14px] text-[13px] text-amber-900 font-bold flex items-center gap-2 shadow-xs">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
            Submitting transaction to Algorand TestNet…
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map(escrow => (
            <EscrowCard key={escrow.id} escrow={escrow} onAction={handleAction} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 py-16 text-center text-slate-400 text-[14px]">
              No escrows with status {filterStatus}
            </div>
          )}
        </div>

        {/* Smart contract reference */}
        <div className="mt-8 bg-slate-900 rounded-[24px] p-6 sm:p-7 text-[12px] font-mono text-slate-400 border border-slate-800 shadow-md">
          <div className="text-slate-200 font-bold mb-4 text-[13.5px] flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-400" />
            <span>Smart Contract Reference — escrow_contract.py (Beaker + PyTeal)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { fn: 'fund_escrow(task_id, agent, amount, deadline, payment:axfer)', who: 'Router / Client', color: 'text-amber-400' },
              { fn: 'release_escrow(task_id, proof_hash:byte[])',                   who: 'Facilitator only', color: 'text-emerald-400' },
              { fn: 'refund_escrow(task_id)',                                        who: 'Anyone after deadline', color: 'text-blue-400' },
              { fn: 'raise_dispute(task_id)',                                        who: 'Payer only', color: 'text-rose-400' },
              { fn: 'resolve_dispute(task_id, release_to_agent:bool)',               who: 'Admin only', color: 'text-purple-400' },
            ].map((m, i) => (
              <div key={i} className="flex flex-col gap-0.5 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <span className={`font-bold ${m.color}`}>{m.fn}</span>
                <span className="text-slate-500 text-[11px]">Caller: {m.who}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800 text-slate-500 text-[11px]">
            Box Storage · AVM 8 · USDC ASA 10458941 · App ID 741,209,831 · Algorand TestNet
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default EscrowPage;

