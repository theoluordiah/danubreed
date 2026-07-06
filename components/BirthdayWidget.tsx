"use client";

import { daysUntilNextBirthday, type Member } from "@/lib/types";

function label(days: number) {
  if (days === 0) return "Today 🎉";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

export function BirthdayWidget({ members }: { members: Member[] }) {
  const upcoming = [...members]
    .map((m) => ({ m, days: daysUntilNextBirthday(m.date_of_birth) }))
    .filter(({ days }) => days <= 30)
    .sort((a, b) => a.days - b.days);

  return (
    <div className="border border-ink/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-ink">Upcoming birthdays</h3>
        <span className="text-xs text-ink/40">Next 30 days</span>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-sm text-ink/40">No birthdays in the next 30 days.</p>
      ) : (
        <ul className="space-y-3 max-h-80 overflow-y-auto">
          {upcoming.map(({ m, days }) => (
            <li key={m.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-ink">{m.full_name}</p>
                <p className="text-xs text-ink/50">{m.tribe}</p>
              </div>
              <div className="text-right">
                <p className="text-ink/70">{label(days)}</p>
                <a
                  href={`https://wa.me/${m.whatsapp_number.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-jewel hover:underline"
                >
                  Message on WhatsApp
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
