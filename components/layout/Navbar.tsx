"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const { user, role } = useAuth();
  const router = useRouter();

  const dashboard = role ? `/${role}` : "/";

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-[#2E2E2E]/10 bg-[#FAFAF8]">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"
        aria-label="เมนูหลัก"
      >
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-extrabold text-[#1F8F73]"
        >
          <HeartHandshake
            size={30}
            strokeWidth={2}
            aria-hidden="true"
          />
          Care Companion
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                className="hidden rounded-xl px-4 py-3 font-bold text-[#1F8F73] hover:bg-[#1F8F73]/10 sm:block"
                href={dashboard}
              >
                หน้าหลัก
              </Link>

              <button
                className="flex min-h-12 items-center gap-2 rounded-xl px-4 py-3 font-bold text-[#D64545] hover:bg-[#D64545]/10"
                onClick={signOut}
              >
                <LogOut
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                ออกจากระบบ
              </button>
            </>
          ) : (
            <Link
              className="flex min-h-12 items-center gap-2 rounded-xl px-4 py-3 font-bold text-[#1F8F73] hover:bg-[#1F8F73]/10"
              href="/login"
            >
              <LogIn
                size={22}
                strokeWidth={2}
                aria-hidden="true"
              />
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}