import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { Search, Phone, Plus } from "lucide-react";

const mockResidents = [
  { id: 1, name: "Rajesh Sharma", flat: "A-101", phone: "98765 43210", building: "Tower A" },
  { id: 2, name: "Priya Patil", flat: "B-205", phone: "98765 12345", building: "Tower B" },
  { id: 3, name: "Amit Kulkarni", flat: "A-302", phone: "91234 56789", building: "Tower A" },
  { id: 4, name: "Sneha Deshmukh", flat: "C-104", phone: "99876 54321", building: "Tower C" },
  { id: 5, name: "Vikram Joshi", flat: "B-401", phone: "90123 45678", building: "Tower B" },
];

export const ResidentsPage: React.FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const filtered = mockResidents.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.flat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder={t("residents.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Add button (admin) */}
      {user?.role === "admin" && (
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-[0.98]">
          <Plus size={16} />
          {t("residents.addNew")}
        </button>
      )}

      {/* List */}
      <div className="space-y-2">
        {filtered.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-2xl bg-card p-4 card-shadow transition-shadow hover:card-shadow-hover">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                {r.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t("residents.flat")} {r.flat} · {r.building}
                </p>
              </div>
            </div>
            <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10 text-success transition-colors hover:bg-success/20 active:scale-[0.95]">
              <Phone size={16} />
            </a>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">{t("general.noData")}</div>
        )}
      </div>
    </div>
  );
};
