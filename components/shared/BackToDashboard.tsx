"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Role = "customer" | "companion" | "admin";

type BackToDashboardProps = {
  compact?: boolean;
  role: Role;
};

export function BackToDashboard({
  compact = false,
}: BackToDashboardProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`
        fixed left-5 top-24 z-50
        flex items-center gap-2
        rounded-xl
        border border-[#1F8F73]/20
        bg-[#FAFAF8]
        px-4 py-3
        font-bold text-[#1F8F73]
        shadow-sm
        transition-all
        hover:bg-[#1F8F73]
        hover:text-white
        hover:shadow-md
        ${compact ? "text-base" : "text-lg"}
      `}
    >
      <ArrowLeft size={22} strokeWidth={2} />
      กลับ
    </button>
  );
}