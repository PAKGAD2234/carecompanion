import Link from "next/link";
import { Search, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireRole } from "@/lib/auth";
import { CompanionCard } from "@/components/customer/CompanionCard";

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

export default async function CustomerDashboardPage({
  searchParams,
}: CustomerDashboardProps) {
  const { supabase } = await requireRole("customer");
  const { date, time } = await searchParams;
  const selectedDay = getDayOfWeek(date);
  const hasSearch = Boolean(date && time);
  const { data: companions } = await supabase
    .from("companion_profiles")
    .select("id, bio, experience_years, hourly_rate, average_rating, total_reviews, skills, service_areas, profiles!inner(full_name, avatar_url, status), companion_availability(day_of_week, start_time, end_time)")
    .eq("profiles.status", "active")
    .eq("id_card_verified", true)
    .order("average_rating", { ascending: false })
    .limit(30);

  const matchingCompanions = (companions ?? []).map((companion) => {
    const availability = (companion.companion_availability ?? []) as Availability[];
    const matchingAvailability = hasSearch && selectedDay !== null
      ? availability.filter((slot) => slot.day_of_week === selectedDay && slot.start_time.slice(0, 5) <= time! && slot.end_time.slice(0, 5) >= time!)
      : availability;

    const profileData = Array.isArray(companion.profiles)
      ? companion.profiles[0]
      : companion.profiles;

    return {
      ...companion,
      profiles: profileData as { full_name?: string; avatar_url?: string | null } | null,
      matchingAvailability,
    };
  }).filter((companion) => !hasSearch || companion.matchingAvailability.length > 0);

  return (
    <DashboardShell
      role="customer"
      title="สวัสดี ยินดีต้อนรับ"
      description="ค้นหา Companion ที่ว่างตรงกับวันและเวลาที่คุณต้องการ"
    >
      <Card className="mt-8">
        <div className="flex items-center gap-4">
          <Search
            className="shrink-0 text-[#8B5CE7]"
            size={36}
            strokeWidth={2}
            aria-hidden="true"
          />
          <div>
            <h2 className="text-xl font-extrabold">
              ค้นหา Companion ตามเวลาที่ต้องการ
            </h2>
            <p className="mt-1 text-[#29213D]/75">
              เลือกวันและเวลา แล้วระบบจะแสดงเฉพาะคนที่ว่างตรงกัน
            </p>
          </div>
        </div>
        <form
          method="get"
          className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        >
          <div>
            <label className="block font-bold" htmlFor="date">
              วันที่
            </label>
            <input
              id="date"
              name="date"
              type="date"
              defaultValue={date ?? ""}
              required
              className="mt-2 min-h-14 w-full rounded-xl border-2 border-[#29213D]/20 bg-[#FAF7FF] px-4 text-lg focus:border-[#8B5CE7]"
            />
          </div>
          <div>
            <label className="block font-bold" htmlFor="time">
              เวลา
            </label>
            <input
              id="time"
              name="time"
              type="time"
              defaultValue={time ?? ""}
              required
              className="mt-2 min-h-14 w-full rounded-xl border-2 border-[#29213D]/20 bg-[#FAF7FF] px-4 text-lg focus:border-[#8B5CE7]"
            />
          </div>
          <button
            type="submit"
            className="min-h-14 rounded-[1.25rem] bg-[#8B5CE7] px-6 py-3 text-lg font-bold text-[#FAF7FF] hover:bg-[#7C3AED]"
          >
            ค้นหาเวลาว่าง
          </button>
        </form>
      </Card>

      <section className="mt-10" aria-labelledby="companions-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-bold text-[#8B5CE7]">
              {hasSearch ? "ผลการค้นหา" : "ผู้ช่วยที่ผ่านการอนุมัติ"}
            </p>
            <h2
              id="companions-heading"
              className="mt-1 text-2xl font-extrabold"
            >
              {hasSearch
                ? `Companion ที่ว่างวันที่ ${date} เวลา ${time}`
                : "ค้นหาผู้ช่วยตามเวลาที่คุณต้องการ"}
            </h2>
          </div>
          <UsersRound
            className="text-[#8B5CE7]"
            size={32}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
        {!matchingCompanions.length ? (
          <Card>
            <p className="text-[#29213D]/75">
              ไม่พบ Companion ที่ว่างตรงกับเวลานี้
            </p>
            <Link
              href="/customer"
              className="mt-4 inline-block font-bold text-[#8B5CE7]"
            >
              ค้นหาเวลาอื่น
            </Link>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {matchingCompanions.map((companion) => (
              <CompanionCard
                key={companion.id}
                companion={companion}
                date={date}
                time={time}
              />
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
