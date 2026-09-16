import { Bell, CheckCheck } from "lucide-react";
import type { UserRole } from "@/hooks/useAuth";
import { requireRole } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { BackToDashboard } from "@/components/shared/BackToDashboard";
import { markAllNotificationsRead, markNotificationRead } from "@/app/notifications/actions";

type NotificationsPageProps = { role: UserRole };

export async function NotificationsPage({ role }: NotificationsPageProps) {
  const { supabase, user } = await requireRole(role);
  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, message, booking_id, is_read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const unreadCount = notifications?.filter((notification) => !notification.is_read).length ?? 0;

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <BackToDashboard compact role={role} />
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="flex items-center gap-3 text-3xl font-extrabold"><Bell className="text-[#8B5CE7]" size={32} strokeWidth={2} /> การแจ้งเตือน</h1><p className="mt-2 text-[#29213D]/75">ติดตามความเคลื่อนไหวของคำขอและการเดินทาง</p></div>
        {unreadCount > 0 ? <form action={markAllNotificationsRead}><input type="hidden" name="role" value={role} /><button type="submit" className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-[#8B5CE7] px-4 py-3 font-bold text-[#8B5CE7]"><CheckCheck size={21} strokeWidth={2} /> อ่านทั้งหมดแล้ว</button></form> : null}
      </div>
      {!notifications?.length ? <Card className="py-10 text-center"><Bell className="mx-auto text-[#8B5CE7]" size={42} strokeWidth={2} /><h2 className="mt-4 text-xl font-extrabold">ยังไม่มีการแจ้งเตือน</h2></Card> : <div className="space-y-3">{notifications.map((notification) => <Card key={notification.id} className={notification.is_read ? "opacity-70" : "border-[#8B5CE7]/40"}><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><h2 className="text-lg font-extrabold">{notification.title}</h2><p className="mt-2 text-[#29213D]/75">{notification.message}</p><p className="mt-2 text-sm text-[#29213D]/55">{new Date(notification.created_at).toLocaleString("th-TH")}</p></div>{!notification.is_read ? <form action={markNotificationRead}><input type="hidden" name="notification_id" value={notification.id} /><input type="hidden" name="role" value={role} /><button type="submit" className="self-start rounded-xl px-3 py-2 font-bold text-[#8B5CE7] hover:bg-[#8B5CE7]/10">อ่านแล้ว</button></form> : null}</div></Card>)}</div>}
    </main>
  );
}
