import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[1.25rem] border border-[#29213D]/10 bg-[#FFFFFF] p-6 shadow-[0_8px_24px_rgba(41,33,61,0.08)] ${className}`}
      {...props}
    />
  );
}