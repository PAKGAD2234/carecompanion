import Link from "next/link";
import { ArrowLeft, FileText, MapPin, Route } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { createBooking } from "@/app/customer/bookings/actions";
import { BackToDashboard } from "@/components/shared/BackToDashboard";

type NewBookingPageProps = { searchParams: Promise<{ error?: string; companion_id?: string; scheduled_date?: string; scheduled_start_time?: string }> };

const bookingErrors: Record<string, string> = {
  incomplete: "กรุณากรอกข้อมูลให้ครบถ้วน",
  "save-failed": "ไม่สามารถสร้างคำขอได้ กรุณาตรวจสอบสิทธิ์ฐานข้อมูลแล้วลองใหม่",
  "companion-unavailable": "Companion คนนี้ไม่พร้อมให้เลือกแล้ว กรุณาเลือกคนอื่น",
};

export default async function NewBookingPage({ searchParams }: NewBookingPageProps) {
  const { supabase } = await requireRole("customer");
  const { data: serviceTypes } = await supabase.from("service_types").select("id, name").eq("is_active", true).order("name");
  const { error, companion_id: companionId, scheduled_date: scheduledDate, scheduled_start_time: scheduledStartTime } = await searchParams;
  const { data: selectedCompanion } = companionId ? await supabase.from("companion_profiles").select("id, profiles!inner(full_name)").eq("id", companionId).eq("id_card_verified", true).maybeSingle() : { data: null };

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
        <BackToDashboard compact role="customer" />
      <Link href="/customer/bookings" className="mb-6 inline-flex items-center gap-2 font-bold text-[#8B5CE7]"><ArrowLeft size={22} strokeWidth={2} aria-hidden="true" /> กลับไปรายการคำขอ</Link>
      <Card>
        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-xl bg-[#8B5CE7]/10 p-3 text-[#8B5CE7]"><Route size={30} strokeWidth={2} aria-hidden="true" /></div>
          <div><h1 className="text-3xl font-extrabold">สร้างคำขอบริการ</h1><p className="mt-1 text-[#29213D]/75">กรอกรายละเอียดการเดินทางของคุณ</p></div>
        </div>
        {error ? <p className="mb-5 rounded-xl bg-[#D64545]/10 p-4 font-semibold text-[#D64545]" role="alert">{bookingErrors[error] ?? "เกิดข้อผิดพลาด กรุณาลองใหม่"}</p> : null}
        {selectedCompanion ? <div className="mb-5 rounded-xl bg-[#8B5CE7]/10 p-4 font-bold text-[#7C3AED]">เลือก Companion: {(selectedCompanion.profiles as { full_name?: string } | null)?.full_name ?? "Companion"}</div> : null}
        <form id="booking-form" action={createBooking} className="space-y-5">
          {selectedCompanion ? <input type="hidden" name="companion_id" value={selectedCompanion.id} /> : null}
          <div className="space-y-2"><label className="block text-lg font-bold" htmlFor="service_type_id">ประเภทธุระ</label><select id="service_type_id" name="service_type_id" required className="min-h-14 w-full rounded-[1.25rem] border-2 border-[#29213D]/20 bg-[#FAF7FF] px-4 text-lg outline-none focus:border-[#8B5CE7]"><option value="">เลือกประเภทธุระ</option>{serviceTypes?.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></div>
          <div className="grid gap-5 sm:grid-cols-2"><Input id="origin_address" name="origin_address" label="ต้นทาง" placeholder="เช่น บ้านเลขที่หรือชื่อสถานที่" required /><Input id="destination_address" name="destination_address" label="ปลายทาง" placeholder="เช่น โรงพยาบาลหรือสถานี" required /></div>
          <div className="grid gap-5 sm:grid-cols-3"><Input id="scheduled_date" name="scheduled_date" label="วันที่" type="date" defaultValue={scheduledDate ?? ""} required /><Input id="scheduled_start_time" name="scheduled_start_time" label="เวลา" type="time" defaultValue={scheduledStartTime ?? ""} required /><Input id="estimated_duration_hours" name="estimated_duration_hours" label="ระยะเวลา (ชั่วโมง)" type="number" min="0.5" step="0.5" required /></div>
          <div className="space-y-2"><label className="flex items-center gap-2 text-lg font-bold" htmlFor="notes"><FileText size={21} strokeWidth={2} aria-hidden="true" /> รายละเอียดเพิ่มเติม</label><textarea id="notes" name="notes" rows={4} placeholder="เช่น ต้องช่วยพยุง มีรถเข็น หรือข้อควรระวัง" className="w-full rounded-[1.25rem] border-2 border-[#29213D]/20 bg-[#FAF7FF] px-4 py-3 text-lg outline-none focus:border-[#8B5CE7]" /></div>
          <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:justify-end"><Link href="/customer/bookings"><Button type="button" variant="outline" className="w-full sm:w-auto">ยกเลิก</Button></Link><Button type="submit" className="w-full sm:w-auto"><MapPin size={22} strokeWidth={2} aria-hidden="true" /> ส่งคำขอ</Button></div>
        </form>
      </Card>
    </main>
  );
}