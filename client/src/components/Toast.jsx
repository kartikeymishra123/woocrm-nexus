import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-950/50'
                : isError
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-950/50'
                : 'bg-slate-900/90 border-indigo-500/40 text-slate-100 shadow-indigo-950/50'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : isError ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-sm">
              {toast.title && <div className="font-semibold mb-0.5">{toast.title}</div>}
              <div className="text-xs opacity-90 leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
