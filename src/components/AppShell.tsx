import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Home, Users, Wrench, CreditCard, Megaphone, UserCircle, Bell } from "lucide-react";
import { DashboardPage } from "@/components/pages/DashboardPage";
import { ResidentsPage } from "@/components/pages/ResidentsPage";
import { RequestsPage } from "@/components/pages/RequestsPage";
import { PaymentsPage } from "@/components/pages/PaymentsPage";
import { NoticesPage } from "@/components/pages/NoticesPage";
import { ProfilePage } from "@/components/pages/ProfilePage";

type Tab = "home" | "residents" | "requests" | "payments" | "notices" | "profile";

const tabs: { key: Tab; icon: React.ElementType; labelKey: string }[] = [
  { key: "home", icon: Home, labelKey: "nav.home" },
  { key: "residents", icon: Users, labelKey: "nav.residents" },
  { key: "requests", icon: Wrench, labelKey: "nav.requests" },
  { key: "payments", icon: CreditCard, labelKey: "nav.payments" },
  { key: "notices", icon: Megaphone, labelKey: "nav.notices" },
  { key: "profile", icon: UserCircle, labelKey: "nav.profile" },
];

export const AppShell: React.FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [notificationCount] = useState(3);

  const pageTitleKeys: Record<Tab, string> = {
    home: "nav.home",
    residents: "residents.title",
    requests: "requests.title",
    payments: "payments.title",
    notices: "notices.title",
    profile: "profile.title",
  };

  const renderPage = () => {
    switch (activeTab) {
      case "home": return <DashboardPage onNavigate={setActiveTab} />;
      case "residents": return <ResidentsPage />;
      case "requests": return <RequestsPage />;
      case "payments": return <PaymentsPage />;
      case "notices": return <NoticesPage />;
      case "profile": return <ProfilePage />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-md">
        <h1 className="text-lg font-bold text-foreground">{t(pageTitleKeys[activeTab])}</h1>
        <div className="flex items-center gap-2">
          <LanguageSelector compact />
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80 active:scale-[0.95]">
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
        {renderPage()}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-around py-1">
          {tabs.map(({ key, icon: Icon, labelKey }) => {
            const isActive = activeTab === key;
            // Hide residents tab for staff
            if (key === "residents" && user?.role === "staff") return null;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 transition-all active:scale-[0.93] ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>
                  {t(labelKey)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
