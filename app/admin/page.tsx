import { CalendarDays, Clock3, UserRound, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireRole } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const { supabase } = await requireRole("admin");
  const today = new Date().toISOString().slice(0, 10);
  const [{ count: customers }, { count: companions }, { count: todayBookings }, { count: unfinished }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "companion"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("scheduled_date", today),
    supabase.from("bookings").select("id", { count: "exact", head: true }).not("status", "in", "(completed,cancelled,rejected)"),
  ]);
  const metrics = [{ label: "ลูกค้าทั้งหมด", value: customers ?? 0, icon: UserRound }, { label: "ผู้ช่วยทั้งหมด", value: companions ?? 0, icon: UsersRound }, { label: "การจองวันนี้", value: todayBookings ?? 0, icon: CalendarDays }, { label: "รายการที่ยังไม่จบ", value: unfinished ?? 0, icon: Clock3 }];
  return (
    <DashboardShell role="admin" title="แดชบอร์ดผู้ดูแลระบบ" description="ภาพรวมการใช้งานและการจัดการแพลตฟอร์ม Care Companion">
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(({ label, value, icon: Icon }) => <Card key={label}><Icon className="text-[#8B5CE7]" size={32} strokeWidth={2} aria-hidden="true" /><p className="mt-5 text-4xl font-extrabold">{value}</p><p className="mt-2 text-[#29213D]/75">{label}</p></Card>)}</div>
    </DashboardShell>
  );
}