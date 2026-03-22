import { I18nProvider } from "@/lib/i18n";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { CriticalNoticeProvider } from "@/lib/critical-notice-context";
import { LoginScreen } from "@/components/LoginScreen";
import { AppShell } from "@/components/AppShell";
import { CriticalAlarmOverlay } from "@/components/CriticalAlarmOverlay";

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <CriticalNoticeProvider>
      <AppShell />
      <CriticalAlarmOverlay />
    </CriticalNoticeProvider>
  ) : (
    <LoginScreen />
  );
};

const Index = () => (
  <I18nProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </I18nProvider>
);

export default Index;
