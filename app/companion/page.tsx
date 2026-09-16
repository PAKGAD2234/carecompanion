import Link from "next/link";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireRole } from "@/lib/auth";

type CompanionDashboardProps = {
  searchParams: Promise<{ tab?: string }>;
};

type CustomerProfile = { full_name: string | null } | null;

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: CustomerProfile;
};

export default async function CompanionDashboardPage({
  searchParams,
}: CompanionDashboardProps) {
  const { supabase, user } = await requireRole("companion");
  const { tab } = await searchParams;
  const isReviewsTab = tab === "reviews";
  const [{ data: reviews }, { data: assignedBookings }] = await Promise.all([
    supabase
      .from("reviews")
      .select(
        "id, rating, comment, created_at, profiles!reviews_customer_id_fkey(full_name)",
      )
      .eq("companion_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("bookings")
      .select("id, origin_address, destination_address, scheduled_date, scheduled_start_time, estimated_duration_hours, status, service_types(name)")
      .eq("companion_id", user.id)
      .in("status", ["pending", "accepted"])
      .order("scheduled_date", { ascending: true })
      .limit(6),
  ]);

  const reviewItems = (reviews ?? []) as unknown as Review[];
  const totalReviews = reviewItems.length;
  const averageRating = totalReviews > 0
    ? reviewItems.reduce((sum, review) => sum + Number(review.rating), 0) / totalReviews
    : 0;

  return (
    <DashboardShell
      role="companion"
      title="แดชบอร์ดผู้ช่วยเดินทาง"
      description="ดูงานที่ได้รับมอบหมายและจัดการตารางเวลาของคุณ"
    >
      <div
        className="mt-8 flex gap-2 border-b border-[#2E2E2E]/10"
        role="tablist"
        aria-label="แท็บแดชบอร์ด Companion"
      >
        <Link
          href="/companion"
          className={`rounded-t-xl px-5 py-3 font-bold ${!isReviewsTab ? "border-b-4 border-[#1F8F73] text-[#1F8F73]" : "text-[#2E2E2E]/65 hover:bg-[#1F8F73]/10"}`}
          role="tab"
          aria-selected={!isReviewsTab}
        >
          ภาพรวม
        </Link>
        <Link
          href="/companion?tab=reviews"
          className={`flex items-center gap-2 rounded-t-xl px-5 py-3 font-bold ${isReviewsTab ? "border-b-4 border-[#1F8F73] text-[#1F8F73]" : "text-[#2E2E2E]/65 hover:bg-[#1F8F73]/10"}`}
          role="tab"
          aria-selected={isReviewsTab}
        >
          <Star size={20} strokeWidth={2} /> รีวิวจากลูกค้า
        </Link>
      </div>
      {isReviewsTab ? (
        <section className="mt-8 space-y-6" aria-label="รีวิวจากลูกค้า">
          <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[#2E2E2E]/70">คะแนนเฉลี่ยของคุณ</p>
              <p className="mt-1 flex items-center gap-2 text-4xl font-extrabold text-[#F5A65B]">
                <Star fill="currentColor" size={34} strokeWidth={2} />{" "}
                {Number(averageRating).toFixed(1)}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-3xl font-extrabold text-[#2E2E2E]">
                {totalReviews}
              </p>
              <p className="text-[#2E2E2E]/70">รีวิวทั้งหมด</p>
            </div>
          </Card>
          {!reviewItems.length ? (
            <Card className="py-12 text-center">
              <Star
                className="mx-auto text-[#F5A65B]"
                size={44}
                strokeWidth={2}
              />
              <h2 className="mt-4 text-2xl font-extrabold">ยังไม่มีรีวิว</h2>
              <p className="mt-2 text-[#2E2E2E]/75">
                รีวิวจากลูกค้าจะแสดงที่หน้านี้หลังจบการให้บริการ
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reviewItems.map((review) => (
                <Card key={review.id}>
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <p className="font-bold text-[#2E2E2E]">
                        {review.profiles?.full_name ?? "ลูกค้า"}
                      </p>
                      <p
                        className="mt-2 flex items-center gap-1 text-[#F5A65B]"
                        aria-label={`${review.rating} จาก 5 ดาว`}
                      >
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star
                            key={index}
                            size={21}
                            fill={
                              index < review.rating ? "currentColor" : "none"
                            }
                            strokeWidth={2}
                          />
                        ))}
                      </p>
                      {review.comment ? (
                        <p className="mt-4 leading-relaxed text-[#2E2E2E]/80">
                          “{review.comment}”
                        </p>
                      ) : (
                        <p className="mt-4 text-[#2E2E2E]/60">
                          ลูกค้าไม่ได้เขียนคอมเมนต์
                        </p>
                      )}
                    </div>
                    <time
                      className="text-sm text-[#2E2E2E]/60"
                      dateTime={review.created_at}
                    >
                      {new Date(review.created_at).toLocaleDateString("th-TH")}
                    </time>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="mt-8 space-y-5" aria-label="ตารางงานของคุณ">
          <div className="flex items-center gap-3"><CalendarDays className="text-[#1F8F73]" size={36} strokeWidth={2} aria-hidden="true" /><div><h2 className="text-xl font-extrabold">งานที่รับไว้</h2><p className="text-[#2E2E2E]/75">รายการงานถัดไปของคุณ</p></div></div>
          {!assignedBookings?.length ? <Card><p className="text-[#2E2E2E]/75">ยังไม่มีงานที่รับไว้ ไปดูงานที่เปิดรับเพื่อเริ่มต้นได้เลย</p><Link href="/companion/jobs" className="mt-3 inline-block font-bold text-[#1F8F73]">ดูงานที่เปิดรับ</Link></Card> : <div className="grid gap-4 md:grid-cols-2">{assignedBookings.map((booking) => <Card key={booking.id}><p className="font-bold text-[#1F8F73]">{(booking.service_types as { name?: string } | null)?.name ?? "บริการเดินทาง"}</p><h3 className="mt-2 text-lg font-extrabold">{booking.origin_address} → {booking.destination_address}</h3><p className="mt-2 flex items-center gap-2 text-[#2E2E2E]/75"><CalendarDays size={18} /> {booking.scheduled_date} เวลา {booking.scheduled_start_time}</p><p className="mt-1 flex items-center gap-2 text-[#2E2E2E]/75"><MapPin size={18} /> {booking.estimated_duration_hours} ชั่วโมง · {booking.status === "accepted" ? "ตอบรับแล้ว" : "รอตอบรับ"}</p></Card>)}</div>}
        </section>
      )}
    </DashboardShell>
  );
}
