type BookingStatus = "pending" | "accepted" | "completed" | "cancelled" | "rejected" | string;

type BadgeProps = {
  status: BookingStatus;
  label?: string;
};

const statusClasses: Record<string, string> = {
  pending: "bg-[#A78BFA]/30 text-[#29213D]",
  accepted: "bg-[#93C5FD]/25 text-[#29213D]",
  completed: "bg-[#8B5CE7]/20 text-[#7C3AED]",
  cancelled: "bg-[#D64545]/15 text-[#D64545]",
  rejected: "bg-[#D64545]/15 text-[#D64545]",
};

export function Badge({ status, label }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-4 py-2 text-base font-bold ${statusClasses[status] ?? "bg-[#29213D]/10 text-[#29213D]"}`}>
      {label ?? status}
    </span>
  );
}