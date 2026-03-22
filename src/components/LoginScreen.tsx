import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Eye, EyeOff, Building2 } from "lucide-react";

export const LoginScreen: React.FC = () => {
  const { t } = useI18n();
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "resident" as "admin" | "resident" | "staff",
    flat: "",
    building: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: form.name || "User",
      email: form.email,
      phone: form.phone,
      role: form.role,
      flat: form.flat || "A-101",
      building: form.building || "Tower A",
    });
  };

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      {/* Language selector */}
      <div className="absolute right-4 top-4">
        <LanguageSelector />
      </div>

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg">
          <Building2 className="text-primary-foreground" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{t("app.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("app.tagline")}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {isSignup && (
          <>
            <input
              type="text"
              placeholder={t("auth.name")}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="tel"
              placeholder={t("auth.phone")}
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </>
        )}

        <input
          type="email"
          placeholder={t("auth.email")}
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.password")}
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {isSignup && (
          <>
            {/* Role selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">{t("auth.role")}</label>
              <div className="flex gap-2">
                {(["resident", "admin", "staff"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => updateField("role", role)}
                    className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all active:scale-[0.97] ${
                      form.role === role
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {t(`auth.${role}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder={t("auth.flat")}
                value={form.flat}
                onChange={(e) => updateField("flat", e.target.value)}
                className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="text"
                placeholder={t("auth.building")}
                value={form.building}
                onChange={(e) => updateField("building", e.target.value)}
                className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full rounded-xl gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 active:scale-[0.98]"
        >
          {isSignup ? t("auth.signup") : t("auth.login")}
        </button>

        {!isSignup && (
          <button type="button" className="w-full text-center text-xs text-primary font-medium">
            {t("auth.forgotPassword")}
          </button>
        )}

        <div className="flex items-center justify-center gap-1 pt-2">
          <span className="text-xs text-muted-foreground">
            {isSignup ? t("auth.haveAccount") : t("auth.noAccount")}
          </span>
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-xs font-semibold text-primary"
          >
            {isSignup ? t("auth.login") : t("auth.createAccount")}
          </button>
        </div>
      </form>
    </div>
  );
};
