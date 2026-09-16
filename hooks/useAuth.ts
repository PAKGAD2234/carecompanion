"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type UserRole = "customer" | "companion" | "admin";

export type Profile = {
  id: string;
  role: UserRole | null;
  full_name?: string | null;
  avatar_url?: string | null;
};

export function useAuth() {
  const [user, setUser] = useState<Awaited<ReturnType<ReturnType<typeof createClient>["auth"]["getUser"]>>["data"]["user"]>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadAuth() {
      const { data } = await supabase.auth.getUser();
      if (!active) return;

      setUser(data.user);
      if (data.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, role, full_name, avatar_url")
          .eq("id", data.user.id)
          .maybeSingle();
        if (active) setProfile(profileData as Profile | null);
      }
      if (active) setLoading(false);
    }

    void loadAuth();
    const { data: listener } = supabase.auth.onAuthStateChange(() => void loadAuth());
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, role: profile?.role ?? null, loading };
}