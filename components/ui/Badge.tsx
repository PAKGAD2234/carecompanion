type BookingStatus = "pending" | "accepted" | "completed" | "cancelled" | "rejected" | string;

type BadgeProps = {
  status: BookingStatus;
  label?: string;
};

const statusClasses: Record<string, string> = {
  pending: "bg-[#F5A65B]/30 text-[#2E2E2E]",
  accepted: "bg-[#2FA88A]/25 text-[#2E2E2E]",
  completed: "bg-[#1F8F73]/20 text-[#187A62]",
  cancelled: "bg-[#D64545]/15 text-[#D64545]",
  rejected: "bg-[#D64545]/15 text-[#D64545]",
};

export function Badge({ status, label }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-4 py-2 text-base font-bold ${statusClasses[status] ?? "bg-[#2E2E2E]/10 text-[#2E2E2E]"}`}>
      {label ?? status}
    </span>
  );
}