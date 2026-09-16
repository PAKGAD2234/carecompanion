"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Star, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Image from "next/image";

type Availability = {
  day_of_week: number;
  start_time: string;
  end_time: string;
};

type Companion = {
  id: string;
  bio: string | null;
  experience_years: number | null;
  hourly_rate: number | null;
  average_rating: number | null;
  total_reviews: number | null;
  skills?: string[] | null;
  service_areas?: string[] | null;
  profiles: { full_name?: string; avatar_url?: string | null } | null;
  matchingAvailability: Availability[];
};

export function CompanionCard({
  companion,
  date,
  time,
}: {
  companion: Companion;
  date?: string;
  time?: string;
}) {
  const [open, setOpen] = useState(false);
  const profile = companion.profiles;

  return (
    <>
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#8B5CE7]/10">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name ?? "Companion"}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-extrabold text-[#8B5CE7]">
                  {(profile?.full_name ?? "C").charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-extrabold">
                {profile?.full_name ?? "Companion"}
              </h3>
              <p className="mt-1 text-[#29213D]/70">
                ประสบการณ์ {companion.experience_years ?? 0} ปี ·{" "}
                {companion.hourly_rate ?? 0} บาท/ชั่วโมง
              </p>
            </div>
          </div>
          <p className="flex shrink-0 items-center gap-1 font-bold text-[#A78BFA]">
            <Star size={20} fill="currentColor" />{" "}
            {Number(companion.average_rating ?? 0).toFixed(1)} (
            {companion.total_reviews ?? 0})
          </p>
        </div>

        <p className="mt-4 line-clamp-2 text-[#29213D]/75">
          {companion.bio ?? "พร้อมช่วยดูแลการเดินทางของคุณ"}
        </p>

        <div className="mt-4 rounded-xl bg-[#8B5CE7]/10 p-3 text-sm font-bold text-[#7C3AED]">
          <CalendarDays className="mr-2 inline" size={18} />
          เวลาว่าง:{" "}
          {companion.matchingAvailability
            .map(
              (slot) =>
                `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`,
            )
            .join(", ")}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="min-h-12 flex-1 rounded-[1.25rem] border-2 border-[#8B5CE7] px-5 py-3 font-bold text-[#8B5CE7] hover:bg-[#8B5CE7]/10"
          >
            ดูประวัติ
          </button>
          <Link
            href={`/customer/bookings/new?companion_id=${companion.id}${date ? `&scheduled_date=${date}` : ""}${time ? `&scheduled_start_time=${time}` : ""}`}
            className="flex min-h-12 flex-1 items-center justify-center rounded-[1.25rem] bg-[#F472B6] px-5 py-3 font-bold text-[#FFFFFF] hover:bg-[#EC4899]"
          >
            เลือกคนนี้
          </Link>
        </div>
      </Card>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[1.25rem] bg-[#FAF7FF] p-7 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[#8B5CE7]/10">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name ?? "Companion"}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-extrabold text-[#8B5CE7]">
                      {(profile?.full_name ?? "C").charAt(0)}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-extrabold text-[#29213D]">
                  {profile?.full_name ?? "Companion"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="ปิด"
                className="text-[#29213D]/50 hover:text-[#29213D]"
              >
                <X size={28} />
              </button>
            </div>

            <p className="mt-2 flex items-center gap-1 font-bold text-[#A78BFA]">
              <Star size={20} fill="currentColor" />{" "}
              {Number(companion.average_rating ?? 0).toFixed(1)} (
              {companion.total_reviews ?? 0} รีวิว)
            </p>

            <p className="mt-4 text-[#29213D]/80">
              {companion.bio ?? "ยังไม่มีข้อมูลแนะนำตัว"}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="font-bold text-[#7C3AED]">ประสบการณ์</p>
                <p className="text-[#29213D]/80">
                  {companion.experience_years ?? 0} ปี
                </p>
              </div>
              <div>
                <p className="font-bold text-[#7C3AED]">ค่าบริการ</p>
                <p className="text-[#29213D]/80">
                  {companion.hourly_rate ?? 0} บาท/ชั่วโมง
                </p>
              </div>
              {companion.skills?.length ? (
                <div className="sm:col-span-2">
                  <p className="font-bold text-[#7C3AED]">ความสามารถ</p>
                  <p className="text-[#29213D]/80">
                    {companion.skills.join(", ")}
                  </p>
                </div>
              ) : null}
              {companion.service_areas?.length ? (
                <div className="sm:col-span-2">
                  <p className="font-bold text-[#7C3AED]">พื้นที่ให้บริการ</p>
                  <p className="text-[#29213D]/80">
                    {companion.service_areas.join(", ")}
                  </p>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-7 w-full rounded-[1.25rem] bg-[#8B5CE7] px-5 py-3 font-bold text-[#FAF7FF] hover:bg-[#7C3AED]"
            >
              ปิดหน้าต่างนี้
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
