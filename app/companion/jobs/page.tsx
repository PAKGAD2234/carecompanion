import { BriefcaseBusiness, MapPin } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { acceptBooking, completeBooking } from "@/app/companion/jobs/actions";
import { BackToDashboard } from "@/components/shared/BackToDashboard";

type CompanionJobsPageProps = {
  searchParams: Promise<{ error?: string; success?: string; completed?: string }>;
};

const errorMessages: Record<string, string> = {
  "missing-id": "ไม่พบรหัสคำขอ กรุณาลองใหม่อีกครั้ง",
  "profile-check": "ตรวจสอบข้อมูล Companion ไม่สำเร็จ กรุณาลองใหม่",
  "update-failed": "บันทึกการรับงานไม่สำเร็จ กรุณาตรวจสอบสิทธิ์ฐานข้อมูล",
  "already-taken": "งานนี้ถูกผู้ช่วยคนอื่นรับไปแล้ว หรือไม่มีสิทธิ์แก้ไขข้อมูล",
  "complete-failed": "จบงานไม่สำเร็จ กรุณาลองใหม่",
};

export default async function CompanionJobsPage({
  searchParams,
}: CompanionJobsPageProps) {
  const { supabase, user } = await requireRole("companion");
  const bookingSelect = "id, origin_address, destination_address, scheduled_date, scheduled_start_time, estimated_duration_hours, notes, status, service_types(name)";
  const [{ data: openBookings }, { data: acceptedBookings }] = await Promise.all([supabase
    .from("bookings")
    .select(bookingSelect)
    .or(`companion_id.is.null,companion_id.eq.${user.id}`)
    .eq("status", "pending")
    .order("scheduled_date"), supabase
    .from("bookings")
    .select(bookingSelect)
    .eq("companion_id", user.id)
    .eq("status", "accepted")
    .order("scheduled_date")]);
  const bookings = [...(openBookings ?? []), ...(acceptedBookings ?? [])];
  const { error, success, completed } = await searchParams;

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
        <BackToDashboard compact role="companion" />
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">งานที่เปิดรับ</h1>
        <p className="mt-2 text-[#2E2E2E]/75">
          เลือกคำขอที่ตรงกับเวลาและพื้นที่ให้บริการของคุณ
        </p>
      </div>
      {error ? (
        <p
          className="mb-6 rounded-xl bg-[#D64545]/10 p-4 font-semibold text-[#D64545]"
          role="alert"
        >
          {errorMessages[error] ?? "เกิดข้อผิดพลาด กรุณาลองใหม่"}
        </p>
      ) : null}
      {success === "1" ? (
        <p
          className="mb-6 rounded-xl bg-[#2FA88A]/15 p-4 font-semibold text-[#187A62]"
          role="status"
        >
          รับงานสำเร็จแล้ว
        </p>
      ) : null}
      {completed === "1" ? <p className="mb-6 rounded-xl bg-[#2FA88A]/15 p-4 font-semibold text-[#187A62]" role="status">บันทึกการจบงานสำเร็จแล้ว</p> : null}
      {!bookings?.length ? (
        <Card className="py-12 text-center">
          <BriefcaseBusiness
            className="mx-auto text-[#1F8F73]"
            size={48}
            strokeWidth={2}
            aria-hidden="true"
          />
          <h2 className="mt-4 text-2xl font-extrabold">
            ยังไม่มีงานที่เปิดรับ
          </h2>
          <p className="mt-2 text-[#2E2E2E]/75">งานใหม่จะแสดงที่หน้านี้</p>
        </Card>
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <div className="flex flex-col justify-between gap-5 lg:flex-row">
                <div>
                  <p className="font-bold text-[#1F8F73]">
                    {(booking.service_types as { name?: string } | null)
                      ?.name ?? "บริการเดินทาง"}
                  </p>
                  <h2 className="mt-2 text-xl font-extrabold">
                    {booking.origin_address} → {booking.destination_address}
                  </h2>
                  <p className="mt-2 text-[#2E2E2E]/75">
                    {booking.scheduled_date} เวลา {booking.scheduled_start_time}{" "}
                    · {booking.estimated_duration_hours} ชั่วโมง
                  </p>
                  {booking.notes ? (
                    <p className="mt-2 text-base text-[#2E2E2E]/70">
                      หมายเหตุ: {booking.notes}
                    </p>
                  ) : null}
                </div>
                <form action={booking.status === "accepted" ? completeBooking : acceptBooking}>
                  <input type="hidden" name="booking_id" value={booking.id} />
                  <Button type="submit">
                    <MapPin size={22} strokeWidth={2} aria-hidden="true" />{" "}
                    {booking.status === "accepted" ? "เสร็จสิ้นการให้บริการ" : "รับงานนี้"}
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
