"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabaseClient";
import { useAdminSession } from "@/components/AuthGuard";
import { FiltersBar, type Filters } from "@/components/FiltersBar";
import { MemberTable } from "@/components/MemberTable";
import { BirthdayWidget } from "@/components/BirthdayWidget";
import { EditMemberModal } from "@/components/EditMemberModal";
import { calculateAge, ageGroupOf, type Member } from "@/lib/types";
import { useToast, Toast } from "@/components/Toast";

const initialFilters: Filters = {
  tribe: "All",
  ageGroup: "All",
  schoolLevel: "All",
  search: "",
};

export default function AdminDashboard() {
  const router = useRouter();
  const { profile, loading: sessionLoading } = useAdminSession();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [editing, setEditing] = useState<Member | null>(null);
  const { toast, show: showToast, clear: clearToast } = useToast();

  useEffect(() => {
    if (!profile) return;

    async function loadMembers() {
      setLoading(true);
      const { data } = await getSupabase()
        .from("members")
        .select("*")
        .order("full_name", { ascending: true });
      setMembers((data as Member[]) ?? []);
      setLoading(false);
    }
    loadMembers();
  }, [profile]);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (filters.tribe === "Unassigned" && m.tribe !== "Unassigned") return false;
      if (filters.tribe !== "All" && filters.tribe !== "Unassigned" && m.tribe !== filters.tribe) return false;
      if (filters.ageGroup !== "All" && ageGroupOf(calculateAge(m.date_of_birth)) !== filters.ageGroup) return false;
      if (filters.schoolLevel !== "All" && m.school_level !== filters.schoolLevel) return false;
      if (
        filters.search &&
        !m.full_name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !m.whatsapp_number.includes(filters.search)
      )
        return false;
      return true;
    });
  }, [members, filters]);

  const unassignedCount = members.filter((m) => m.tribe === "Unassigned").length;

  async function handleSignOut() {
    await getSupabase().auth.signOut();
    router.push("/admin/login");
  }

  if (sessionLoading || !profile) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex items-center gap-3 text-ink-muted">
          <span className="w-4 h-4 rounded-full border-2 border-border border-t-orange animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <p className="uppercase tracking-[0.2em] text-[10px] text-ink-muted">
              Danubreed Admin
            </p>
            <h1 className="font-display text-lg text-ink">
              {profile.role === "super_admin"
                ? "Super Admin"
                : `${profile.assigned_tribe} Tribe Leader`}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink/[0.04] text-sm text-ink-soft">
              <span className="w-2 h-2 rounded-full bg-emerald-jewel" />
              {profile.full_name}
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm px-4 py-2 rounded-xl border border-border hover:bg-surface hover:border-border-hover transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3 text-sm">
              <div className="px-4 py-2 rounded-xl bg-surface border border-border">
                <span className="text-ink-muted">Total: </span>
                <span className="font-semibold text-ink">{members.length}</span>
              </div>
              <button
                onClick={() => setFilters({ ...filters, tribe: "Unassigned" })}
                className="px-4 py-2 rounded-xl bg-surface border border-border hover:border-border-hover transition"
              >
                <span className="text-ink-muted">Unassigned: </span>
                <span className="font-semibold text-ink">{unassignedCount}</span>
              </button>
            </div>
            {(filters.tribe !== "All" ||
              filters.ageGroup !== "All" ||
              filters.schoolLevel !== "All" ||
              filters.search) && (
              <button
                onClick={() => setFilters(initialFilters)}
                className="text-xs text-ink-muted hover:text-ink underline underline-offset-2 transition"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="bg-surface border border-border rounded-xl p-4">
            <FiltersBar
              filters={filters}
              onChange={setFilters}
              showTribeFilter={profile.role === "super_admin"}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-ink-muted">
              <span className="w-4 h-4 rounded-full border-2 border-border border-t-orange animate-spin" />
              <span className="text-sm">Loading members…</span>
            </div>
          ) : (
            <MemberTable members={filtered} onEdit={setEditing} />
          )}
        </div>

        <div className="max-lg:order-first">
          <div className="bg-surface border border-border rounded-xl">
            <BirthdayWidget members={members} />
          </div>
        </div>
      </div>

      {editing && (
        <EditMemberModal
          member={editing}
          admin={profile}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
            setEditing(null);
            showToast("Member details saved");
          }}
          onDeleted={(id) => {
            setMembers((prev) => prev.filter((m) => m.id !== id));
            setEditing(null);
            showToast("Member removed");
          }}
        />
      )}

      {toast && <Toast toast={toast} onDone={clearToast} />}
    </main>
  );
}
