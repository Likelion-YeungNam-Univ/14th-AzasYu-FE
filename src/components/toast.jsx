import { useEffect, useState } from "react";
import { cn } from "@/lib";

export function Toast({ message, duration = 2000, onDone, className }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!message) {
      setOpen(false);
      return;
    }

    setOpen(true);

    const hideTimer = window.setTimeout(() => setOpen(false), duration);
    const doneTimer = window.setTimeout(() => onDone?.(), duration + 200);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(doneTimer);
    };
  }, [message, duration, onDone]);

  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-[40px] z-[200] flex justify-center px-5",
        className,
      )}
    >
      <span
        className={cn(
          "text-16 rounded-[59px] bg-[#1c232b] px-[20px] py-[12px] font-medium whitespace-nowrap text-white",
          "shadow-[0_8px_24px_0_rgba(0,0,0,0.18)] transition-[opacity,translate] duration-200",
          open ? "translate-y-0 opacity-100" : "translate-y-[8px] opacity-0",
        )}
      >
        {message}
      </span>
    </div>
  );
}
