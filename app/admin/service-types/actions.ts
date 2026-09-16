"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";

export async function saveServiceType(formData: FormData) {
  const { supabase } = await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  const payload = { name: String(formData.get("name") ?? "").trim(), icon_name: String(formData.get("icon_name") ?? "").trim() || null, is_active: formData.get("is_active") === "on" };
  if (!payload.name) return;
  if (id) await supabase.from("service_types").update(payload).eq("id", id);
  else await supabase.from("service_types").insert(payload);
  revalidatePath("/admin/service-types");
}

export async function toggleServiceType(formData: FormData) {
  const { supabase } = await requireRole("admin");
  const id = String(formData.get("id"));
  const isActive = String(formData.get("is_active")) === "true";
  await supabase.from("service_types").update({ is_active: !isActive }).eq("id", id);
  revalidatePath("/admin/service-types");
}