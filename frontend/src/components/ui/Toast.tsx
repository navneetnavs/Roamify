import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { TOAST_EVENT, type ToastKind } from './toastService';

interface ToastMessage {
  id: number;
  kind: ToastKind;
  message: string;
}

let nextToastId = 0;

export default function ToastViewport() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const timers = new Map<number, ReturnType<typeof setTimeout>>();
    const onToast = (event: Event) => {
      const { kind, message } = (event as CustomEvent<Omit<ToastMessage, 'id'>>).detail;
      const id = ++nextToastId;
      setMessages((current) => [...current, { id, kind, message }]);
      timers.set(id, setTimeout(() => dismiss(id), 5000));
    };

    const dismiss = (id: number) => {
      const timer = timers.get(id);
      if (timer) clearTimeout(timer);
      timers.delete(id);
      setMessages((current) => current.filter((toastMessage) => toastMessage.id !== id));
    };

    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3" aria-live="polite" aria-atomic="false">
      {messages.map(({ id, kind, message }) => {
        const Icon = kind === 'success' ? CheckCircle2 : kind === 'error' ? AlertCircle : Info;
        const color = kind === 'success' ? 'text-emerald-600' : kind === 'error' ? 'text-red-600' : 'text-blue-600';
        return (
          <div
            key={id}
            role={kind === 'error' ? 'alert' : 'status'}
            className="animate-fade-in flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
          >
            <Icon className={`mt-0.5 shrink-0 ${color}`} size={20} />
            <p className="min-w-0 flex-1 text-sm font-medium text-slate-800">{message}</p>
            <button
              type="button"
              className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Dismiss notification"
              onClick={() => {
                setMessages((current) => current.filter((toastMessage) => toastMessage.id !== id));
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
