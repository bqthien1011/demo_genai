"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export type MessageBubbleStatus = "sent" | "delivered" | "read";

export interface MessageBubbleProps {
  text: string;
  isUser?: boolean;
  image?: string;
  timestamp?: string;
  status?: MessageBubbleStatus;
  className?: string;
  renderMarkdown?: boolean;
}

export function MessageBubble({
  text,
  isUser = false,
  image,
  timestamp,
  status,
  className,
  renderMarkdown = false,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "group relative max-w-[72%] rounded-3xl px-6 py-4 text-sm leading-relaxed transition-all duration-200",
        "shadow-[0_18px_40px_-20px_rgba(32,79,150,0.35)] ring-1 ring-white/40 backdrop-blur-xl",
        isUser
          ? "ml-auto bg-[radial-gradient(circle_at_top_left,_rgba(31,77,174,0.92),_rgba(14,43,113,0.96))] text-white"
          : "bg-white/85 text-slate-900",
        className
      )}
    >
      {renderMarkdown ? (
        <div className="prose prose-sm max-w-none prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-code:text-inherit prose-pre:bg-slate-100 prose-pre:text-slate-900 prose-blockquote:border-slate-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      ) : (
        <p className="whitespace-pre-line">{text}</p>
      )}
      {image ? (
        <div className="mt-3 overflow-hidden rounded-2xl border border-white/50 shadow-inner">
          <Image
            src={image}
            alt="Uploaded"
            width={220}
            height={220}
            className="h-auto w-full object-cover"
          />
        </div>
      ) : null}
      {(timestamp || status) && (
        <div
          className={cn(
            "mt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em]",
            isUser ? "text-white/80" : "text-slate-500"
          )}
        >
          {timestamp ? <span>{timestamp}</span> : null}
          {status ? <span>{status}</span> : null}
        </div>
      )}
      <span
        className={cn(
          "pointer-events-none absolute -bottom-4 h-6 w-6 rounded-full blur-2xl transition-all duration-500",
          isUser ? "right-8 bg-blue-400/70" : "left-8 bg-indigo-200/70",
          "opacity-0 group-hover:opacity-100"
        )}
      />
    </div>
  );
}
