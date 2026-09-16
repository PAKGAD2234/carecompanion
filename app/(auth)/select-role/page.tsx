"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeartHandshake, UserRound, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";

const roles = [
  { value: "customer", label: "ฉันต้องการผู้ช่วยเดินทาง", description: "ค้นหาและจองผู้ช่วยเพื่อเดินทางอย่างมั่นใจ", icon: UserRound },
  { value: "companion", label: "ฉันต้องการเป็นผู้ช่วยเดินทาง", description: "ใช้ทักษะของคุณเพื่อดูแลและช่วยเหลือผู้อื่น", icon: UsersRound },
] as const;

export default function SelectRolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<(typeof roles)[number]["value"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveRole() {
    if (!selectedRole) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/login");
      return;
    }

    const { data: currentProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError || currentProfile?.role) {
      router.push(currentProfile?.role ? `/${currentProfile.role}` : "/login");
      return;
    }

    const { error: updateError } = await supabase.from("profiles").upsert({
      id: userData.user.id,
      role: selectedRole,
      full_name: userData.user.user_metadata.full_name ?? userData.user.user_metadata.name ?? "ผู้ใช้งาน Care Companion",
      email: userData.user.email ?? "",
      avatar_url: userData.user.user_metadata.avatar_url ?? userData.user.user_metadata.picture ?? null,
    });
    if (updateError) {
      setError("บันทึกบทบาทไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setLoading(false);
      return;
    }
    router.push(`/${selectedRole}`);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <HeartHandshake className="mx-auto mb-4 text-[#1F8F73]" size={44} strokeWidth={2} aria-hidden="true" />
          <h1 className="text-3xl font-extrabold text-[#2E2E2E]">คุณต้องการใช้ Care Companion แบบไหน?</h1>
          <p className="mt-3 text-[#2E2E2E]/75">เลือกบทบาทของคุณเพื่อเริ่มต้นใช้งาน</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map(({ value, label, description, icon: Icon }) => {
            const selected = selectedRole === value;
            return (
              <button key={value} type="button" onClick={() => setSelectedRole(value)} className="text-left">
                <Card className={`h-full border-2 transition-colors ${selected ? "border-[#1F8F73] bg-[#1F8F73]/10" : "border-[#2E2E2E]/10"}`}>
                  <Icon className="mb-5 text-[#1F8F73]" size={40} strokeWidth={2} aria-hidden="true" />
                  <h2 className="text-xl font-extrabold text-[#2E2E2E]">{label}</h2>
                  <p className="mt-3 leading-relaxed text-[#2E2E2E]/75">{description}</p>
                </Card>
              </button>
            );
          })}
        </div>
        <Button className="mt-6 w-full" onClick={saveRole} disabled={!selectedRole || loading}>
          {loading ? "กำลังบันทึก..." : "ดำเนินการต่อ"}
        </Button>
        {error ? <p className="mt-4 text-center font-semibold text-[#D64545]" role="alert">{error}</p> : null}
      </div>
    </main>
  );
}