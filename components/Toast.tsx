"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error";

export type ToastState = {
  message: string;
  type: ToastType;
} | null;

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);

  function show(message: string, type: ToastType = "success") {
    setToast({ message, type });
  }

  return { toast, show, clear: () => setToast(null) };
}

export function Toast({
  toast,
  onDone,
}: {
  toast: NonNullable<ToastState>;
  onDone: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast, onDone]);

  const isSuccess = toast.type === "success";

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-2.5
        px-5 py-3 rounded-xl shadow-lg border
        text-sm font-medium
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        ${isSuccess
          ? "bg-emerald-jewel/10 border-emerald-jewel/30 text-emerald-jewel"
          : "bg-ruby-jewel/10 border-ruby-jewel/30 text-ruby-jewel"
        }
      `}
    >
      <span className="text-base leading-none">
        {isSuccess ? "✓" : "!"}
      </span>
      <span>{toast.message}</span>
    </div>
  );
}
