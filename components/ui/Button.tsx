import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#1F8F73] text-[#FAFAF8] hover:bg-[#187A62]",
  secondary: "bg-[#F5A65B] text-[#2E2E2E] hover:brightness-95",
  outline: "border-2 border-[#1F8F73] bg-transparent text-[#1F8F73] hover:bg-[#1F8F73]/10",
  danger: "bg-[#D64545] text-[#FAFAF8] hover:brightness-90",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-[1.25rem] px-6 py-3 text-lg font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}