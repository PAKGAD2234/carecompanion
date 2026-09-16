import { Pencil, Plus, Power } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  saveServiceType,
  toggleServiceType,
} from "@/app/admin/service-types/actions";
import { BackToDashboard } from "@/components/shared/BackToDashboard";

type ServiceType = {
  id: string;
  name: string;
  icon_name: string | null;
  is_active: boolean;
};

export default async function AdminServiceTypesPage() {
  const { supabase } = await requireRole("admin");
  const { data } = await supabase
    .from("service_types")
    .select("id, name, icon_name, is_active")
    .order("name");
  const serviceTypes = (data ?? []) as ServiceType[];
  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[320px_1fr]">
        <BackToDashboard compact role="admin" />
      <Card className="h-fit">
        <h1 className="text-2xl font-extrabold">เพิ่มประเภทธุระ</h1>
        <form action={saveServiceType} className="mt-5 space-y-4">
          <Input id="name" name="name" label="ชื่อบริการ" required />
          <Input
            id="icon_name"
            name="icon_name"
            label="ชื่อไอคอน"
            placeholder="เช่น car, hospital"
          />
          <label className="flex items-center gap-3 font-bold">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked
              className="h-5 w-5 accent-[#1F8F73]"
            />{" "}
            เปิดใช้งาน
          </label>
          <Button type="submit" className="w-full">
            <Plus size={22} strokeWidth={2} /> เพิ่มบริการ
          </Button>
        </form>
      </Card>
      <section>
        <h2 className="mb-5 text-2xl font-extrabold">ประเภทธุระในระบบ</h2>
        {!serviceTypes.length ? (
          <Card>
            <p>ยังไม่มีประเภทธุระ</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {serviceTypes.map((service) => (
              <Card key={service.id}>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-xl font-extrabold">{service.name}</h3>
                    <p className="mt-1 text-base text-[#2E2E2E]/70">
                      ไอคอน: {service.icon_name ?? "ค่าเริ่มต้น"} ·{" "}
                      {service.is_active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <form action={toggleServiceType}>
                      <input type="hidden" name="id" value={service.id} />
                      <input
                        type="hidden"
                        name="is_active"
                        value={String(service.is_active)}
                      />
                      <Button
                        type="submit"
                        variant={service.is_active ? "danger" : "primary"}
                      >
                        <Power size={21} strokeWidth={2} />{" "}
                        {service.is_active ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                      </Button>
                    </form>
                    <details>
                      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-center gap-2 rounded-[1.25rem] border-2 border-[#1F8F73] px-5 py-3 font-bold text-[#1F8F73]">
                        <Pencil size={21} strokeWidth={2} /> แก้ไข
                      </summary>
                      <form
                        action={saveServiceType}
                        className="mt-3 space-y-3 rounded-xl border border-[#2E2E2E]/10 p-3"
                      >
                        <input type="hidden" name="id" value={service.id} />
                        <Input
                          id={`edit-name-${service.id}`}
                          name="name"
                          label="ชื่อบริการ"
                          defaultValue={service.name}
                          required
                        />
                        <Input
                          id={`edit-icon-${service.id}`}
                          name="icon_name"
                          label="ชื่อไอคอน"
                          defaultValue={service.icon_name ?? ""}
                        />
                        <label className="flex items-center gap-3 font-bold">
                          <input
                            type="checkbox"
                            name="is_active"
                            defaultChecked={service.is_active}
                            className="h-5 w-5 accent-[#1F8F73]"
                          />{" "}
                          เปิดใช้งาน
                        </label>
                        <Button type="submit" className="w-full">
                          บันทึก
                        </Button>
                      </form>
                    </details>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
