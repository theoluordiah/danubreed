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
      <input
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        placeholder="Search by name or WhatsApp number"
        className="flex-1 min-w-[220px] rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-ink/40"
      />

      {showTribeFilter && (
        <select
          value={filters.tribe}
          onChange={(e) => onChange({ ...filters, tribe: e.target.value as Filters["tribe"] })}
          className="rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-ink/40"
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
        className="rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-ink/40"
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
        className="rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-ink/40"
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
