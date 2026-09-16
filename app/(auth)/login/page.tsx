import Image from "next/image";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { GoogleLoginButton } from "@/components/shared/GoogleLoginButton";

type LoginPageProps = { searchParams: Promise<{ error?: string; message?: string }> };

function getCallbackError(code?: string, message?: string) {
  if (code === "config") return "การตั้งค่า Supabase ยังไม่ครบ กรุณาตรวจสอบ Environment Variables";
  if (code === "session") return "สร้าง session ไม่สำเร็จ กรุณาลองใหม่และใช้ URL เดิมตลอดการเข้าสู่ระบบ";
  if (code === "provider") return `Google ปฏิเสธการเข้าสู่ระบบ: ${message ?? "กรุณาตรวจสอบ Google Provider และ Redirect URL"}`;
  if (code === "exchange") return `แลก session ไม่สำเร็จ: ${message ?? "กรุณาตรวจสอบ URL และ cookie ของเบราว์เซอร์"}`;
  if (code === "oauth") return "Google OAuth ไม่สำเร็จ กรุณาตรวจสอบ Google Provider และ Redirect URL ใน Supabase";
  return undefined;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[1.25rem] bg-[#f0ebfa] shadow-[0_12px_36px_rgba(41,33,61,0.15)] lg:grid-cols-2">
        <div className="relative min-h-64 lg:min-h-155">
          <Image src="/images/illustrations/login.svg.svg" alt="ผู้ช่วยดูแลผู้สูงอายุระหว่างเดินทาง" fill className="object-cover" priority />
        </div>
        <div className="flex flex-col justify-center bg-[#FAF7FF] p-7 sm:p-12">
          <Link href="/" className="mb-10 flex items-center gap-3 text-xl font-extrabold text-[#8B5CE7]">
            <HeartHandshake size={30} strokeWidth={2} aria-hidden="true" /> Care Companion
          </Link>
          <p className="mb-3 font-bold text-[#7C3AED]">เดินทางอย่างอุ่นใจ</p>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight text-[#29213D] sm:text-4xl">เข้าสู่ระบบ</h1>
          <p className="mb-8 leading-relaxed text-[#29213D]/80">เชื่อมต่อกับผู้ช่วยเดินทางที่พร้อมดูแลคุณหรือคนที่คุณรัก</p>
          <GoogleLoginButton initialError={getCallbackError(error, message)} />
          <p className="mt-8 text-center text-base text-[#29213D]/70">การเข้าสู่ระบบแสดงว่าคุณยอมรับเงื่อนไขการใช้งานของเรา</p>
        </div>
      </div>
    </main>
  );
}