import React from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { Plus } from "lucide-react";

type Status = "pending" | "inProgress" | "completed";

const mockRequests = [
  { id: 1, title: "Lift not working", titleHi: "लिफ्ट काम नहीं कर रही", titleMr: "लिफ्ट चालू नाही", desc: "Tower A lift has been out of service since morning.", status: "pending" as Status },
  { id: 2, title: "Water leakage in B-205", titleHi: "B-205 में पानी का रिसाव", titleMr: "B-205 मध्ये पाणीगळती", desc: "Bathroom ceiling is leaking.", status: "inProgress" as Status },
  { id: 3, title: "Garden lights broken", titleHi: "बगीचे की लाइट खराब", titleMr: "बागेचे दिवे तुटलेले", desc: "Multiple lights in the garden area are not functioning.", status: "completed" as Status },
  { id: 4, title: "Parking gate issue", titleHi: "पार्किंग गेट की समस्या", titleMr: "पार्किंग गेटची समस्या", desc: "Automatic gate is stuck halfway.", status: "pending" as Status },
];

const statusConfig: Record<Status, { label: string; dot: string; bg: string }> = {
  pending: { label: "requests.pending", dot: "bg-warning", bg: "bg-warning/10 text-warning" },
  inProgress: { label: "requests.inProgress", dot: "bg-info", bg: "bg-info/10 text-info" },
  completed: { label: "requests.completed", dot: "bg-success", bg: "bg-success/10 text-success" },
};

export const RequestsPage: React.FC = () => {
  const { t, language } = useI18n();
  const { user } = useAuth();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* New request button */}
      {(user?.role === "resident" || user?.role === "admin") && (
        <button className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 active:scale-[0.98]">
          <Plus size={16} />
          {t("requests.new")}
        </button>
      )}

      {/* List */}
      <div className="space-y-3">
        {mockRequests.map((r) => {
          const sc = statusConfig[r.status];
          const title = language === "hi" ? r.titleHi : language === "mr" ? r.titleMr : r.title;
          return (
            <div key={r.id} className="rounded-2xl bg-card p-4 card-shadow transition-shadow hover:card-shadow-hover">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${sc.bg}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                  {t(sc.label)}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
              {(user?.role === "admin" || user?.role === "staff") && r.status !== "completed" && (
                <button className="mt-3 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent/80 active:scale-[0.97]">
                  {r.status === "pending" ? t("requests.inProgress") : t("requests.completed")}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
