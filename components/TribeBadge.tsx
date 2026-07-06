import { TRIBE_COLORS, type Tribe } from "@/lib/types";

export function TribeBadge({ tribe }: { tribe: Tribe }) {
  const c = TRIBE_COLORS[tribe];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {tribe}
    </span>
  );
}
