import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

export type NoticeType = "normal" | "critical";

export type CriticalNotice = {
  id: string;
  title: string;
  titleHi: string;
  titleMr: string;
  message: string;
  messageHi: string;
  messageMr: string;
  type: NoticeType;
  createdAt: Date;
  createdBy: string;
  repeatUntilAcknowledged: boolean;
};

export type AlarmSettings = {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
};

type AcknowledgedMap = Record<string, boolean>;
type SnoozedMap = Record<string, number>; // notice id -> snooze end timestamp

type CriticalNoticeContextType = {
  criticalNotices: CriticalNotice[];
  addCriticalNotice: (notice: CriticalNotice) => void;
  activeAlarm: CriticalNotice | null;
  acknowledgeNotice: (id: string) => void;
  snoozeNotice: (id: string, minutes: number) => void;
  alarmSettings: AlarmSettings;
  setAlarmSettings: (settings: AlarmSettings) => void;
  unacknowledgedCount: number;
};

const CriticalNoticeContext = createContext<CriticalNoticeContextType | undefined>(undefined);

const ALARM_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

// Generate a simple alarm sound using Web Audio API
function playAlarmSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + duration);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };
    // Urgent 3-tone pattern
    playTone(880, 0, 0.2);
    playTone(1100, 0.25, 0.2);
    playTone(880, 0.5, 0.2);
    playTone(1100, 0.75, 0.2);
    playTone(880, 1.0, 0.3);
  } catch {
    // Audio not supported
  }
}

function triggerVibration() {
  try {
    if (navigator.vibrate) {
      navigator.vibrate([300, 100, 300, 100, 500]);
    }
  } catch {
    // Vibration not supported
  }
}

const defaultNotices: CriticalNotice[] = [
  {
    id: "crit-1",
    title: "Gas Leak Detected – Tower A",
    titleHi: "गैस रिसाव – टावर A",
    titleMr: "गॅस गळती – टॉवर A",
    message: "A gas leak has been detected on the 3rd floor of Tower A. Please evacuate immediately and assemble at the main gate. Do NOT use elevators.",
    messageHi: "टावर A की तीसरी मंजिल पर गैस रिसाव का पता चला है। कृपया तुरंत खाली करें और मुख्य गेट पर इकट्ठा हों। लिफ्ट का उपयोग न करें।",
    messageMr: "टॉवर A च्या तिसऱ्या मजल्यावर गॅस गळती आढळली आहे. कृपया तात्काळ बाहेर पडा आणि मुख्य गेटवर जमा व्हा. लिफ्ट वापरू नका.",
    type: "critical",
    createdAt: new Date(),
    createdBy: "Priya Sharma (Admin)",
    repeatUntilAcknowledged: true,
  },
];

export const CriticalNoticeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [criticalNotices, setCriticalNotices] = useState<CriticalNotice[]>(defaultNotices);
  const [acknowledged, setAcknowledged] = useState<AcknowledgedMap>(() => {
    const saved = localStorage.getItem("buildease-ack-notices");
    return saved ? JSON.parse(saved) : {};
  });
  const [snoozed, setSnoozed] = useState<SnoozedMap>(() => {
    const saved = localStorage.getItem("buildease-snoozed-notices");
    return saved ? JSON.parse(saved) : {};
  });
  const [alarmSettings, setAlarmSettingsState] = useState<AlarmSettings>(() => {
    const saved = localStorage.getItem("buildease-alarm-settings");
    return saved ? JSON.parse(saved) : { soundEnabled: true, vibrationEnabled: true };
  });
  const [activeAlarm, setActiveAlarm] = useState<CriticalNotice | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setAlarmSettings = useCallback((settings: AlarmSettings) => {
    setAlarmSettingsState(settings);
    localStorage.setItem("buildease-alarm-settings", JSON.stringify(settings));
  }, []);

  // Find unacknowledged, non-snoozed critical notices
  const getActiveNotice = useCallback((): CriticalNotice | null => {
    const now = Date.now();
    for (const notice of criticalNotices) {
      if (notice.type !== "critical") continue;
      if (acknowledged[notice.id]) continue;
      const snoozeEnd = snoozed[notice.id];
      if (snoozeEnd && now < snoozeEnd) continue;
      return notice;
    }
    return null;
  }, [criticalNotices, acknowledged, snoozed]);

  const unacknowledgedCount = criticalNotices.filter(
    (n) => n.type === "critical" && !acknowledged[n.id]
  ).length;

  // Check for alarms
  const checkAlarm = useCallback(() => {
    const notice = getActiveNotice();
    if (notice) {
      setActiveAlarm(notice);
      if (alarmSettings.soundEnabled) playAlarmSound();
      if (alarmSettings.vibrationEnabled) triggerVibration();
    } else {
      setActiveAlarm(null);
    }
  }, [getActiveNotice, alarmSettings]);

  // Initial check + periodic re-check
  useEffect(() => {
    checkAlarm();
    intervalRef.current = setInterval(checkAlarm, ALARM_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkAlarm]);

  // Re-check when snooze expires
  useEffect(() => {
    const now = Date.now();
    const timers: ReturnType<typeof setTimeout>[] = [];
    Object.entries(snoozed).forEach(([id, end]) => {
      if (end > now) {
        timers.push(setTimeout(checkAlarm, end - now + 100));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [snoozed, checkAlarm]);

  const acknowledgeNotice = useCallback((id: string) => {
    const updated = { ...acknowledged, [id]: true };
    setAcknowledged(updated);
    localStorage.setItem("buildease-ack-notices", JSON.stringify(updated));
    setActiveAlarm(null);
    // Immediately check for next alarm
    setTimeout(() => {
      const notice = criticalNotices.find(
        (n) => n.type === "critical" && !updated[n.id] && !(snoozed[n.id] && Date.now() < snoozed[n.id])
      );
      setActiveAlarm(notice || null);
    }, 500);
  }, [acknowledged, criticalNotices, snoozed]);

  const snoozeNotice = useCallback((id: string, minutes: number) => {
    const end = Date.now() + minutes * 60 * 1000;
    const updated = { ...snoozed, [id]: end };
    setSnoozed(updated);
    localStorage.setItem("buildease-snoozed-notices", JSON.stringify(updated));
    setActiveAlarm(null);
  }, [snoozed]);

  const addCriticalNotice = useCallback((notice: CriticalNotice) => {
    setCriticalNotices((prev) => [notice, ...prev]);
    if (notice.type === "critical") {
      setTimeout(checkAlarm, 100);
    }
  }, [checkAlarm]);

  return (
    <CriticalNoticeContext.Provider
      value={{
        criticalNotices,
        addCriticalNotice,
        activeAlarm,
        acknowledgeNotice,
        snoozeNotice,
        alarmSettings,
        setAlarmSettings,
        unacknowledgedCount,
      }}
    >
      {children}
    </CriticalNoticeContext.Provider>
  );
};

export const useCriticalNotice = () => {
  const ctx = useContext(CriticalNoticeContext);
  if (!ctx) throw new Error("useCriticalNotice must be used within CriticalNoticeProvider");
  return ctx;
};
