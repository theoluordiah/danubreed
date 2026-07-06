"use client";

import { TRIBES, AGE_GROUPS, SCHOOL_LEVELS, type Tribe, type SchoolLevel } from "@/lib/types";

export type Filters = {
  tribe: Tribe | "All" | "Unassigned";
  ageGroup: string | "All";
  schoolLevel: SchoolLevel | "All";
  search: string;
};

export function FiltersBar({
  filters,
  onChange,
  showTribeFilter,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  showTribeFilter: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[220px]">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
        </svg>
        <input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by name or WhatsApp number"
          className="w-full rounded-xl border border-border bg-cream/50 px-3 py-2 pl-10 text-sm text-ink outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 focus:bg-surface transition placeholder:text-ink-muted"
        />
      </div>

      {showTribeFilter && (
        <select
          value={filters.tribe}
          onChange={(e) => onChange({ ...filters, tribe: e.target.value as Filters["tribe"] })}
          className="rounded-xl border border-border bg-cream/50 px-3 py-2 text-sm text-ink outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 focus:bg-surface transition"
        >
          <option value="All">All tribes</option>
          {TRIBES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
          <option value="Unassigned">Unassigned only</option>
        </select>
      )}

      <select
        value={filters.ageGroup}
        onChange={(e) => onChange({ ...filters, ageGroup: e.target.value })}
        className="rounded-xl border border-border bg-cream/50 px-3 py-2 text-sm text-ink outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 focus:bg-surface transition"
      >
        <option value="All">All ages</option>
        {AGE_GROUPS.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <select
        value={filters.schoolLevel}
        onChange={(e) => onChange({ ...filters, schoolLevel: e.target.value as Filters["schoolLevel"] })}
        className="rounded-xl border border-border bg-cream/50 px-3 py-2 text-sm text-ink outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 focus:bg-surface transition"
      >
        <option value="All">All school levels</option>
        {SCHOOL_LEVELS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
