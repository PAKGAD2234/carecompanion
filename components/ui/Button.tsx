import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#8B5CE7] text-[#FAF7FF] hover:bg-[#7C3AED]",
  secondary: "bg-[#A78BFA] text-[#29213D] hover:brightness-95",
  outline: "border-2 border-[#8B5CE7] bg-transparent text-[#8B5CE7] hover:bg-[#8B5CE7]/10",
  danger: "bg-[#D64545] text-[#FAF7FF] hover:brightness-90",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-[1.25rem] px-6 py-3 text-lg font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}