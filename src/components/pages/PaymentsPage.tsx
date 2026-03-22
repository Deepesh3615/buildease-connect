import React from "react";
import { useI18n } from "@/lib/i18n";
import { CheckCircle2, Clock, Receipt } from "lucide-react";

const mockPayments = [
  { id: 1, label: "Maintenance - Jan 2025", amount: "₹3,500", status: "paid" as const, date: "15 Jan 2025" },
  { id: 2, label: "Maintenance - Feb 2025", amount: "₹3,500", status: "paid" as const, date: "14 Feb 2025" },
  { id: 3, label: "Maintenance - Mar 2025", amount: "₹3,500", status: "due" as const, date: "Due: 15 Mar 2025" },
  { id: 4, label: "Parking Charges", amount: "₹1,000", status: "due" as const, date: "Due: 20 Mar 2025" },
];

export const PaymentsPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Summary */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-2xl bg-success/10 p-4">
          <p className="text-xs font-medium text-success">{t("payments.paid")}</p>
          <p className="mt-1 text-lg font-bold text-success">₹7,000</p>
        </div>
        <div className="flex-1 rounded-2xl bg-destructive/10 p-4">
          <p className="text-xs font-medium text-destructive">{t("payments.due")}</p>
          <p className="mt-1 text-lg font-bold text-destructive">₹4,500</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {mockPayments.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-2xl bg-card p-4 card-shadow transition-shadow hover:card-shadow-hover">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${p.status === "paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                {p.status === "paid" ? <CheckCircle2 size={18} /> : <Clock size={18} />}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{p.label}</p>
                <p className="text-xs text-muted-foreground">{p.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${p.status === "paid" ? "text-foreground" : "text-destructive"}`}>
                {p.amount}
              </span>
              {p.status === "paid" ? (
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 active:scale-[0.95]">
                  <Receipt size={14} />
                </button>
              ) : (
                <button className="rounded-lg gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-95 active:scale-[0.97]">
                  {t("payments.pay")}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
