"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, X } from "lucide-react";
import { Card } from "@/components/ui/Card";

export type MetricItem = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
};

export type MetricGroup = {
  key: string;
  label: string;
  value: number;
  icon: ReactNode;
  items: MetricItem[];
  empty: string;
};

export function DashboardMetrics({ groups }: { groups: MetricGroup[] }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const active = groups.find((g) => g.key === activeKey) ?? null;

  return (
    <div className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => {
          const isActive = group.key === activeKey;
          return (
            <button
              key={group.key}
              type="button"
              onClick={() => setActiveKey(isActive ? null : group.key)}
              className="text-left"
              aria-expanded={isActive}
            >
              <Card
                className={`h-full cursor-pointer transition-all hover:shadow-md ${
                  isActive ? "ring-2 ring-[#8B5CE7]" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  {group.icon}
                  <ChevronDown
                    className={`text-[#29213D]/40 transition-transform ${isActive ? "rotate-180" : ""}`}
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-5 text-4xl font-extrabold">{group.value}</p>
                <p className="mt-2 text-[#29213D]/75">{group.label}</p>
              </Card>
            </button>
          );
        })}
      </div>

      {active ? (
        <Card className="mt-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold">{active.label}</h2>
              <p className="text-sm text-[#29213D]/60">ทั้งหมด {active.value} รายการ</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveKey(null)}
              className="rounded-xl p-2 text-[#29213D]/50 hover:bg-[#29213D]/5"
              aria-label="ปิด"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {active.items.length === 0 ? (
            <p className="py-8 text-center text-[#29213D]/60">{active.empty}</p>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {active.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-xl bg-[#FAF7FF] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold">{item.title}</p>
                    {item.subtitle ? (
                      <p className="truncate text-sm text-[#29213D]/60">{item.subtitle}</p>
                    ) : null}
                  </div>
                  {item.meta ? (
                    <span className="shrink-0 rounded-full bg-[#8B5CE7]/10 px-3 py-1 text-xs font-bold text-[#8B5CE7]">
                      {item.meta}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}