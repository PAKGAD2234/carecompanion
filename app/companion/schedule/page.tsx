import { CalendarClock, Clock3, Trash2, Sun, Sunset, Moon, Sparkles } from "lucide-react";
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

type Availability = { id: string; day_of_week: number; start_time: string; end_time: string };
type CompanionScheduleProps = { searchParams: Promise<{ error?: string; success?: string }> };

// ช่วงเวลาของวัน ใช้ตัดสินไอคอน + สี ของแต่ละแถว
function getPeriod(startTime: string) {
  const hour = Number(startTime.split(":")[0]);
  if (hour < 12) return { label: "เช้า", icon: Sun, color: "#F5A623" };
  if (hour < 17) return { label: "บ่าย", icon: Sunset, color: "#EF8354" };
  return { label: "เย็น", icon: Moon, color: "#6C63A6" };
}

// คำนวณจำนวนชั่วโมงรวมจากช่วงเวลาทั้งหมด เพื่อโชว์ใน stats card
function calcTotalHours(items: Availability[]) {
  return items.reduce((sum, item) => {
    const [sh, sm] = item.start_time.split(":").map(Number);
    const [eh, em] = item.end_time.split(":").map(Number);
    return sum + (eh * 60 + em - (sh * 60 + sm)) / 60;
  }, 0);
}

