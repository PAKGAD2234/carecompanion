import Image from "next/image";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BackToDashboard } from "@/components/shared/BackToDashboard";
import { cancelBooking } from "@/app/customer/bookings/actions";
import { submitReview } from "@/app/customer/bookings/review-actions";

type BookingsPageProps = { searchParams: Promise<{ success?: string; cancelled?: string; error?: string; review?: string }> };

const statusLabels: Record<string, string> = { pending: "รอผู้ช่วยตอบรับ", accepted: "ตอบรับแล้ว", completed: "เสร็จสิ้น", cancelled: "ยกเลิกแล้ว", rejected: "ไม่รับงาน" };

export default async function CustomerBookingsPage({ searchParams }: BookingsPageProps) {
  const { supabase, user } = await requireRole("customer");
  const [{ data: bookings }, { data: reviews }] = await Promise.all([
    supabase.from("bookings").select("id, origin_address, destination_address, scheduled_date, scheduled_start_time, estimated_duration_hours, notes, status, companion_id, service_types(name)").eq("customer_id", user.id).order("scheduled_date", { ascending: false }),
    supabase.from("reviews").select("booking_id").eq("customer_id", user.id),
  ]);
  const reviewedBookings = new Set((reviews ?? []).map((review) => review.booking_id));
  const { success, cancelled, error, review } = await searchParams;

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
        <BackToDashboard compact role="customer" />
      {success === "1" ? <Card className="relative mb-8 grid items-center gap-6 border-[#93C5FD]/30 bg-[#93C5FD]/10 sm:grid-cols-[180px_1fr]"><Link href="/customer/bookings" className="absolute right-4 top-4 text-[#29213D]" aria-label="ปิดข้อความสำเร็จ"><X size={22} strokeWidth={2} /></Link><Image src="/images/illustrations/booking-success.svg.svg" alt="สร้างคำขอสำเร็จ" width={180} height={140} className="mx-auto" /><div><h2 className="text-2xl font-extrabold">ส่งคำขอสำเร็จแล้ว</h2><p className="mt-2 leading-relaxed">เราจะจับคู่ผู้ช่วยที่เหมาะสมให้คุณ ตรวจสอบสถานะได้จากรายการด้านล่าง</p></div></Card> : null}
      {cancelled === "1" ? <p className="mb-6 rounded-xl bg-[#93C5FD]/15 p-4 font-semibold text-[#7C3AED]" role="status">ยกเลิกคำขอสำเร็จแล้ว</p> : null}
      {error ? <p className="mb-6 rounded-xl bg-[#D64545]/10 p-4 font-semibold text-[#D64545]" role="alert">ไม่สามารถดำเนินการกับคำขอนี้ได้</p> : null}
      {review === "success" ? <p className="mb-6 rounded-xl bg-[#93C5FD]/15 p-4 font-semibold text-[#7C3AED]" role="status">ขอบคุณสำหรับรีวิว</p> : null}
      {review === "duplicate" ? <p className="mb-6 rounded-xl bg-[#D64545]/10 p-4 font-semibold text-[#D64545]" role="alert">คุณรีวิวการเดินทางนี้ไปแล้ว</p> : null}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-3xl font-extrabold">คำขอของฉัน</h1><p className="mt-2 text-[#29213D]/75">ติดตามคำขอบริการและการเดินทางทั้งหมด</p></div><Link href="/customer/bookings/new"><Button><Plus size={22} strokeWidth={2} aria-hidden="true" /> สร้างคำขอใหม่</Button></Link></div>
      {!bookings?.length ? <Card className="flex flex-col items-center py-10 text-center"><Image src="/images/illustrations/empty-bookings.svg.svg" alt="ยังไม่มีคำขอบริการ" width={280} height={210} /><h2 className="mt-5 text-2xl font-extrabold">ยังไม่มีคำขอบริการ</h2><p className="mt-2 max-w-md text-[#29213D]/75">เริ่มต้นการเดินทางที่สบายใจด้วยการสร้างคำขอแรกของคุณ</p><Link href="/customer/bookings/new" className="mt-6"><Button>สร้างคำขอแรก</Button></Link></Card> : <div className="grid gap-5">{bookings.map((booking) => <Card key={booking.id}><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="font-bold text-[#8B5CE7]">{(booking.service_types as { name?: string } | null)?.name ?? "บริการเดินทาง"}</p><h2 className="mt-2 text-xl font-extrabold">{booking.origin_address} <span className="text-[#8B5CE7]">→</span> {booking.destination_address}</h2><p className="mt-2 text-[#29213D]/75">{booking.scheduled_date} เวลา {booking.scheduled_start_time} · {booking.estimated_duration_hours} ชั่วโมง</p>{booking.notes ? <p className="mt-2 text-base text-[#29213D]/70">หมายเหตุ: {booking.notes}</p> : null}</div><div className="flex flex-col items-end gap-3"><Badge status={booking.status} label={statusLabels[booking.status] ?? booking.status} />{["pending", "accepted"].includes(booking.status) ? <form action={cancelBooking}><input type="hidden" name="booking_id" value={booking.id} /><Button type="submit" variant="danger">ยกเลิกคำขอ</Button></form> : null}{booking.status === "completed" && booking.companion_id && !reviewedBookings.has(booking.id) ? <form action={submitReview} className="w-full space-y-2"><input type="hidden" name="booking_id" value={booking.id} /><select name="rating" defaultValue="5" className="min-h-12 rounded-xl border-2 border-[#29213D]/20 bg-[#FAF7FF] px-3" aria-label="คะแนน"><option value="5">5 ดาว</option><option value="4">4 ดาว</option><option value="3">3 ดาว</option><option value="2">2 ดาว</option><option value="1">1 ดาว</option></select><input name="comment" placeholder="เขียนรีวิวสั้นๆ" className="min-h-12 w-full rounded-xl border-2 border-[#29213D]/20 bg-[#FAF7FF] px-3" /><Button type="submit" variant="secondary">ส่งรีวิว</Button></form> : null}</div></div></Card>)}</div>}
    </main>
  );
}