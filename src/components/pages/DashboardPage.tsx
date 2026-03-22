import React from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { Users, Clock, CreditCard, UserPlus, AlertTriangle, Eye } from "lucide-react";

const activities = [
  { key: "act1", textEn: "Maintenance request #42 resolved", textHi: "रखरखाव अनुरोध #42 हल किया गया", textMr: "देखभाल विनंती #42 सोडवली", time: "2h ago" },
  { key: "act2", textEn: "Payment received from A-204", textHi: "A-204 से भुगतान प्राप्त", textMr: "A-204 कडून पेमेंट मिळाले", time: "5h ago" },
  { key: "act3", textEn: "New notice posted: Water supply", textHi: "नई सूचना: पानी की आपूर्ति", textMr: "नवीन सूचना: पाणीपुरवठा", time: "1d ago" },
];

export const DashboardPage: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { t, language } = useI18n();
  const { user } = useAuth();

  const stats = [
    { label: t("home.totalResidents"), value: "128", icon: Users, color: "bg-accent text-accent-foreground" },
    { label: t("home.pendingRequests"), value: "7", icon: Clock, color: "bg-warning/10 text-warning" },
    { label: t("home.duePayments"), value: "₹24,500", icon: CreditCard, color: "bg-destructive/10 text-destructive" },
  ];

  const quickActions = [
    { label: t("home.addResident"), icon: UserPlus, action: () => onNavigate("residents") },
    { label: t("home.raiseComplaint"), icon: AlertTriangle, action: () => onNavigate("requests") },
    { label: t("home.viewPayments"), icon: Eye, action: () => onNavigate("payments") },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-foreground">
          {t("home.welcome")}, {user?.name} 👋
        </h2>
        <p className="text-sm text-muted-foreground capitalize">{t(`auth.${user?.role}`)}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl bg-card p-4 card-shadow transition-shadow hover:card-shadow-hover">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">{t("home.quickActions")}</h3>
        <div className="flex gap-3">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={a.action}
              className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-card p-4 card-shadow transition-all hover:card-shadow-hover active:scale-[0.97]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <a.icon size={20} />
              </div>
              <span className="text-[11px] font-medium text-foreground text-center leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">{t("home.recentActivity")}</h3>
        <div className="space-y-2">
          {activities.map((a) => (
            <div key={a.key} className="flex items-center justify-between rounded-xl bg-card px-4 py-3 card-shadow">
              <p className="text-sm text-foreground">
                {language === "hi" ? a.textHi : language === "mr" ? a.textMr : a.textEn}
              </p>
              <span className="ml-3 shrink-0 text-xs text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
