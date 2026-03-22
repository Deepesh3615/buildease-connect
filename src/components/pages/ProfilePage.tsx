import React from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { useCriticalNotice } from "@/lib/critical-notice-context";
import { LanguageSelector } from "@/components/LanguageSelector";
import { LogOut, ChevronRight, User, Volume2, VolumeX, Vibrate } from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const { alarmSettings, setAlarmSettings } = useCriticalNotice();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* User info */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-xl font-bold text-accent-foreground">
          {user?.name.split(" ").map((n) => n[0]).join("") || <User size={32} />}
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground">{user?.name}</h2>
          <p className="text-sm text-muted-foreground capitalize">{t(`auth.${user?.role}`)} · {t("residents.flat")} {user?.flat}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-1">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("profile.settings")}</h3>

        {/* Language */}
        <div className="flex items-center justify-between rounded-2xl bg-card p-4 card-shadow">
          <span className="text-sm font-medium text-foreground">{t("profile.language")}</span>
          <LanguageSelector />
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between rounded-2xl bg-card p-4 card-shadow">
          <span className="text-sm font-medium text-foreground">{t("profile.notifications")}</span>
          <ChevronRight size={16} className="text-muted-foreground" />
        </div>
      </div>

      {/* Alarm Settings */}
      <div className="space-y-1">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("alarm.settings")}</h3>

        {/* Sound toggle */}
        <div className="flex items-center justify-between rounded-2xl bg-card p-4 card-shadow">
          <div className="flex items-center gap-2">
            {alarmSettings.soundEnabled ? (
              <Volume2 size={16} className="text-primary" />
            ) : (
              <VolumeX size={16} className="text-muted-foreground" />
            )}
            <span className="text-sm font-medium text-foreground">{t("alarm.sound")}</span>
          </div>
          <div
            onClick={() => setAlarmSettings({ ...alarmSettings, soundEnabled: !alarmSettings.soundEnabled })}
            className={`flex h-6 w-11 cursor-pointer items-center rounded-full px-0.5 transition-colors ${
              alarmSettings.soundEnabled ? "bg-primary" : "bg-border"
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                alarmSettings.soundEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* Vibration toggle */}
        <div className="flex items-center justify-between rounded-2xl bg-card p-4 card-shadow">
          <div className="flex items-center gap-2">
            <Vibrate size={16} className={alarmSettings.vibrationEnabled ? "text-primary" : "text-muted-foreground"} />
            <span className="text-sm font-medium text-foreground">{t("alarm.vibration")}</span>
          </div>
          <div
            onClick={() => setAlarmSettings({ ...alarmSettings, vibrationEnabled: !alarmSettings.vibrationEnabled })}
            className={`flex h-6 w-11 cursor-pointer items-center rounded-full px-0.5 transition-colors ${
              alarmSettings.vibrationEnabled ? "bg-primary" : "bg-border"
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                alarmSettings.vibrationEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 py-3.5 text-sm font-semibold text-destructive transition-all hover:bg-destructive/15 active:scale-[0.98]"
      >
        <LogOut size={16} />
        {t("profile.logout")}
      </button>
    </div>
  );
};
