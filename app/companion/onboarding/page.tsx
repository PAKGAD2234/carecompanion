import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { saveCompanionProfile } from "@/app/companion/onboarding/actions";
import { BackToDashboard } from "@/components/shared/BackToDashboard";

type OnboardingPageProps = { searchParams: Promise<{ error?: string }> };

const onboardingErrors: Record<string, string> = {
  "profile-required": "กรุณากรอกข้อมูลผู้ช่วยเดินทางก่อนรับงาน",
};

export default async function CompanionOnboardingPage({ searchParams }: OnboardingPageProps) {
  const { supabase } = await requireRole("companion");
  const { data: profile } = await supabase.from("companion_profiles").select("bio, experience_years, skills, service_areas, vehicle_type, hourly_rate").maybeSingle();
  const { error } = await searchParams;
  const toText = (value: unknown) => Array.isArray(value) ? value.join(", ") : String(value ?? "");

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
        <BackToDashboard compact role="companion" />
      <Link href="/companion" className="mb-6 inline-flex items-center gap-2 font-bold text-[#8B5CE7]"><ArrowLeft size={22} strokeWidth={2} aria-hidden="true" /> กลับแดชบอร์ด</Link>
      <Card className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <div><Image src="/images/illustrations/companion-signup.svg.svg" alt="สมัครเป็นผู้ช่วยเดินทาง" width={240} height={220} className="mx-auto" /><h1 className="mt-5 text-2xl font-extrabold">ข้อมูลผู้ช่วยเดินทาง</h1><p className="mt-2 text-[#29213D]/75">เล่าเกี่ยวกับตัวคุณให้ผู้ใช้บริการรู้จัก</p></div>
        <div>{error ? <p className="mb-5 rounded-xl bg-[#D64545]/10 p-4 font-semibold text-[#D64545]" role="alert">{onboardingErrors[error] ?? "เกิดข้อผิดพลาด กรุณาลองใหม่"}</p> : null}<form action={saveCompanionProfile} className="space-y-5"><div className="space-y-2"><label className="block text-lg font-bold" htmlFor="bio">แนะนำตัว</label><textarea id="bio" name="bio" defaultValue={profile?.bio ?? ""} required rows={4} className="w-full rounded-[1.25rem] border-2 border-[#29213D]/20 bg-[#FAF7FF] px-4 py-3 text-lg outline-none focus:border-[#8B5CE7]" placeholder="เล่าประสบการณ์และความตั้งใจของคุณ" /></div><div className="grid gap-5 sm:grid-cols-2"><Input id="experience_years" name="experience_years" label="ประสบการณ์ (ปี)" type="number" min="0" defaultValue={profile?.experience_years ?? 0} required /><Input id="hourly_rate" name="hourly_rate" label="ค่าบริการต่อชั่วโมง (บาท)" type="number" min="0" step="50" defaultValue={profile?.hourly_rate ?? 0} required /></div><Input id="skills" name="skills" label="ทักษะ" defaultValue={toText(profile?.skills)} placeholder="เช่น พยุงเดิน, ปฐมพยาบาล" required /><Input id="service_areas" name="service_areas" label="พื้นที่ให้บริการ" defaultValue={toText(profile?.service_areas)} placeholder="เช่น กรุงเทพฯ, นนทบุรี" required /><Input id="vehicle_type" name="vehicle_type" label="ยานพาหนะ" defaultValue={profile?.vehicle_type ?? ""} placeholder="เช่น รถยนต์ส่วนตัว, ไม่มี" /><Button type="submit" className="w-full"><BriefcaseBusiness size={22} strokeWidth={2} aria-hidden="true" /> บันทึกข้อมูลเพื่อรอตรวจสอบ</Button></form></div>
      </Card>
    </main>
  );
}