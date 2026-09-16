import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BackToDashboard } from "@/components/shared/BackToDashboard";

type AdminBookingsProps = { searchParams: Promise<{ status?: string }> };
const labels: Record<string, string> = {
  pending: "รอดำเนินการ",
  accepted: "ตอบรับแล้ว",
  completed: "เสร็จสิ้น",
  cancelled: "ยกเลิกแล้ว",
  rejected: "ไม่รับงาน",
};

export default async function AdminBookingsPage({
  searchParams,
}: AdminBookingsProps) {
  const { supabase } = await requireRole("admin");
  const { status } = await searchParams;
  let query = supabase
    .from("bookings")
    .select(
      "id, customer_id, companion_id, origin_address, destination_address, scheduled_date, scheduled_start_time, status, service_types(name)",
    )
    .order("scheduled_date", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data: bookings } = await query;
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
        <BackToDashboard compact role="admin" />
      <h1 className="text-3xl font-extrabold">รายการจองทั้งหมด</h1>
      <div className="my-6 flex flex-wrap gap-2">
        {["", "pending", "accepted", "completed", "cancelled"].map((filter) => (
          <Link
            key={filter || "all"}
            href={
              filter ? `/admin/bookings?status=${filter}` : "/admin/bookings"
            }
            className={`rounded-xl px-4 py-3 font-bold ${status === filter || (!status && !filter) ? "bg-[#8B5CE7] text-[#FAF7FF]" : "bg-[#29213D]/10 text-[#29213D]"}`}
          >
            {filter ? labels[filter] : "ทั้งหมด"}
          </Link>
        ))}
      </div>
      {!bookings?.length ? (
        <Card>
          <p>ไม่พบรายการจอง</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <p className="font-bold text-[#8B5CE7]">
                    {(booking.service_types as { name?: string } | null)
                      ?.name ?? "บริการ"}
                  </p>
                  <h2 className="mt-1 font-extrabold">
                    {booking.origin_address} → {booking.destination_address}
                  </h2>
                  <p className="mt-1 text-base text-[#29213D]/70">
                    {booking.scheduled_date} {booking.scheduled_start_time}
                  </p>
                </div>
                <Badge
                  status={booking.status}
                  label={labels[booking.status] ?? booking.status}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
