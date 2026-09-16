"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export async function addAvailability(formData: FormData) {
  const { supabase, user } = await requireRole("companion");
  const dayOfWeek = Number(formData.get("day_of_week"));
  const startTime = String(formData.get("start_time") ?? "");
  const endTime = String(formData.get("end_time") ?? "");
  if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6 || !startTime || !endTime || startTime >= endTime) {
    redirect("/companion/schedule?error=invalid");
  }
  const { error } = await supabase.from("companion_availability").insert({ companion_id: user.id, day_of_week: dayOfWeek, start_time: startTime, end_time: endTime });
  if (error) {
    console.error("Unable to add availability", error);
    redirect("/companion/schedule?error=save-failed");
  }
  revalidatePath("/companion/schedule");
  redirect("/companion/schedule?success=1");
}

export async function deleteAvailability(formData: FormData) {
  const { supabase, user } = await requireRole("companion");
  const { error } = await supabase.from("companion_availability").delete().eq("id", String(formData.get("availability_id"))).eq("companion_id", user.id);
  if (error) {
    console.error("Unable to delete availability", error);
    redirect("/companion/schedule?error=delete-failed");
  }
  revalidatePath("/companion/schedule");
  redirect("/companion/schedule?success=deleted");
}