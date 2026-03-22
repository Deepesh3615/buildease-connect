import { I18nProvider } from "@/lib/i18n";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { LoginScreen } from "@/components/LoginScreen";
import { AppShell } from "@/components/AppShell";

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppShell /> : <LoginScreen />;
};

const Index = () => (
  <I18nProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </I18nProvider>
);

export default Index;
