import React from "react";
import { useI18n } from "@/lib/i18n";
import { AlertTriangle } from "lucide-react";

const mockNotices = [
  { id: 1, title: "Water Supply Disruption", titleHi: "पानी की आपूर्ति बाधित", titleMr: "पाणीपुरवठा बंद", msg: "Water supply will be disrupted on March 22 from 10 AM to 4 PM due to maintenance work.", msgHi: "22 मार्च को सुबह 10 बजे से शाम 4 बजे तक पानी की आपूर्ति बाधित रहेगी।", msgMr: "22 मार्च रोजी सकाळी 10 ते सायंकाळी 4 वाजेपर्यंत पाणीपुरवठा बंद राहील.", date: "20 Mar 2025", important: true },
  { id: 2, title: "Annual General Meeting", titleHi: "वार्षिक आम बैठक", titleMr: "वार्षिक सर्वसाधारण सभा", msg: "AGM will be held on March 30 at 6 PM in the community hall. All residents are requested to attend.", msgHi: "वार्षिक आम बैठक 30 मार्च को शाम 6 बजे कम्युनिटी हॉल में होगी।", msgMr: "वार्षिक सर्वसाधारण सभा 30 मार्च रोजी सायंकाळी 6 वाजता कम्युनिटी हॉलमध्ये होईल.", date: "18 Mar 2025", important: false },
  { id: 3, title: "New Security Protocol", titleHi: "नया सुरक्षा प्रोटोकॉल", titleMr: "नवीन सुरक्षा नियम", msg: "Starting April 1, all visitors must register at the gate. Residents please inform your guests.", msgHi: "1 अप्रैल से सभी आगंतुकों को गेट पर रजिस्ट्रेशन कराना होगा।", msgMr: "1 एप्रिलपासून सर्व पाहुण्यांची गेटवर नोंदणी करणे अनिवार्य.", date: "15 Mar 2025", important: true },
];

export const NoticesPage: React.FC = () => {
  const { t, language } = useI18n();

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
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
