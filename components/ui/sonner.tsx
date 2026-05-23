"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster(props: React.ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      theme="dark"
      toastOptions={{
        classNames: {
          toast:
            "bg-slate-900/90 border border-white/10 text-slate-100 shadow-xl",
          description: "text-slate-400",
          actionButton: "bg-cyan-500 text-slate-950",
          cancelButton: "bg-slate-800 text-slate-100",
        },
      }}
      {...props}
    />
  );
}
