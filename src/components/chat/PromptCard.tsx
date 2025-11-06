"use client";

import { cn } from "@/lib/utils";

export interface PromptCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
  className?: string;
}

export function PromptCard({
  title,
  description,
  icon,
  onSelect,
  className,
}: PromptCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "group relative flex w-full min-w-[220px] flex-col items-start gap-2 overflow-hidden rounded-2xl",
        "border border-white/60 bg-white/80 px-6 py-5 text-left shadow-[0_14px_35px_-24px_rgba(36,57,133,0.45)]",
        "transition-all duration-200 hover:-translate-y-1 hover:border-white/80 hover:bg-white focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-200",
        className
      )}
      style={{ cursor: "pointer" }}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        {icon ?? "💎"}
      </span>
      <span className="text-base font-semibold leading-tight text-slate-900">
        {title}
      </span>
      {description ? (
        <span className="text-sm text-slate-600">{description}</span>
      ) : null}
      <span className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-100/60 via-transparent to-purple-200/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </button>
  );
}
