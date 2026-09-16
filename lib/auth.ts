import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/hooks/useAuth";

export async function requireRole(role: UserRole) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, avatar_url")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profile?.role !== role) {
    redirect(profile?.role ? `/${profile.role}` : "/select-role");
  }

  return { supabase, user: userData.user, profile: profile as Profile };
}