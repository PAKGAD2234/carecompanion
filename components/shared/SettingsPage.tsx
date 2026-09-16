"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DashboardShell } from "@/components/layout/DashboardShell";

type Role = "customer" | "companion" | "admin";

export function SettingsPage({ role }: { role: Role }) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", user.id)
        .single();
      if (data) {
        setUserId(data.id);
        setFullName(data.full_name ?? "");
        setAvatarUrl(data.avatar_url);
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setMessage(null);
    let newAvatarUrl = avatarUrl;

    try {
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const filePath = `${userId}/avatar.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
        newAvatarUrl = publicUrlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ full_name: fullName, avatar_url: newAvatarUrl })
        .eq("id", userId);
      if (updateError) throw updateError;

      setAvatarUrl(newAvatarUrl);
      setAvatarFile(null);
      setMessage({ type: "success", text: "บันทึกข้อมูลเรียบร้อยแล้ว" });
    } catch {
      setMessage({ type: "error", text: "บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell role={role} title="ตั้งค่าบัญชี" description="แก้ไขชื่อและรูปโปรไฟล์ของคุณ">
        <p className="mt-8 text-[#29213D]/70">กำลังโหลดข้อมูล...</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role={role} title="ตั้งค่าบัญชี" description="แก้ไขชื่อและรูปโปรไฟล์ของคุณ">
      <Card className="mt-8 max-w-xl">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative h-24 w-24 shrink-0">
            <div className="h-24 w-24 overflow-hidden rounded-full bg-[#8B5CE7]/10">
              {previewUrl || avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl ?? avatarUrl ?? ""} alt="รูปโปรไฟล์" className="h-full w-full object-cover" />
              ) : (
                <UserRound className="mx-auto mt-6 text-[#8B5CE7]" size={48} strokeWidth={1.5} />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#8B5CE7] text-[#FAF7FF] shadow-md hover:bg-[#7C3AED]"
              aria-label="เปลี่ยนรูปโปรไฟล์"
            >
              <Camera size={18} strokeWidth={2} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </div>
          <div className="flex-1 self-stretch">
            <label className="block font-bold" htmlFor="fullName">ชื่อ-นามสกุล</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 min-h-14 w-full rounded-xl border-2 border-[#29213D]/20 bg-[#FAF7FF] px-4 text-lg focus:border-[#8B5CE7]"
            />
          </div>
        </div>

        {message ? (
          <p className={`mt-4 font-semibold ${message.type === "success" ? "text-[#93C5FD]" : "text-[#D64545]"}`} role="alert">
            {message.text}
          </p>
        ) : null}

        <Button className="mt-6 w-full sm:w-auto" onClick={handleSave} disabled={saving}>
          {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </Button>
      </Card>
    </DashboardShell>
  );
}