import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#8B5CE7]/15 bg-[#29213D] px-5 py-8 text-[#FAF7FF]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-3 font-bold">
          <Image
            src="/images/illustrations/logo.png"
            alt="Care Companion"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          Care Companion
        </p>
        <p className="text-base text-[#A78BFA]">เดินทางอย่างมั่นใจ มีคนดูแลเคียงข้าง</p>
      </div>
    </footer>
  );
}