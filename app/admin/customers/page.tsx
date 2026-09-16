import { ShieldOff, ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BackToDashboard } from "@/components/shared/BackToDashboard";
import { updateCustomerStatus } from "@/app/admin/customers/actions";

export default async function AdminCustomersPage() {
  const { supabase } = await requireRole("admin");
  const { data: customers } = await supabase.from("profiles").select("id, full_name, email, phone, status, created_at").eq("role", "customer").order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <BackToDashboard compact role="admin" />
      <h1 className="text-3xl font-extrabold">จัดการลูกค้า</h1>
      <p className="mt-2 text-[#2E2E2E]/75">ดูข้อมูลและจัดการสถานะบัญชี Customer</p>
      {!customers?.length ? <Card className="mt-8"><p>ยังไม่มีข้อมูลลูกค้า</p></Card> : <div className="mt-8 grid gap-4">{customers.map((customer) => <Card key={customer.id}><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-xl font-extrabold">{customer.full_name}</h2><p className="mt-1 text-[#2E2E2E]/75">{customer.email}{customer.phone ? ` · ${customer.phone}` : ""}</p><p className="mt-1 text-base text-[#2E2E2E]/65">สถานะ: {customer.status}</p></div><form action={updateCustomerStatus}><input type="hidden" name="customer_id" value={customer.id} /><input type="hidden" name="status" value={customer.status} /><Button type="submit" variant={customer.status === "active" ? "danger" : "primary"}>{customer.status === "active" ? <><ShieldOff size={21} strokeWidth={2} /> ระงับบัญชี</> : <><ShieldCheck size={21} strokeWidth={2} /> เปิดใช้งาน</>}</Button></form></div></Card>)}</div>}
    </main>
  );
}
