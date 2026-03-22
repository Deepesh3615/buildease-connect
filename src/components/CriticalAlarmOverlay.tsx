import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useCriticalNotice, CriticalNotice } from "@/lib/critical-notice-context";
import { ShieldAlert, Clock, AlarmClockOff } from "lucide-react";

const snoozeOptions = [
  { minutes: 15, labelKey: "alarm.snooze15" },
  { minutes: 30, labelKey: "alarm.snooze30" },
  { minutes: 60, labelKey: "alarm.snooze60" },
];

export const CriticalAlarmOverlay: React.FC = () => {
  const { t, language } = useI18n();
  const { activeAlarm, acknowledgeNotice, snoozeNotice } = useCriticalNotice();
  const [showSnooze, setShowSnooze] = useState(false);

  if (!activeAlarm) return null;

  const title =
    language === "hi" ? activeAlarm.titleHi :
    language === "mr" ? activeAlarm.titleMr :
    activeAlarm.title;

  const message =
    language === "hi" ? activeAlarm.messageHi :
    language === "mr" ? activeAlarm.messageMr :
    activeAlarm.message;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Pulsing red glow behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-80 w-80 rounded-full bg-destructive/20 animate-pulse" />
      </div>

      <div className="relative mx-4 w-full max-w-sm animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl bg-card shadow-2xl border-2 border-destructive/30">
          {/* Red header strip */}
          <div className="bg-destructive px-5 py-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <ShieldAlert size={22} className="text-destructive-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-destructive-foreground/70">
                {t("alarm.criticalNotice")}
              </p>
              <h2 className="text-base font-bold text-destructive-foreground leading-tight">
                {title}
              </h2>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-4">
            <p className="text-sm text-foreground leading-relaxed">{message}</p>

            <p className="text-[10px] text-muted-foreground">
              {t("alarm.postedBy")}: {activeAlarm.createdBy}
            </p>

            {/* Action buttons */}
            <div className="space-y-2">
              <button
                onClick={() => acknowledgeNotice(activeAlarm.id)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive py-3.5 text-sm font-bold text-destructive-foreground transition-all hover:opacity-90 active:scale-[0.97]"
              >
                <AlarmClockOff size={16} />
                {t("alarm.stopAndRead")}
              </button>

              {!showSnooze ? (
                <button
                  onClick={() => setShowSnooze(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-secondary py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary/80 active:scale-[0.97]"
                >
                  <Clock size={16} />
                  {t("alarm.snooze")}
                </button>
              ) : (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <p className="text-xs font-medium text-muted-foreground text-center">{t("alarm.snoozeFor")}</p>
                  <div className="flex gap-2">
                    {snoozeOptions.map((opt) => (
                      <button
                        key={opt.minutes}
                        onClick={() => {
                          snoozeNotice(activeAlarm.id, opt.minutes);
                          setShowSnooze(false);
                        }}
                        className="flex-1 rounded-xl border border-border bg-card py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-secondary active:scale-[0.95]"
                      >
                        {t(opt.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
