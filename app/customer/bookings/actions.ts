"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export async function createBooking(formData: FormData) {
  const { supabase, user } = await requireRole("customer");

  const serviceTypeId = String(formData.get("service_type_id") ?? "");
  const originAddress = String(formData.get("origin_address") ?? "").trim();
  const destinationAddress = String(formData.get("destination_address") ?? "").trim();
  const scheduledDate = String(formData.get("scheduled_date") ?? "");
  const scheduledStartTime = String(formData.get("scheduled_start_time") ?? "");
  const estimatedDurationHours = Number(formData.get("estimated_duration_hours"));
  const notes = String(formData.get("notes") ?? "").trim();
  const companionId = String(formData.get("companion_id") ?? "").trim();

  if (!serviceTypeId || !originAddress || !destinationAddress || !scheduledDate || !scheduledStartTime || !Number.isFinite(estimatedDurationHours) || estimatedDurationHours <= 0) {
    redirect("/customer/bookings/new?error=incomplete");
  }

  if (companionId) {
    const { data: companion } = await supabase.from("companion_profiles").select("id").eq("id", companionId).eq("id_card_verified", true).maybeSingle();
    if (!companion) redirect("/customer/bookings/new?error=companion-unavailable");
  }

  const { data: booking, error } = await supabase.from("bookings").insert({
    customer_id: user.id,
    companion_id: companionId || null,
    service_type_id: serviceTypeId,
    origin_address: originAddress,
    destination_address: destinationAddress,
    scheduled_date: scheduledDate,
    scheduled_start_time: scheduledStartTime,
    estimated_duration_hours: estimatedDurationHours,
    notes: notes || null,
    status: "pending",
  }).select("id").single();

  if (error || !booking) {
    console.error("Unable to create booking", error);
    redirect("/customer/bookings/new?error=save-failed");
  }

  await supabase.from("booking_status_history").insert({
    booking_id: booking.id,
    new_status: "pending",
    changed_by: user.id,
    note: "สร้างคำขอบริการ",
  });
  if (companionId) {
    await supabase.from("notifications").insert({
      user_id: companionId,
      title: "มีคำขอบริการใหม่",
      message: "ลูกค้าเลือกคุณสำหรับคำขอบริการใหม่ กรุณาตรวจสอบและตอบรับงาน",
      booking_id: booking.id,
    });
  }

  revalidatePath("/customer/bookings");
  redirect("/customer/bookings?success=1");
}

export async function cancelBooking(formData: FormData) {
  const { supabase, user } = await requireRole("customer");
  const bookingId = String(formData.get("booking_id") ?? "");
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, status, companion_id")
    .eq("id", bookingId)
    .eq("customer_id", user.id)
    .in("status", ["pending", "accepted"])
    .maybeSingle();

  if (!booking) redirect("/customer/bookings?error=cancel-failed");

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", cancellation_reason: "ยกเลิกโดยลูกค้า" })
    .eq("id", booking.id)
    .eq("customer_id", user.id);

  if (error) {
    console.error("Unable to cancel booking", error);
    redirect("/customer/bookings?error=cancel-failed");
  }

  await supabase.from("booking_status_history").insert({
    booking_id: booking.id,
    old_status: booking.status,
    new_status: "cancelled",
    changed_by: user.id,
    note: "ยกเลิกโดยลูกค้า",
  });
  if (booking.companion_id) {
    await supabase.from("notifications").insert({
      user_id: booking.companion_id,
      title: "คำขอถูกยกเลิก",
      message: "ลูกค้ายกเลิกคำขอบริการนี้แล้ว",
      booking_id: booking.id,
    });
  }

  revalidatePath("/customer/bookings");
  revalidatePath("/companion/jobs");
  redirect("/customer/bookings?cancelled=1");
}