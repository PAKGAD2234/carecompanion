import { Settings } from "lucide-react";
import type { UserRole } from "@/hooks/useAuth";
import { requireRole } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { DashboardShell } from "@/components/layout/DashboardShell";

type SettingsPageProps = { role: UserRole };

const roleLabels: Record<UserRole, string> = {
  customer: "ลูกค้า",
  companion: "ผู้ช่วยเดินทาง",
  admin: "ผู้ดูแลระบบ",
};

export async function SettingsPage({ role }: SettingsPageProps) {
  const { profile } = await requireRole(role);

  return (
    <DashboardShell role={role} title="ตั้งค่า" description="ข้อมูลบัญชีและการตั้งค่าของคุณ">
      <Card className="mt-8">
        <div className="flex items-center gap-4">
          <Settings className="text-[#1F8F73]" size={34} strokeWidth={2} aria-hidden="true" />
          <div>
            <h2 className="text-xl font-extrabold">ข้อมูลบัญชี</h2>
            <p className="mt-1 text-[#2E2E2E]/75">บทบาท: {roleLabels[role]}</p>
            <p className="mt-1 text-base text-[#2E2E2E]/70">ชื่อ: {profile.full_name ?? "ยังไม่ได้ระบุชื่อ"}</p>
          </div>
        </div>
      </Card>
    </DashboardShell>
  );
}