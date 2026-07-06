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
      <div className="text-center py-16 text-ink/40 text-sm border border-dashed border-ink/15 rounded-xl">
        No members match these filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-ink/10 rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-ink/[0.03] text-left text-xs uppercase tracking-wide text-ink/50">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Tribe</th>
            <th className="px-4 py-3 font-medium">Age</th>
            <th className="px-4 py-3 font-medium">School level</th>
            <th className="px-4 py-3 font-medium">Unit of service</th>
            <th className="px-4 py-3 font-medium">WhatsApp</th>
            <th className="px-4 py-3 font-medium">Membership class</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-t border-ink/10 hover:bg-ink/[0.02]">
              <td className="px-4 py-3 font-medium text-ink">{m.full_name}</td>
              <td className="px-4 py-3">
                <TribeBadge tribe={m.tribe} />
              </td>
              <td className="px-4 py-3 text-ink/70">{calculateAge(m.date_of_birth)}</td>
              <td className="px-4 py-3 text-ink/70">{m.school_level}</td>
              <td className="px-4 py-3 text-ink/70">{m.unit_of_service}</td>
              <td className="px-4 py-3 text-ink/70">{m.whatsapp_number}</td>
              <td className="px-4 py-3">
                {m.completed_membership_class ? (
                  <span className="text-emerald-jewel text-xs font-medium">Completed</span>
                ) : (
                  <span className="text-ink/40 text-xs">Not yet</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(m)}
                  className="text-xs font-medium text-ink/60 hover:text-ink underline underline-offset-2"
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
