"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";

export async function updateCustomerStatus(formData: FormData) {
  const { supabase } = await requireRole("admin");
  const customerId = String(formData.get("customer_id") ?? "");
  const status = String(formData.get("status")) === "active" ? "suspended" : "active";
  if (!customerId) return;
  await supabase.from("profiles").update({ status }).eq("id", customerId).eq("role", "customer");
  revalidatePath("/admin/customers");
}
