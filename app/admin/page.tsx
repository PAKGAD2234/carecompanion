import { CalendarDays, Clock3, UserRound, UsersRound } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireRole } from "@/lib/auth";
import { DashboardMetrics, type MetricGroup } from "@/components/admin/DashboardMetrics";

// ปรับให้ตรงกับ enum booking_status จริงในโปรเจกต์ ถ้ามีค่าอื่นเพิ่ม
const bookingStatusLabels: Record<string, string> = {
  pending: "รอยืนยัน",
  accepted: "ยืนยันแล้ว",
  in_progress: "กำลังดำเนินการ",
  completed: "เสร็จสิ้น",
  cancelled: "ยกเลิก",
  rejected: "ปฏิเสธ",
};

type BookingRow = {
  id: string;
  scheduled_date: string;
  scheduled_start_time: string;
  status: string;
  estimated_price: number | null;
  customer: { full_name: string } | null;
  companion: { profiles: { full_name: string } | null } | null;
};

type CompanionExtra = {
  id: string;
  hourly_rate: number | null;
  average_rating: number | null;
  total_completed_jobs: number | null;
  id_card_verified: boolean;
};

function formatTime(t: string) {
  return t?.slice(0, 5) ?? t;
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireRole("admin");
  const today = new Date().toISOString().slice(0, 10);

  const bookingSelect = `
    id, scheduled_date, scheduled_start_time, status, estimated_price,
    customer:profiles!bookings_customer_id_fkey(full_name),
    companion:companion_profiles!bookings_companion_id_fkey(profiles(full_name))
  `;

  const [
    { data: customerRows, count: customers },
    { data: companionRows, count: companions },
    { data: todayBookingRows, count: todayBookings },
    { data: unfinishedRows, count: unfinished },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, phone, status, created_at", { count: "exact" })
      .eq("role", "customer")
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("id, full_name, email, phone, created_at", { count: "exact" })
      .eq("role", "companion")
      .order("created_at", { ascending: false }),
    supabase
      .from("bookings")
      .select(bookingSelect, { count: "exact" })
      .eq("scheduled_date", today)
      .order("scheduled_start_time"),
    supabase
      .from("bookings")
      .select(bookingSelect, { count: "exact" })
      .not("status", "in", "(completed,cancelled,rejected)")
      .order("scheduled_date"),
  ]);

  // ดึงข้อมูลเสริมของ companion (เรตติ้ง/ค่าบริการ) แยกต่างหาก
  // เพื่อเลี่ยงปัญหา type inference ของ nested select ใน Supabase
  const companionIds = (companionRows ?? []).map((row) => row.id);
  const { data: companionExtraRows } = companionIds.length
    ? await supabase
        .from("companion_profiles")
        .select("id, hourly_rate, average_rating, total_completed_jobs, id_card_verified")
        .in("id", companionIds)
    : { data: [] as CompanionExtra[] };

  const extrasMap = new Map((companionExtraRows ?? []).map((e) => [e.id, e]));

  const metricGroups: MetricGroup[] = [
    {
      key: "customers",
      label: "ลูกค้าทั้งหมด",
      value: customers ?? 0,
      icon: <UserRound className="text-[#8B5CE7]" size={32} strokeWidth={2} aria-hidden="true" />,
      empty: "ยังไม่มีลูกค้าในระบบ",
      items: (customerRows ?? []).map((row) => ({
        id: row.id,
        title: row.full_name,
        subtitle: row.phone ?? row.email,
        meta: row.status === "active" ? "ใช้งานอยู่" : row.status,
      })),
    },
    {
      key: "companions",
      label: "ผู้ช่วยทั้งหมด",
      value: companions ?? 0,
      icon: <UsersRound className="text-[#8B5CE7]" size={32} strokeWidth={2} aria-hidden="true" />,
      empty: "ยังไม่มีผู้ช่วยในระบบ",
      items: (companionRows ?? []).map((row) => {
        const cp = extrasMap.get(row.id);
        return {
          id: row.id,
          title: row.full_name,
          subtitle: cp?.hourly_rate
            ? `฿${cp.hourly_rate}/ชม. · งานสำเร็จ ${cp.total_completed_jobs ?? 0}`
            : row.email,
          meta: cp?.id_card_verified ? "ยืนยันตัวตนแล้ว" : "ยังไม่ยืนยัน",
        };
      }),
    },
    {
      key: "today",
      label: "การจองวันนี้",
      value: todayBookings ?? 0,
      icon: <CalendarDays className="text-[#8B5CE7]" size={32} strokeWidth={2} aria-hidden="true" />,
      empty: "ยังไม่มีการจองวันนี้",
      items: (todayBookingRows as unknown as BookingRow[] ?? []).map((row) => ({
        id: row.id,
        title: `${row.customer?.full_name ?? "ลูกค้า"} → ${row.companion?.profiles?.full_name ?? "ยังไม่มีผู้ช่วย"}`,
        subtitle: formatTime(row.scheduled_start_time),
        meta: bookingStatusLabels[row.status] ?? row.status,
      })),
    },
    {
      key: "unfinished",
      label: "รายการที่ยังไม่จบ",
      value: unfinished ?? 0,
      icon: <Clock3 className="text-[#8B5CE7]" size={32} strokeWidth={2} aria-hidden="true" />,
      empty: "ไม่มีรายการค้างอยู่",
      items: (unfinishedRows as unknown as BookingRow[] ?? []).map((row) => ({
        id: row.id,
        title: `${row.customer?.full_name ?? "ลูกค้า"} → ${row.companion?.profiles?.full_name ?? "ยังไม่มีผู้ช่วย"}`,
        subtitle: `${row.scheduled_date} · ${formatTime(row.scheduled_start_time)}`,
        meta: bookingStatusLabels[row.status] ?? row.status,
      })),
    },
  ];

  return (
    <DashboardShell
      role="admin"
      title="แดชบอร์ดผู้ดูแลระบบ"
      description="ภาพรวมการใช้งานและการจัดการแพลตฟอร์ม Care Companion"
    >
      <DashboardMetrics groups={metricGroups} />
    </DashboardShell>
  );
}