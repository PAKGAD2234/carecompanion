import Link from "next/link";
import { CalendarDays, Search, Star, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireRole } from "@/lib/auth";

type CustomerDashboardProps = {
  searchParams: Promise<{ date?: string; time?: string }>;
};

type Availability = {
  day_of_week: number;
  start_time: string;
  end_time: string;
};

function getDayOfWeek(date?: string) {
  if (!date) return null;
  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.getDay();
}

export default async function CustomerDashboardPage({ searchParams }: CustomerDashboardProps) {
  const { supabase } = await requireRole("customer");
  const { date, time } = await searchParams;
  const selectedDay = getDayOfWeek(date);
  const hasSearch = Boolean(date && time);
  const { data: companions } = await supabase
    .from("companion_profiles")
    .select("id, bio, experience_years, hourly_rate, average_rating, total_reviews, profiles!inner(full_name, status), companion_availability(day_of_week, start_time, end_time)")
    .eq("profiles.status", "active")
    .eq("id_card_verified", true)
    .order("average_rating", { ascending: false })
    .limit(30);

  const matchingCompanions = (companions ?? []).map((companion) => {
    const availability = (companion.companion_availability ?? []) as Availability[];
    const matchingAvailability = hasSearch && selectedDay !== null
      ? availability.filter((slot) => slot.day_of_week === selectedDay && slot.start_time.slice(0, 5) <= time! && slot.end_time.slice(0, 5) >= time!)
      : availability;
    return { ...companion, matchingAvailability };
  }).filter((companion) => !hasSearch || companion.matchingAvailability.length > 0);

  return (
    <DashboardShell role="customer" title="สวัสดี ยินดีต้อนรับ" description="ค้นหา Companion ที่ว่างตรงกับวันและเวลาที่คุณต้องการ">
      <Card className="mt-8">
        <div className="flex items-center gap-4">
          <Search className="shrink-0 text-[#1F8F73]" size={36} strokeWidth={2} aria-hidden="true" />
          <div><h2 className="text-xl font-extrabold">ค้นหา Companion ตามเวลาที่ต้องการ</h2><p className="mt-1 text-[#2E2E2E]/75">เลือกวันและเวลา แล้วระบบจะแสดงเฉพาะคนที่ว่างตรงกัน</p></div>
        </div>
        <form method="get" className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div><label className="block font-bold" htmlFor="date">วันที่</label><input id="date" name="date" type="date" defaultValue={date ?? ""} required className="mt-2 min-h-14 w-full rounded-xl border-2 border-[#2E2E2E]/20 bg-[#FAFAF8] px-4 text-lg focus:border-[#1F8F73]" /></div>
          <div><label className="block font-bold" htmlFor="time">เวลา</label><input id="time" name="time" type="time" defaultValue={time ?? ""} required className="mt-2 min-h-14 w-full rounded-xl border-2 border-[#2E2E2E]/20 bg-[#FAFAF8] px-4 text-lg focus:border-[#1F8F73]" /></div>
          <button type="submit" className="min-h-14 rounded-[1.25rem] bg-[#1F8F73] px-6 py-3 text-lg font-bold text-[#FAFAF8] hover:bg-[#187A62]">ค้นหาเวลาว่าง</button>
        </form>
      </Card>

      <section className="mt-10" aria-labelledby="companions-heading">
        <div className="mb-5 flex items-end justify-between gap-4"><div><p className="font-bold text-[#1F8F73]">{hasSearch ? "ผลการค้นหา" : "ผู้ช่วยที่ผ่านการอนุมัติ"}</p><h2 id="companions-heading" className="mt-1 text-2xl font-extrabold">{hasSearch ? `Companion ที่ว่างวันที่ ${date} เวลา ${time}` : "ค้นหาผู้ช่วยตามเวลาที่คุณต้องการ"}</h2></div><UsersRound className="text-[#1F8F73]" size={32} strokeWidth={2} aria-hidden="true" /></div>
        {!matchingCompanions.length ? <Card><p className="text-[#2E2E2E]/75">ไม่พบ Companion ที่ว่างตรงกับเวลานี้</p><Link href="/customer" className="mt-4 inline-block font-bold text-[#1F8F73]">ค้นหาเวลาอื่น</Link></Card> : <div className="grid gap-5 md:grid-cols-2">{matchingCompanions.map((companion) => { const profile = companion.profiles as { full_name?: string } | null; return <Card key={companion.id}><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-extrabold">{profile?.full_name ?? "Companion"}</h3><p className="mt-1 text-[#2E2E2E]/70">ประสบการณ์ {companion.experience_years ?? 0} ปี · {companion.hourly_rate ?? 0} บาท/ชั่วโมง</p></div><p className="flex items-center gap-1 font-bold text-[#F5A65B]"><Star size={20} fill="currentColor" /> {Number(companion.average_rating ?? 0).toFixed(1)} ({companion.total_reviews ?? 0})</p></div><p className="mt-4 line-clamp-2 text-[#2E2E2E]/75">{companion.bio ?? "พร้อมช่วยดูแลการเดินทางของคุณ"}</p><div className="mt-4 rounded-xl bg-[#1F8F73]/10 p-3 text-sm font-bold text-[#187A62]"><CalendarDays className="mr-2 inline" size={18} />เวลาว่าง: {companion.matchingAvailability.map((slot) => `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`).join(", ")}</div><Link href={`/customer/bookings/new?companion_id=${companion.id}${date ? `&scheduled_date=${date}` : ""}${time ? `&scheduled_start_time=${time}` : ""}`} className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-[1.25rem] bg-[#1F8F73] px-5 py-3 font-bold text-[#FAFAF8] hover:bg-[#187A62]">เลือก Companion คนนี้</Link></Card>; })}</div>}
      </section>
    </DashboardShell>
  );
}
