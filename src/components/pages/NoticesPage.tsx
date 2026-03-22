import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { useCriticalNotice, CriticalNotice } from "@/lib/critical-notice-context";
import { AlertTriangle, ShieldAlert, Plus, X, RotateCcw } from "lucide-react";

const mockNotices = [
  { id: "n1", title: "Water Supply Disruption", titleHi: "पानी की आपूर्ति बाधित", titleMr: "पाणीपुरवठा बंद", msg: "Water supply will be disrupted on March 22 from 10 AM to 4 PM due to maintenance work.", msgHi: "22 मार्च को सुबह 10 बजे से शाम 4 बजे तक पानी की आपूर्ति बाधित रहेगी।", msgMr: "22 मार्च रोजी सकाळी 10 ते सायंकाळी 4 वाजेपर्यंत पाणीपुरवठा बंद राहील.", date: "20 Mar 2025", important: true, type: "normal" as const },
  { id: "n2", title: "Annual General Meeting", titleHi: "वार्षिक आम बैठक", titleMr: "वार्षिक सर्वसाधारण सभा", msg: "AGM will be held on March 30 at 6 PM in the community hall. All residents are requested to attend.", msgHi: "वार्षिक आम बैठक 30 मार्च को शाम 6 बजे कम्युनिटी हॉल में होगी।", msgMr: "वार्षिक सर्वसाधारण सभा 30 मार्च रोजी सायंकाळी 6 वाजता कम्युनिटी हॉलमध्ये होईल.", date: "18 Mar 2025", important: false, type: "normal" as const },
  { id: "n3", title: "New Security Protocol", titleHi: "नया सुरक्षा प्रोटोकॉल", titleMr: "नवीन सुरक्षा नियम", msg: "Starting April 1, all visitors must register at the gate. Residents please inform your guests.", msgHi: "1 अप्रैल से सभी आगंतुकों को गेट पर रजिस्ट्रेशन कराना होगा।", msgMr: "1 एप्रिलपासून सर्व पाहुण्यांची गेटवर नोंदणी करणे अनिवार्य.", date: "15 Mar 2025", important: true, type: "normal" as const },
];

export const NoticesPage: React.FC = () => {
  const { t, language } = useI18n();
  const { user } = useAuth();
  const { criticalNotices, addCriticalNotice } = useCriticalNotice();
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formType, setFormType] = useState<"normal" | "critical">("normal");
  const [formRepeat, setFormRepeat] = useState(true);

  const canCreate = user?.role === "admin" || user?.role === "staff";

  const handleSubmit = () => {
    if (!formTitle.trim() || !formMessage.trim()) return;
    if (formType === "critical") {
      const notice: CriticalNotice = {
        id: `crit-${Date.now()}`,
        title: formTitle,
        titleHi: formTitle,
        titleMr: formTitle,
        message: formMessage,
        messageHi: formMessage,
        messageMr: formMessage,
        type: "critical",
        createdAt: new Date(),
        createdBy: `${user?.name} (${user?.role})`,
        repeatUntilAcknowledged: formRepeat,
      };
      addCriticalNotice(notice);
    }
    setFormTitle("");
    setFormMessage("");
    setFormType("normal");
    setShowForm(false);
  };

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Create notice button for admin/staff */}
      {canCreate && (
        <button
          onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card py-3 text-sm font-semibold text-primary transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
        >
          <Plus size={16} />
          {t("notices.createNew")}
        </button>
      )}

      {/* Create notice form */}
      {showForm && (
        <div className="rounded-2xl bg-card p-4 card-shadow space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">{t("notices.createNew")}</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground active:scale-95">
              <X size={18} />
            </button>
          </div>

          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder={t("notices.noticeTitle")}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            value={formMessage}
            onChange={(e) => setFormMessage(e.target.value)}
            placeholder={t("notices.noticeMessage")}
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring resize-none"
          />

          {/* Type selector */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">{t("notices.noticeType")}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setFormType("normal")}
                className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all active:scale-[0.97] ${
                  formType === "normal"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {t("notices.normal")}
              </button>
              <button
                onClick={() => setFormType("critical")}
                className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all active:scale-[0.97] ${
                  formType === "critical"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                🔴 {t("notices.critical")}
              </button>
            </div>
          </div>

          {/* Repeat toggle (only for critical) */}
          {formType === "critical" && (
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setFormRepeat(!formRepeat)}
                className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${
                  formRepeat ? "bg-primary" : "bg-border"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    formRepeat ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
              <span className="text-xs text-foreground flex items-center gap-1">
                <RotateCcw size={12} />
                {t("notices.repeatUntilAck")}
              </span>
            </label>
          )}

          {/* Submit */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 rounded-xl bg-secondary py-2.5 text-xs font-semibold text-foreground active:scale-[0.97]"
            >
              {t("notices.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formTitle.trim() || !formMessage.trim()}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold text-white active:scale-[0.97] disabled:opacity-40 ${
                formType === "critical" ? "bg-destructive" : "bg-primary"
              }`}
            >
              {t("notices.post")}
            </button>
          </div>
        </div>
      )}

      {/* Critical notices */}
      {criticalNotices
        .filter((n) => n.type === "critical")
        .map((n) => {
          const title = language === "hi" ? n.titleHi : language === "mr" ? n.titleMr : n.title;
          const msg = language === "hi" ? n.messageHi : language === "mr" ? n.messageMr : n.message;
          return (
            <div
              key={n.id}
              className="rounded-2xl bg-card p-4 card-shadow border-l-4 border-l-destructive transition-shadow hover:card-shadow-hover"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                  <ShieldAlert size={10} />
                  {t("notices.critical")}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{msg}</p>
              <p className="mt-2 text-[10px] text-muted-foreground/70">
                {n.createdAt.toLocaleDateString()} · {n.createdBy}
              </p>
            </div>
          );
        })}

      {/* Normal notices */}
      {mockNotices.map((n) => {
        const title = language === "hi" ? n.titleHi : language === "mr" ? n.titleMr : n.title;
        const msg = language === "hi" ? n.msgHi : language === "mr" ? n.msgMr : n.msg;
        return (
          <div key={n.id} className={`rounded-2xl bg-card p-4 card-shadow transition-shadow hover:card-shadow-hover ${n.important ? "border-l-4 border-l-warning" : ""}`}>
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              {n.important && (
                <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning">
                  <AlertTriangle size={10} />
                  {t("notices.important")}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{msg}</p>
            <p className="mt-2 text-[10px] text-muted-foreground/70">{n.date}</p>
          </div>
        );
      })}
    </div>
  );
};
