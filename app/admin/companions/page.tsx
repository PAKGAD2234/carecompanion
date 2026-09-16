import { ShieldCheck, ShieldOff } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { updateCompanionStatus } from "@/app/admin/companions/actions";
import { BackToDashboard } from "@/components/shared/BackToDashboard";

export default async function AdminCompanionsPage() {
  const { supabase } = await requireRole("admin");
  const { data: companions } = await supabase
    .from("companion_profiles")
    .select(
      "id, bio, experience_years, skills, service_areas, hourly_rate, id_card_verified, profiles!inner(full_name, status)",
    )
    .order("id");
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
        <BackToDashboard compact role="admin" />
      <h1 className="text-3xl font-extrabold">จัดการผู้ช่วยเดินทาง</h1>
      <p className="mt-2 text-[#29213D]/75">
        ตรวจสอบและจัดการสถานะผู้ช่วยในระบบ
      </p>
      <div className="mt-8 grid gap-5">
        {!companions?.length ? (
          <Card>
            <p>ยังไม่มีข้อมูลผู้ช่วย</p>
          </Card>
        ) : (
          companions.map((companion) => {
            const profile = companion.profiles as {
              full_name?: string;
              status?: string;
            } | null;
            return (
              <Card key={companion.id}>
                <div className="flex flex-col justify-between gap-5 lg:flex-row">
                  <div>
                    <h2 className="text-xl font-extrabold">
                      {profile?.full_name ?? "ไม่ระบุชื่อ"}
                    </h2>
                    <p className="mt-2 text-[#29213D]/75">
                      ประสบการณ์ {companion.experience_years} ปี ·{" "}
                      {companion.hourly_rate} บาท/ชั่วโมง
                    </p>
                    <p className="mt-2 text-base text-[#29213D]/70">
                      สถานะบัญชี: {profile?.status ?? "ไม่ระบุ"} · ตรวจบัตร:{" "}
                      {companion.id_card_verified ? "อนุมัติแล้ว" : "รอตรวจสอบ"}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <form action={updateCompanionStatus}>
                      <input
                        type="hidden"
                        name="companion_id"
                        value={companion.id}
                      />
                      <input
                        type="hidden"
                        name="id_card_verified"
                        value={String(!companion.id_card_verified)}
                      />
                      <Button
                        type="submit"
                        variant={
                          companion.id_card_verified ? "danger" : "primary"
                        }
                      >
                        {companion.id_card_verified ? (
                          <>
                            <ShieldOff size={21} strokeWidth={2} /> ระงับ
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={21} strokeWidth={2} /> อนุมัติ
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </main>
  );
}
