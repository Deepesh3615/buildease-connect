import React, { createContext, useContext, useState, useCallback } from "react";

export type Language = "en" | "hi" | "mr";

const translations: Record<string, Record<Language, string>> = {
  // Auth
  "app.title": { en: "BuildEase", hi: "BuildEase", mr: "BuildEase" },
  "app.tagline": { en: "Smart Building Management", hi: "स्मार्ट बिल्डिंग प्रबंधन", mr: "स्मार्ट बिल्डिंग व्यवस्थापन" },
  "auth.login": { en: "Log In", hi: "लॉग इन", mr: "लॉग इन" },
  "auth.signup": { en: "Sign Up", hi: "साइन अप", mr: "साइन अप" },
  "auth.email": { en: "Email", hi: "ईमेल", mr: "ईमेल" },
  "auth.password": { en: "Password", hi: "पासवर्ड", mr: "पासवर्ड" },
  "auth.forgotPassword": { en: "Forgot Password?", hi: "पासवर्ड भूल गए?", mr: "पासवर्ड विसरलात?" },
  "auth.createAccount": { en: "Create Account", hi: "अकाउंट बनाएं", mr: "अकाउंट तयार करा" },
  "auth.haveAccount": { en: "Already have an account?", hi: "पहले से अकाउंट है?", mr: "आधीच अकाउंट आहे?" },
  "auth.noAccount": { en: "Don't have an account?", hi: "अकाउंट नहीं है?", mr: "अकाउंट नाही?" },
  "auth.name": { en: "Full Name", hi: "पूरा नाम", mr: "पूर्ण नाव" },
  "auth.phone": { en: "Phone Number", hi: "फोन नंबर", mr: "फोन नंबर" },
  "auth.role": { en: "Select Role", hi: "भूमिका चुनें", mr: "भूमिका निवडा" },
  "auth.resident": { en: "Resident", hi: "निवासी", mr: "रहिवासी" },
  "auth.admin": { en: "Admin", hi: "एडमिन", mr: "ॲडमिन" },
  "auth.staff": { en: "Staff", hi: "कर्मचारी", mr: "कर्मचारी" },
  "auth.flat": { en: "Flat Number", hi: "फ्लैट नंबर", mr: "फ्लॅट नंबर" },
  "auth.building": { en: "Building", hi: "बिल्डिंग", mr: "इमारत" },

  // Nav
  "nav.home": { en: "Home", hi: "होम", mr: "होम" },
  "nav.residents": { en: "Residents", hi: "निवासी", mr: "रहिवासी" },
  "nav.requests": { en: "Requests", hi: "अनुरोध", mr: "विनंत्या" },
  "nav.payments": { en: "Payments", hi: "भुगतान", mr: "पेमेंट" },
  "nav.notices": { en: "Notices", hi: "सूचनाएं", mr: "सूचना" },
  "nav.profile": { en: "Profile", hi: "प्रोफाइल", mr: "प्रोफाइल" },

  // Dashboard
  "home.welcome": { en: "Hello", hi: "नमस्ते", mr: "नमस्कार" },
  "home.totalResidents": { en: "Total Residents", hi: "कुल निवासी", mr: "एकूण रहिवासी" },
  "home.pendingRequests": { en: "Pending Requests", hi: "लंबित अनुरोध", mr: "प्रलंबित विनंत्या" },
  "home.duePayments": { en: "Due Payments", hi: "बकाया भुगतान", mr: "बाकी पेमेंट" },
  "home.recentActivity": { en: "Recent Activity", hi: "हाल की गतिविधि", mr: "अलीकडील क्रिया" },
  "home.quickActions": { en: "Quick Actions", hi: "त्वरित कार्य", mr: "जलद कृती" },
  "home.addResident": { en: "Add Resident", hi: "निवासी जोड़ें", mr: "रहिवासी जोडा" },
  "home.raiseComplaint": { en: "Raise Complaint", hi: "शिकायत दर्ज करें", mr: "तक्रार नोंदवा" },
  "home.viewPayments": { en: "View Payments", hi: "भुगतान देखें", mr: "पेमेंट पहा" },

  // Residents
  "residents.title": { en: "Residents", hi: "निवासी", mr: "रहिवासी" },
  "residents.search": { en: "Search residents...", hi: "निवासी खोजें...", mr: "रहिवासी शोधा..." },
  "residents.addNew": { en: "Add New", hi: "नया जोड़ें", mr: "नवीन जोडा" },
  "residents.flat": { en: "Flat", hi: "फ्लैट", mr: "फ्लॅट" },

  // Requests
  "requests.title": { en: "Maintenance Requests", hi: "रखरखाव अनुरोध", mr: "देखभाल विनंत्या" },
  "requests.new": { en: "New Request", hi: "नया अनुरोध", mr: "नवीन विनंती" },
  "requests.pending": { en: "Pending", hi: "लंबित", mr: "प्रलंबित" },
  "requests.inProgress": { en: "In Progress", hi: "प्रगति में", mr: "प्रगतीत" },
  "requests.completed": { en: "Completed", hi: "पूर्ण", mr: "पूर्ण" },

  // Payments
  "payments.title": { en: "Payments", hi: "भुगतान", mr: "पेमेंट" },
  "payments.paid": { en: "Paid", hi: "भुगतान किया", mr: "भरलेले" },
  "payments.due": { en: "Due", hi: "बकाया", mr: "बाकी" },
  "payments.pay": { en: "Pay Now", hi: "अभी भुगतान करें", mr: "आता भरा" },
  "payments.receipt": { en: "View Receipt", hi: "रसीद देखें", mr: "पावती पहा" },

  // Notices
  "notices.title": { en: "Notices", hi: "सूचनाएं", mr: "सूचना" },
  "notices.important": { en: "Important", hi: "महत्वपूर्ण", mr: "महत्त्वाचे" },

  // Profile
  "profile.title": { en: "Profile", hi: "प्रोफाइल", mr: "प्रोफाइल" },
  "profile.settings": { en: "Settings", hi: "सेटिंग्स", mr: "सेटिंग्ज" },
  "profile.language": { en: "Language", hi: "भाषा", mr: "भाषा" },
  "profile.notifications": { en: "Notifications", hi: "सूचनाएं", mr: "सूचना" },
  "profile.logout": { en: "Logout", hi: "लॉग आउट", mr: "लॉग आउट" },

  // Chat
  "nav.chat": { en: "Chat", hi: "चैट", mr: "चॅट" },
  "chat.title": { en: "Community Chat", hi: "सामुदायिक चैट", mr: "समुदाय चॅट" },
  "chat.placeholder": { en: "Type a message...", hi: "संदेश लिखें...", mr: "संदेश टाइप करा..." },
  "chat.send": { en: "Send", hi: "भेजें", mr: "पाठवा" },
  "chat.pin": { en: "Pin Message", hi: "संदेश पिन करें", mr: "संदेश पिन करा" },

  // General
  "general.noData": { en: "No data yet", hi: "अभी कोई डेटा नहीं", mr: "अजून डेटा नाही" },
  "general.loading": { en: "Loading...", hi: "लोड हो रहा है...", mr: "लोड होत आहे..." },
};

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("buildease-lang");
    return (saved as Language) || "en";
  });

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("buildease-lang", lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[key]?.[language] || key;
    },
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
};

export const languageNames: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  mr: "मराठी",
};
