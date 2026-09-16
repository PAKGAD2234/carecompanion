"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

type GoogleLoginButtonProps = {
  initialError?: string;
};

export function GoogleLoginButton({ initialError }: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);

  async function signInWithGoogle() {
    setLoading(true);
    setError(null);
    const { error: signInError } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/callback` },
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    }
  }

  return (
    <>
      <Button className="w-full" onClick={signInWithGoogle} disabled={loading}>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF7FF] text-base font-extrabold text-[#8B5CE7]">G</span>
        {loading ? "กำลังเชื่อมต่อ..." : "เข้าสู่ระบบด้วย Google"}
        <ArrowRight size={22} strokeWidth={2} aria-hidden="true" />
      </Button>
      {error ? <p className="mt-4 text-center font-semibold text-[#D64545]" role="alert">{error}</p> : null}
    </>
  );
}
