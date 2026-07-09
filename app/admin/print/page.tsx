"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabaseClient";
import { useAdminSession } from "@/components/AuthGuard";
import { calculateAge, type Member } from "@/lib/types";

export default function PrintPage() {
  const router = useRouter();
  const { profile, loading: sessionLoading } = useAdminSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const generatedAt = useMemo(() => {
    const now = new Date();
    return (
      now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " at " +
      now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  }, []);

  useEffect(() => {
    if (!profile) return;

    async function loadMembers() {
      const { data } = await getSupabase()
        .from("members")
        .select("*")
        .order("full_name", { ascending: true });
      setMembers((data as Member[]) ?? []);
      setLoading(false);
    }
    loadMembers();
  }, [profile]);

  useEffect(() => {
    if (!loading && !sessionLoading) {
      const timer = setTimeout(() => window.print(), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, sessionLoading]);

  if (sessionLoading || !profile) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <style>{`
        @media print {
          @page { margin: 0.75in; }
          body { font-family: system-ui, sans-serif; }
          .no-print { display: none !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Danubreed — Member Registration Data
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Report generated: {generatedAt}
          </p>
        </div>

        <hr className="mb-6 border-gray-300" />

        {loading && (
          <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
            <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
            <span className="text-sm">Loading member data…</span>
          </div>
        )}

        {!loading && (
          <>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-400">
                  <th className="py-2.5 px-3 text-left font-bold text-gray-900 text-xs uppercase tracking-wider">Name</th>
                  <th className="py-2.5 px-3 text-left font-bold text-gray-900 text-xs uppercase tracking-wider">Tribe</th>
                  <th className="py-2.5 px-3 text-left font-bold text-gray-900 text-xs uppercase tracking-wider">Age</th>
                  <th className="py-2.5 px-3 text-left font-bold text-gray-900 text-xs uppercase tracking-wider">School level</th>
                  <th className="py-2.5 px-3 text-left font-bold text-gray-900 text-xs uppercase tracking-wider">Unit of service</th>
                  <th className="py-2.5 px-3 text-left font-bold text-gray-900 text-xs uppercase tracking-wider">WhatsApp</th>
                  <th className="py-2.5 px-3 text-left font-bold text-gray-900 text-xs uppercase tracking-wider">Membership class</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => (
                  <tr key={m.id} className={i < members.length - 1 ? "border-b border-gray-200" : ""}>
                    <td className="py-2.5 px-3 text-gray-900">{m.full_name}</td>
                    <td className="py-2.5 px-3 text-gray-700">{m.tribe}</td>
                    <td className="py-2.5 px-3 text-gray-700">{calculateAge(m.date_of_birth)}</td>
                    <td className="py-2.5 px-3 text-gray-700">{m.school_level}</td>
                    <td className="py-2.5 px-3 text-gray-700">{m.unit_of_service}</td>
                    <td className="py-2.5 px-3 text-gray-700 font-mono">{m.whatsapp_number}</td>
                    <td className="py-2.5 px-3 text-gray-700">
                      {m.completed_membership_class ? "Completed" : "Not yet"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-xs text-gray-400 mt-6 text-center">
              Total members: {members.length}
            </p>
          </>
        )}

        <div className="no-print text-center mt-8">
          <button
            onClick={() => router.push("/admin")}
            className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
