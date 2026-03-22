import React, { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Eye, EyeOff, Building2 } from "lucide-react";

const EXISTING_USERNAMES = ["rahula101", "priya202", "admin1", "staff01"];

const USERNAME_REGEX = /^[a-zA-Z0-9]{4,15}$/;

export const LoginScreen: React.FC = () => {
  const { t } = useI18n();
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberUsername, setRememberUsername] = useState(() => {
    return !!localStorage.getItem("buildease-remember-username");
  });

  const [form, setForm] = useState({
    name: "",
    username: localStorage.getItem("buildease-remember-username") || "",
    email: "",
    phone: "",
    password: "",
    role: "resident" as "admin" | "resident" | "staff",
    flat: "",
    building: "",
  });

  const [usernameTouched, setUsernameTouched] = useState(false);

  const usernameError = useMemo(() => {
    if (!usernameTouched || !form.username) return null;
    if (!USERNAME_REGEX.test(form.username)) return t("auth.usernameInvalid");
    if (isSignup && EXISTING_USERNAMES.includes(form.username.toLowerCase())) return t("auth.usernameExists");
    return null;
  }, [form.username, usernameTouched, isSignup, t]);

  const suggestedUsername = useMemo(() => {
    if (!isSignup || !form.name || !form.flat) return null;
    const base = form.name.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    const flat = form.flat.replace(/[^a-zA-Z0-9]/g, "");
    const suggestion = (base + flat).slice(0, 15);
    return suggestion.length >= 4 ? suggestion : null;
  }, [isSignup, form.name, form.flat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameError) return;

    if (rememberUsername) {
      localStorage.setItem("buildease-remember-username", form.username);
    } else {
      localStorage.removeItem("buildease-remember-username");
    }

    login({
      name: form.name || "User",
      username: form.username,
      email: form.email,
      phone: form.phone,
      role: form.role,
      flat: form.flat || "A-101",
      building: form.building || "Tower A",
    });
  };

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <div className="absolute right-4 top-4">
        <LanguageSelector />
      </div>

      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg">
          <Building2 className="text-primary-foreground" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{t("app.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("app.tagline")}</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {isSignup && (
          <>
            <input
              type="text"
              placeholder={t("auth.name")}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={inputClass}
            />
            <input
              type="tel"
              placeholder={t("auth.phone")}
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass}
            />
          </>
        )}

        {/* Username field */}
        <div className="space-y-1.5">
          <input
            type="text"
            placeholder={t("auth.usernamePlaceholder")}
            value={form.username}
            onChange={(e) => updateField("username", e.target.value)}
            onBlur={() => setUsernameTouched(true)}
            className={`${inputClass} ${usernameError ? "border-destructive ring-1 ring-destructive" : ""}`}
            required
            autoComplete="username"
          />
          {usernameError && (
            <p className="text-xs font-medium text-destructive px-1">{usernameError}</p>
          )}
          {isSignup && !usernameError && (
            <p className="text-xs text-muted-foreground px-1">
              {t("auth.usernameHelper")} · {t("auth.usernameRules")}
            </p>
          )}
          {isSignup && suggestedUsername && form.username !== suggestedUsername && !usernameError && (
            <button
              type="button"
              onClick={() => updateField("username", suggestedUsername)}
              className="text-xs text-primary font-medium px-1 hover:underline"
            >
              → {suggestedUsername}
            </button>
          )}
        </div>

        {/* Password field */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.password")}
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            className={`${inputClass} pr-12`}
            required
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Remember username toggle (login only) */}
        {!isSignup && (
          <label className="flex items-center gap-2 px-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberUsername}
              onChange={(e) => setRememberUsername(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary accent-primary"
            />
            <span className="text-xs text-muted-foreground">{t("auth.rememberUsername")}</span>
          </label>
        )}

        {isSignup && (
          <>
            <input
              type="email"
              placeholder={t("auth.email") + " (" + "optional" + ")"}
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
            />

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
                className={`flex-1 ${inputClass}`}
              />
              <input
                type="text"
                placeholder={t("auth.building")}
                value={form.building}
                onChange={(e) => updateField("building", e.target.value)}
                className={`flex-1 ${inputClass}`}
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
            onClick={() => { setIsSignup(!isSignup); setUsernameTouched(false); }}
            className="text-xs font-semibold text-primary"
          >
            {isSignup ? t("auth.login") : t("auth.createAccount")}
          </button>
        </div>
      </form>
    </div>
  );
};
