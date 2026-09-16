import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-lg font-bold text-[#2E2E2E]" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`min-h-14 w-full rounded-[1.25rem] border-2 bg-[#FAFAF8] px-4 text-lg text-[#2E2E2E] outline-none transition-colors placeholder:text-[#2E2E2E]/50 focus:border-[#1F8F73] ${error ? "border-[#D64545]" : "border-[#2E2E2E]/20"} ${className}`}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <p className="text-base font-semibold text-[#D64545]">{error}</p> : null}
    </div>
  );
}