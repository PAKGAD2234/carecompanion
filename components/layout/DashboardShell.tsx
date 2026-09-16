import type { ReactNode } from "react";
import type { UserRole } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

type DashboardShellProps = {
  role: UserRole;
  title: string;
  description: string;
  children?: ReactNode;
};

export function DashboardShell({ role, title, description, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar role={role} />
        <main className="flex-1 px-5 py-8 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-extrabold text-[#29213D]">{title}</h1>
            <p className="mt-3 text-lg text-[#29213D]/75">{description}</p>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}