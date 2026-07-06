"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAdminSession } from "@/components/AuthGuard";
import { FiltersBar, type Filters } from "@/components/FiltersBar";
import { MemberTable } from "@/components/MemberTable";
import { BirthdayWidget } from "@/components/BirthdayWidget";
import { EditMemberModal } from "@/components/EditMemberModal";
import { calculateAge, ageGroupOf, type Member } from "@/lib/types";

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

  useEffect(() => {
    if (!profile) return;

    async function loadMembers() {
      setLoading(true);
      const { data } = await supabase
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
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (sessionLoading || !profile) {
    return (
      <main className="min-h-screen bg-parchment flex items-center justify-center text-ink/50 text-sm">
        Loading…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-parchment">
      <header className="border-b border-ink/10 px-6 py-4 flex items-center justify-between bg-white">
        <div>
          <p className="uppercase tracking-[0.2em] text-[10px] text-ink/40">Danubreed Admin</p>
          <h1 className="font-display text-xl text-ink">
            {profile.role === "super_admin" ? "Super Admin" : `${profile.assigned_tribe} Tribe Leader`}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink/60">{profile.full_name}</span>
          <button
            onClick={handleSignOut}
            className="text-sm px-4 py-2 rounded-lg border border-ink/15 hover:bg-ink/5"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex gap-4 text-sm">
              <div className="px-4 py-2 rounded-lg bg-white border border-ink/10">
                <span className="text-ink/40">Total: </span>
                <span className="font-medium text-ink">{members.length}</span>
              </div>
              <button
                onClick={() => setFilters({ ...filters, tribe: "Unassigned" })}
                className="px-4 py-2 rounded-lg bg-white border border-ink/10 hover:border-ink/30 transition"
              >
                <span className="text-ink/40">Unassigned: </span>
                <span className="font-medium text-ink">{unassignedCount}</span>
              </button>
            </div>
            {(filters.tribe !== "All" || filters.ageGroup !== "All" || filters.schoolLevel !== "All" || filters.search) && (
              <button
                onClick={() => setFilters(initialFilters)}
                className="text-xs text-ink/50 hover:text-ink underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="bg-white border border-ink/10 rounded-xl p-4 mb-4">
            <FiltersBar
              filters={filters}
              onChange={setFilters}
              showTribeFilter={profile.role === "super_admin"}
            />
          </div>

          {loading ? (
            <div className="text-center py-16 text-ink/40 text-sm">Loading members…</div>
          ) : (
            <MemberTable members={filtered} onEdit={setEditing} />
          )}
        </div>

        <div className="bg-white">
          <BirthdayWidget members={members} />
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
          }}
          onDeleted={(id) => {
            setMembers((prev) => prev.filter((m) => m.id !== id));
            setEditing(null);
          }}
        />
      )}
    </main>
  );
}
