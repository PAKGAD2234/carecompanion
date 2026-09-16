import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-lg font-bold text-[#29213D]" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`min-h-14 w-full rounded-[1.25rem] border-2 bg-[#FAF7FF] px-4 text-lg text-[#29213D] outline-none transition-colors placeholder:text-[#29213D]/50 focus:border-[#8B5CE7] ${error ? "border-[#D64545]" : "border-[#29213D]/20"} ${className}`}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <p className="text-base font-semibold text-[#D64545]">{error}</p> : null}
    </div>
  );
}