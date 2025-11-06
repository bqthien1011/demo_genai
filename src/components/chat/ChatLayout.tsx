"use client";

import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  prompts: React.ReactNode;
  messages: React.ReactNode;
  composer: React.ReactNode;
  className?: string;
}

export function ChatLayout({
  prompts,
  messages,
  composer,
  className,
}: ChatLayoutProps) {
  return (
    <div
      className={cn(
        "relative flex h-full max-h-screen flex-col overflow-hidden rounded-3xl border border-white/30",
        "bg-[radial-gradient(circle_at_top,_#fbfcff,_#f2f4ff_45%,_#ece8ff_100%)]",
        "p-6 shadow-[0_24px_60px_-20px_rgba(36,57,133,0.35)]",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-br from-[#f3f6ff] via-white to-[#faf3ff] blur-3xl" />
      <div className="flex-1 overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-inner">
        {messages}
      </div>
      <div className="mt-4 rounded-2xl border border-white/60 bg-white/85 p-5 shadow-[0_18px_40px_-24px_rgba(36,57,133,0.4)] backdrop-blur">
        {prompts}
        <div className="mt-5 border-t border-white/60 pt-5">{composer}</div>
      </div>
    </div>
  );
}
