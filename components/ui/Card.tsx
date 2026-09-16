import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[1.25rem] border border-[#2E2E2E]/10 bg-[#FAFAF8] p-6 shadow-[0_8px_24px_rgba(46,46,46,0.08)] ${className}`}
      {...props}
    />
  );
}