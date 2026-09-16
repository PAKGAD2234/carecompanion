"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export async function acceptBooking(formData: FormData) {
  const { supabase, user } = await requireRole("companion");
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) redirect("/companion/jobs?error=missing-id");

  const { data: companionProfile, error: profileError } = await supabase
    .from("companion_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Unable to load companion profile", profileError);
    redirect("/companion/jobs?error=profile-check");
  }

  if (!companionProfile) {
    redirect("/companion/onboarding?error=profile-required");
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({ companion_id: companionProfile.id, status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", bookingId)
    .or(`companion_id.is.null,companion_id.eq.${companionProfile.id}`)
    .eq("status", "pending")
    .select("id");

  if (error) {
    console.error("Unable to accept booking", error);
    redirect("/companion/jobs?error=update-failed");
  }

  if (!data?.length) {
    redirect("/companion/jobs?error=already-taken");
  }

  await supabase.from("booking_status_history").insert({
    booking_id: bookingId,
    old_status: "pending",
    new_status: "accepted",
    changed_by: user.id,
    note: "Companion รับงาน",
  });
  const { data: bookingOwner } = await supabase.from("bookings").select("customer_id").eq("id", bookingId).maybeSingle();
  if (bookingOwner?.customer_id) {
    await supabase.from("notifications").insert({
      user_id: bookingOwner.customer_id,
      title: "มี Companion รับคำขอแล้ว",
      message: "คำขอบริการของคุณได้รับการตอบรับแล้ว",
      booking_id: bookingId,
    });
  }

  revalidatePath("/companion/jobs");
  revalidatePath("/customer/bookings");
  redirect("/companion/jobs?success=1");
}

export async function completeBooking(formData: FormData) {
  const { supabase, user } = await requireRole("companion");
  const bookingId = String(formData.get("booking_id") ?? "");
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", bookingId)
    .eq("companion_id", user.id)
    .eq("status", "accepted")
    .select("id, customer_id");

  if (error || !data?.length) redirect("/companion/jobs?error=complete-failed");
  const booking = data[0];
  await supabase.from("booking_status_history").insert({ booking_id: booking.id, old_status: "accepted", new_status: "completed", changed_by: user.id, note: "Companion จบการให้บริการ" });
  const { data: companionStats } = await supabase.from("companion_profiles").select("total_completed_jobs").eq("id", user.id).maybeSingle();
  await supabase.from("companion_profiles").update({ total_completed_jobs: (companionStats?.total_completed_jobs ?? 0) + 1 }).eq("id", user.id);
  await supabase.from("notifications").insert({ user_id: booking.customer_id, title: "บริการเสร็จสิ้น", message: "การเดินทางของคุณเสร็จสิ้นแล้ว คุณสามารถให้คะแนน Companion ได้", booking_id: booking.id });
  revalidatePath("/companion/jobs");
  revalidatePath("/customer/bookings");
  redirect("/companion/jobs?completed=1");
}