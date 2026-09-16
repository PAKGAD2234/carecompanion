import Link from "next/link";
import { Bell, CalendarDays, Home, Settings, Users } from "lucide-react";
import type { UserRole } from "@/hooks/useAuth";

type SidebarProps = { role: UserRole };

const menuByRole: Record<UserRole, { href: string; label: string; icon: typeof Home }[]> = {
  customer: [{ href: "/customer", label: "ภาพรวม", icon: Home }, { href: "/customer/bookings", label: "คำขอของฉัน", icon: CalendarDays }, { href: "/customer/bookings/new", label: "สร้างคำขอ", icon: Users }, { href: "/customer/notifications", label: "การแจ้งเตือน", icon: Bell }],
  companion: [{ href: "/companion", label: "ภาพรวม", icon: Home }, { href: "/companion/jobs", label: "งานที่เปิดรับ", icon: CalendarDays }, { href: "/companion/schedule", label: "ตารางเวลาว่าง", icon: Users }, { href: "/companion/notifications", label: "การแจ้งเตือน", icon: Bell }],
  admin: [{ href: "/admin", label: "ภาพรวม", icon: Home }, { href: "/admin/customers", label: "ลูกค้า", icon: Users }, { href: "/admin/companions", label: "ผู้ช่วยเดินทาง", icon: Users }, { href: "/admin/bookings", label: "รายการจอง", icon: CalendarDays }, { href: "/admin/service-types", label: "ประเภทธุระ", icon: Settings }, { href: "/admin/notifications", label: "การแจ้งเตือน", icon: Bell }],
};

export function Sidebar({ role }: SidebarProps) {
  return (
    <aside className="w-full shrink-0 border-b border-[#2E2E2E]/10 bg-[#FAFAF8] p-4 lg:w-64 lg:border-b-0 lg:border-r">
      <nav aria-label="เมนูแดชบอร์ด" className="space-y-2">
        {menuByRole[role].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex min-h-14 items-center gap-3 rounded-xl px-4 py-3 font-bold text-[#2E2E2E] hover:bg-[#1F8F73]/10">
            <Icon size={24} strokeWidth={2} aria-hidden="true" /> {label}
          </Link>
        ))}
        <Link href={`/${role}/settings`} className="flex min-h-14 items-center gap-3 rounded-xl px-4 py-3 font-bold text-[#2E2E2E] hover:bg-[#1F8F73]/10">
          <Settings size={24} strokeWidth={2} aria-hidden="true" /> ตั้งค่า
        </Link>
      </nav>
    </aside>
  );
}