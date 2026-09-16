"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";

export async function markNotificationRead(formData: FormData) {
  const role = String(formData.get("role")) as "customer" | "companion" | "admin";
  const notificationId = String(formData.get("notification_id") ?? "");
  if (!["customer", "companion", "admin"].includes(role) || !notificationId) return;
  const { supabase, user } = await requireRole(role);
  await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId).eq("user_id", user.id);
  revalidatePath(`/${role}/notifications`);
}

export async function markAllNotificationsRead(formData: FormData) {
  const role = String(formData.get("role")) as "customer" | "companion" | "admin";
  if (!["customer", "companion", "admin"].includes(role)) return;
  const { supabase, user } = await requireRole(role);
  await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
  revalidatePath(`/${role}/notifications`);
}
