"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";
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
    <header className="border-b border-[#8B5CE7]/15 bg-[#FAF7FF]">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"
        aria-label="เมนูหลัก"
      >
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-extrabold text-[#8B5CE7]"
        >
          <Image
            src="/images/illustrations/logo.png"
            alt="Care Companion"
            width={150}
            height={150}
            className="h-[100px] w-[100px] object-contain"
          />
          Care Companion
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                className="hidden rounded-xl px-4 py-3 font-bold text-[#8B5CE7] hover:bg-[#8B5CE7]/10 sm:block"
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
              className="flex min-h-12 items-center gap-2 rounded-xl px-4 py-3 font-bold text-[#8B5CE7] hover:bg-[#8B5CE7]/10"
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