export default async function CompanionSchedulePage({ searchParams }: CompanionScheduleProps) {
  const { supabase, user } = await requireRole("companion");
  const { data: availability } = await supabase
    .from("companion_availability")
    .select("id, day_of_week, start_time, end_time")
    .eq("companion_id", user.id)
    .order("day_of_week")
    .order("start_time");
  const { error, success } = await searchParams;

  const items = (availability ?? []) as Availability[];
  const totalHours = calcTotalHours(items);
  const daysCovered = new Set(items.map((i) => i.day_of_week)).size;

  // จัดกลุ่มช่วงเวลาตามวัน เพื่อแสดงผลเป็นหมวดหมู่แทนลิสต์แบนราบ
  const grouped = items.reduce<Record<number, Availability[]>>((acc, item) => {
    (acc[item.day_of_week] ??= []).push(item);
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <BackToDashboard compact role="companion" />

      {error ? (
        <p className="mb-5 rounded-xl bg-[#D64545]/10 p-4 font-semibold text-[#D64545]" role="alert">
          {scheduleMessages[error] ?? "เกิดข้อผิดพลาด กรุณาลองใหม่"}
        </p>
      ) : null}
      {success === "1" ? (
        <p className="mb-5 rounded-xl bg-[#93C5FD]/15 p-4 font-semibold text-[#7C3AED]" role="status">
          เพิ่มช่วงเวลาสำเร็จ
        </p>
      ) : null}
      {success === "deleted" ? (
        <p className="mb-5 rounded-xl bg-[#93C5FD]/15 p-4 font-semibold text-[#7C3AED]" role="status">
          ลบช่วงเวลาสำเร็จ
        </p>
      ) : null}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[#8B5CE7]">
          <Sparkles size={18} strokeWidth={2} aria-hidden="true" />
          <span className="text-sm font-bold uppercase tracking-wide">ตารางเวลาของคุณ</span>
        </div>
        <h1 className="text-3xl font-extrabold">จัดการช่วงเวลาว่าง</h1>
        <p className="text-[#29213D]/70">เพิ่มหรือลบช่วงเวลาที่คุณสะดวกรับงาน ลูกค้าจะเห็นเฉพาะช่วงที่คุณเปิดไว้เท่านั้น</p>
      </div>

      {/* Stats summary */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card className="!p-4 text-center">
          <p className="text-3xl font-extrabold text-[#8B5CE7]">{items.length}</p>
          <p className="text-sm font-semibold text-[#29213D]/70">ช่วงเวลาทั้งหมด</p>
        </Card>
        <Card className="!p-4 text-center">
          <p className="text-3xl font-extrabold text-[#8B5CE7]">{daysCovered}</p>
          <p className="text-sm font-semibold text-[#29213D]/70">วันที่เปิดรับ</p>
        </Card>
        <Card className="!p-4 text-center">
          <p className="text-3xl font-extrabold text-[#8B5CE7]">{totalHours.toFixed(1)}</p>
          <p className="text-sm font-semibold text-[#29213D]/70">ชั่วโมงรวม</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Form */}
        <Card className="h-fit lg:sticky lg:top-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#8B5CE7]/10">
              <CalendarClock className="text-[#8B5CE7]" size={26} strokeWidth={2} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">เพิ่มช่วงเวลาว่าง</h2>
              <p className="text-sm text-[#29213D]/60">เลือกวันและเวลาที่คุณสะดวก</p>
            </div>
          </div>
          <form action={addAvailability} className="space-y-4">
            <div className="space-y-2">
              <label className="block font-bold" htmlFor="day_of_week">วัน</label>
              <select
                id="day_of_week"
                name="day_of_week"
                className="min-h-14 w-full rounded-xl border-2 border-[#29213D]/20 bg-[#FAF7FF] px-4 text-lg transition-colors focus:border-[#8B5CE7] focus:outline-none"
                required
              >
                {days.map((day, index) => (
                  <option key={day} value={index}>{day}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold" htmlFor="start_time">เริ่ม</label>
                <input
                  id="start_time"
                  name="start_time"
                  type="time"
                  required
                  className="min-h-14 w-full rounded-xl border-2 border-[#29213D]/20 bg-[#FAF7FF] px-3 text-lg transition-colors focus:border-[#8B5CE7] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold" htmlFor="end_time">สิ้นสุด</label>
                <input
                  id="end_time"
                  name="end_time"
                  type="time"
                  required
                  className="min-h-14 w-full rounded-xl border-2 border-[#29213D]/20 bg-[#FAF7FF] px-3 text-lg transition-colors focus:border-[#8B5CE7] focus:outline-none"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">+ เพิ่มช่วงเวลา</Button>
          </form>
        </Card>

        {/* List */}
        <section>
          <h2 className="mb-4 text-2xl font-extrabold">ช่วงเวลาที่สะดวก</h2>

          {!items.length ? (
            <Card className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-[#8B5CE7]/10">
                <Clock3 className="text-[#8B5CE7]" size={32} strokeWidth={2} aria-hidden="true" />
              </div>
              <p className="font-bold">ยังไม่มีช่วงเวลาที่เพิ่มไว้</p>
              <p className="text-sm text-[#29213D]/60">เริ่มเพิ่มช่วงเวลาแรกของคุณทางด้านซ้ายได้เลย</p>
            </Card>
          ) : (
            <div className="space-y-5">
              {Object.entries(grouped)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([dayIndex, dayItems]) => (
                  <div key={dayIndex}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-[#8B5CE7] px-3 py-1 text-sm font-bold text-white">
                        วัน{days[Number(dayIndex)]}
                      </span>
                      <span className="text-sm text-[#29213D]/50">{dayItems.length} ช่วงเวลา</span>
                    </div>
                    <div className="space-y-3">
                      {dayItems.map((item) => {
                        const period = getPeriod(item.start_time);
                        const PeriodIcon = period.icon;
                        return (
                          <Card
                            key={item.id}
                            className="flex items-center justify-between gap-4 transition-shadow hover:shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                                style={{ backgroundColor: `${period.color}1A` }}
                              >
                                <PeriodIcon size={20} strokeWidth={2} style={{ color: period.color }} aria-hidden="true" />
                              </div>
                              <div>
                                <p className="font-bold">{item.start_time} - {item.end_time}</p>
                                <p className="text-sm text-[#29213D]/60">ช่วง{period.label}</p>
                              </div>
                            </div>
                            <form action={deleteAvailability}>
                              <input type="hidden" name="availability_id" value={item.id} />
                              <button
                                type="submit"
                                className="rounded-xl p-3 text-[#D64545] transition-colors hover:bg-[#D64545]/10"
                                aria-label="ลบช่วงเวลา"
                              >
                                <Trash2 size={22} strokeWidth={2} />
                              </button>
                            </form>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}