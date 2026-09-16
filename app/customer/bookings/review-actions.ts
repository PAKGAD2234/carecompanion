"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export async function submitReview(formData: FormData) {
  const { supabase, user } = await requireRole("customer");
  const bookingId = String(formData.get("booking_id") ?? "");
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!bookingId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    redirect("/customer/bookings?review=invalid");
  }

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, companion_id")
    .eq("id", bookingId)
    .eq("customer_id", user.id)
    .eq("status", "completed")
    .maybeSingle();

  if (!booking?.companion_id) redirect("/customer/bookings?review=not-eligible");

  const { error } = await supabase.from("reviews").insert({
    booking_id: booking.id,
    customer_id: user.id,
    companion_id: booking.companion_id,
    rating,
    comment: comment || null,
  });

  if (error) {
    console.error("Unable to submit review", error);
    redirect(`/customer/bookings?review=${error.code === "23505" ? "duplicate" : "save-failed"}`);
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("companion_id", booking.companion_id);
  const totalReviews = reviews?.length ?? 0;
  const averageRating = totalReviews ? reviews!.reduce((sum, item) => sum + item.rating, 0) / totalReviews : 0;
  await supabase.from("companion_profiles").update({ average_rating: averageRating, total_reviews: totalReviews }).eq("id", booking.companion_id);

  revalidatePath("/customer/bookings");
  revalidatePath("/companion");
  redirect("/customer/bookings?review=success");
}
