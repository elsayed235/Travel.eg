import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  consequence?: string;
  entityLabel?: string;
  amountEGP?: number;
  reasonRequired?: boolean;
  confirmLabel?: string;
  confirmColor?: 'emerald' | 'red' | 'amber';
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen, title, description, consequence, entityLabel, amountEGP,
  reasonRequired = false, confirmLabel = 'Confirm', confirmColor = 'emerald',
  onConfirm, onCancel,
}) => {
  const [reason, setReason] = React.useState('');
  const reasonRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && reasonRequired) {
      setTimeout(() => reasonRef.current?.focus(), 100);
    }
    setReason('');
  }, [isOpen, reasonRequired]);

  if (!isOpen) return null;

  const colors = {
    emerald: 'bg-[#20A89A] hover:bg-[#1B8F83] text-[#04171D]',
    red: 'bg-red-500 hover:bg-red-600 text-white',
    amber: 'bg-amber-500 hover:bg-amber-600 text-[#04171D]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md mx-4 bg-[#062C35] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F7F3EA]">{title}</h3>
              {entityLabel && <div className="text-[10px] text-white/40 font-mono mt-0.5">{entityLabel}</div>}
            </div>
          </div>
          <button type="button" onClick={onCancel} className="text-white/40 hover:text-white/70 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-white/70">{description}</p>

        {consequence && (
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
            <div className="text-[11px] text-amber-300 font-bold">What will happen:</div>
            <div className="text-[11px] text-white/60 mt-1">{consequence}</div>
          </div>
        )}

        {amountEGP !== undefined && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-white/40">Amount</div>
            <div className="text-lg font-bold text-[#E7A83B] font-mono">{amountEGP.toLocaleString()} EGP</div>
          </div>
        )}

        {reasonRequired && (
          <div>
            <label className="text-[10px] text-white/40 font-bold">Reason (required)</label>
            <input
              ref={reasonRef}
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Why is this action being taken?"
              className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F7F3EA] placeholder-white/30 focus:outline-none focus:border-[#20A89A]/50"
            />
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button type="button" onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 text-xs font-bold hover:bg-white/5 transition-all cursor-pointer">
            Cancel
          </button>
          <button type="button" onClick={() => onConfirm(reasonRequired ? reason : undefined)}
            disabled={reasonRequired && !reason.trim()}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${colors[confirmColor]}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
