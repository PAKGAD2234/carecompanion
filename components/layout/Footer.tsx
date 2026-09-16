import { HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#2E2E2E]/10 bg-[#2E2E2E] px-5 py-8 text-[#FAFAF8]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 font-bold"><HeartHandshake size={22} strokeWidth={2} aria-hidden="true" /> Care Companion</p>
        <p className="text-base opacity-85">เดินทางอย่างมั่นใจ มีคนดูแลเคียงข้าง</p>
      </div>
    </footer>
  );
}