"use client";

import { TribeBadge } from "@/components/TribeBadge";
import { calculateAge, type Member } from "@/lib/types";

export function MemberTable({
  members,
  onEdit,
}: {
  members: Member[];
  onEdit: (m: Member) => void;
}) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-ink-muted border border-dashed border-border rounded-xl bg-surface">
        <svg className="w-10 h-10 mb-3 text-ink-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        <span className="text-sm">No members match these filters.</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-border rounded-xl bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-cream text-left text-xs uppercase tracking-wider text-ink-muted">
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Tribe</th>
            <th className="px-4 py-3 font-semibold">Age</th>
            <th className="px-4 py-3 font-semibold">School level</th>
            <th className="px-4 py-3 font-semibold">Unit of service</th>
            <th className="px-4 py-3 font-semibold">WhatsApp</th>
            <th className="px-4 py-3 font-semibold">Membership class</th>
            <th className="px-4 py-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr
              key={m.id}
              className="border-t border-border hover:bg-cream/50 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-ink">{m.full_name}</td>
              <td className="px-4 py-3">
                <TribeBadge tribe={m.tribe} />
              </td>
              <td className="px-4 py-3 text-ink-soft">{calculateAge(m.date_of_birth)}</td>
              <td className="px-4 py-3 text-ink-soft">{m.school_level}</td>
              <td className="px-4 py-3 text-ink-soft">{m.unit_of_service}</td>
              <td className="px-4 py-3 text-ink-soft font-mono text-xs">{m.whatsapp_number}</td>
              <td className="px-4 py-3">
                {m.completed_membership_class ? (
                  <span className="inline-flex items-center gap-1 text-emerald-jewel text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-jewel" />
                    Completed
                  </span>
                ) : (
                  <span className="text-ink-muted text-xs">Not yet</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(m)}
                  className="text-xs font-medium text-orange hover:text-orange-deep underline underline-offset-2 transition"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
