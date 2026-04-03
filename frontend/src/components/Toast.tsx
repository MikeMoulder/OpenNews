"use client";

import { useEffect, useState, useCallback } from "react";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismiss };
}

const TYPE_STYLES = {
  success: "border-[var(--accent-green)]/30 text-[var(--accent-green)]",
  error: "border-[var(--accent-red)]/30 text-[var(--accent-red)]",
  info: "border-[var(--border)] text-[var(--text-secondary)]",
} as const;

export function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      onClick={() => onDismiss(toast.id)}
      className={`cursor-pointer font-mono text-xs px-3 py-2 border rounded-sm bg-white dark:bg-[#0a0a0a] shadow-lg transition-all duration-200 ${TYPE_STYLES[toast.type]
        } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {toast.message}
    </div>
  );
}
