"use client";

import { CheckCircle2, X } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";

type Toast = { id: number; text: string; tone: "success" | "danger" };

const ToastContext = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((text: string, tone: Toast["tone"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="no-print pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex max-w-md items-center gap-3 rounded-full border-2 border-edge px-5 py-3 text-sm font-semibold shadow-card ${
              t.tone === "success" ? "bg-ink text-bg" : "bg-danger text-white"
            }`}
          >
            <CheckCircle2 className="size-5 shrink-0 text-accent" aria-hidden="true" />
            <span>{t.text}</span>
            <button
              type="button"
              className="ml-1 rounded p-0.5 opacity-70 hover:opacity-100"
              onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
              aria-label="×"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
