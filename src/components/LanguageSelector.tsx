import React from "react";
import { useI18n, Language, languageNames } from "@/lib/i18n";
import { Globe } from "lucide-react";

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { language, setLanguage } = useI18n();
  const langs: Language[] = ["en", "hi", "mr"];

  if (compact) {
    return (
      <button
        onClick={() => {
          const idx = langs.indexOf(language);
          setLanguage(langs[(idx + 1) % langs.length]);
        }}
        className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 active:scale-[0.97]"
      >
        <Globe size={14} />
        {languageNames[language]}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-xl bg-secondary p-1">
      {langs.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97] ${
            language === lang
              ? "gradient-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {languageNames[lang]}
        </button>
      ))}
    </div>
  );
};
