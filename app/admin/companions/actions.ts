"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";

export async function updateCompanionStatus(formData: FormData) {
  const { supabase } = await requireRole("admin");
  const companionId = String(formData.get("companion_id"));
  const verified = String(formData.get("id_card_verified")) === "true";
  await supabase.from("companion_profiles").update({ id_card_verified: verified }).eq("id", companionId);
  await supabase.from("profiles").update({ status: verified ? "active" : "suspended" }).eq("id", companionId).eq("role", "companion");
  revalidatePath("/admin/companions");
}