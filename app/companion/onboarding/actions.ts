"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";

export async function saveCompanionProfile(formData: FormData) {
  const { supabase, user } = await requireRole("companion");
  const skills = String(formData.get("skills") ?? "").split(",").map((item) => item.trim()).filter(Boolean);
  const serviceAreas = String(formData.get("service_areas") ?? "").split(",").map((item) => item.trim()).filter(Boolean);
  const { error } = await supabase.from("companion_profiles").upsert({
    id: user.id,
    bio: String(formData.get("bio") ?? "").trim(),
    experience_years: Number(formData.get("experience_years")) || 0,
    skills,
    service_areas: serviceAreas,
    vehicle_type: String(formData.get("vehicle_type") ?? "").trim() || null,
    hourly_rate: Number(formData.get("hourly_rate")) || 0,
  });

  if (error) {
    console.error("Unable to save companion profile", error);
    redirect("/companion/onboarding?error=save-failed");
  }
  revalidatePath("/companion");
  redirect("/companion?onboarding=success");
}