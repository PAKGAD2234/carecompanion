import { CalendarClock, Trash2 } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { addAvailability, deleteAvailability } from "@/app/companion/schedule/actions";
import { BackToDashboard } from "@/components/shared/BackToDashboard";

const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const scheduleMessages: Record<string, string> = {
  invalid: "กรุณาตรวจสอบวันและเวลา ช่วงเวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น",
  "save-failed": "เพิ่มช่วงเวลาไม่สำเร็จ กรุณาตรวจสอบสิทธิ์ฐานข้อมูล",
  "delete-failed": "ลบช่วงเวลาไม่สำเร็จ กรุณาลองใหม่",
};

type CompanionScheduleProps = { searchParams: Promise<{ error?: string; success?: string }> };

export default async function CompanionSchedulePage({ searchParams }: CompanionScheduleProps) {
  const { supabase, user } = await requireRole("companion");
  const { data: availability } = await supabase
    .from("companion_availability")
    .select("id, day_of_week, start_time, end_time")
    .eq("companion_id", user.id)
    .order("day_of_week")
    .order("start_time");
  const { error, success } = await searchParams;

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
        <BackToDashboard compact role="companion" />
        {error ? <p className="mb-5 rounded-xl bg-[#D64545]/10 p-4 font-semibold text-[#D64545]" role="alert">{scheduleMessages[error] ?? "เกิดข้อผิดพลาด กรุณาลองใหม่"}</p> : null}
        {success === "1" ? <p className="mb-5 rounded-xl bg-[#2FA88A]/15 p-4 font-semibold text-[#187A62]" role="status">เพิ่มช่วงเวลาสำเร็จ</p> : null}
        {success === "deleted" ? <p className="mb-5 rounded-xl bg-[#2FA88A]/15 p-4 font-semibold text-[#187A62]" role="status">ลบช่วงเวลาสำเร็จ</p> : null}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <div className="mb-5 flex items-center gap-3">
            <CalendarClock className="text-[#1F8F73]" size={30} strokeWidth={2} aria-hidden="true" />
            <h1 className="text-2xl font-extrabold">เพิ่มช่วงเวลาว่าง</h1>
          </div>
          <form action={addAvailability} className="space-y-4">
            <div className="space-y-2">
              <label className="block font-bold" htmlFor="day_of_week">วัน</label>
              <select id="day_of_week" name="day_of_week" className="min-h-14 w-full rounded-xl border-2 border-[#2E2E2E]/20 bg-[#FAFAF8] px-4 text-lg" required>
                {days.map((day, index) => <option key={day} value={index}>{day}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block font-bold" htmlFor="start_time">เริ่ม</label><input id="start_time" name="start_time" type="time" required className="min-h-14 w-full rounded-xl border-2 border-[#2E2E2E]/20 bg-[#FAFAF8] px-3 text-lg" /></div>
              <div><label className="block font-bold" htmlFor="end_time">สิ้นสุด</label><input id="end_time" name="end_time" type="time" required className="min-h-14 w-full rounded-xl border-2 border-[#2E2E2E]/20 bg-[#FAFAF8] px-3 text-lg" /></div>
            </div>
            <Button type="submit" className="w-full">เพิ่มช่วงเวลา</Button>
          </form>
        </Card>
        <section>
          <h2 className="mb-4 text-2xl font-extrabold">ช่วงเวลาที่สะดวก</h2>
          {!availability?.length ? <Card><p className="text-[#2E2E2E]/75">ยังไม่มีช่วงเวลาที่เพิ่มไว้</p></Card> : <div className="space-y-3">{availability.map((item) => <Card key={item.id} className="flex items-center justify-between gap-4"><div><p className="font-bold">วัน{days[item.day_of_week]}</p><p className="text-[#2E2E2E]/75">{item.start_time} - {item.end_time}</p></div><form action={deleteAvailability}><input type="hidden" name="availability_id" value={item.id} /><button type="submit" className="rounded-xl p-3 text-[#D64545] hover:bg-[#D64545]/10" aria-label="ลบช่วงเวลา"><Trash2 size={24} strokeWidth={2} /></button></form></Card>)}</div>}
        </section>
      </div>
    </main>
  );
}
