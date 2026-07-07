export type Tribe = "Amber" | "Ruby" | "Diamond" | "Emerald" | "Unassigned";

export type SchoolLevel =
  | "In Secondary School"
  | "Finished Secondary School"
  | "In University"
  | "Finished University";

export type UnitOfService =
  | "None"
  | "Ushering"
  | "Drama"
  | "Greeters"
  | "Choir"
  | "Free Spirit Media"
  | "Fierce"
  | "Dance team"
  | "Integrative"
  | "Service Draft";

export type AdminRole = "super_admin" | "tribe_leader";

export interface Member {
  id: string;
  full_name: string;
  tribe: Tribe;
  date_of_birth: string; // ISO date
  unit_of_service: UnitOfService;
  school_level: SchoolLevel;
  whatsapp_number: string;
  completed_membership_class: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  full_name: string;
  role: AdminRole;
  assigned_tribe: Tribe | null;
}

export const TRIBES: Tribe[] = ["Amber", "Ruby", "Diamond", "Emerald"];

export const SCHOOL_LEVELS: SchoolLevel[] = [
  "In Secondary School",
  "Finished Secondary School",
  "In University",
  "Finished University",
];

export const UNITS_OF_SERVICE: UnitOfService[] = [
  "None",
  "Ushering",
  "Drama",
  "Greeters",
  "Choir",
  "Free Spirit Media",
  "Fierce",
  "Dance team",
  "Integrative",
  "Service Draft",
];

export function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function daysUntilNextBirthday(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) {
    next = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  return Math.round((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function ageGroupOf(age: number): string {
  if (age <= 12) return "0–12";
  if (age <= 17) return "13–17";
  if (age <= 25) return "18–25";
  if (age <= 35) return "26–35";
  return "36+";
}

export const AGE_GROUPS = ["0–12", "13–17", "18–25", "26–35", "36+"];

export const TRIBE_COLORS: Record<Tribe, { bg: string; text: string; ring: string }> = {
  Amber: { bg: "bg-amber-100", text: "text-amber-800", ring: "ring-amber-400" },
  Ruby: { bg: "bg-rose-100", text: "text-rose-800", ring: "ring-rose-400" },
  Diamond: { bg: "bg-cyan-100", text: "text-cyan-800", ring: "ring-cyan-400" },
  Emerald: { bg: "bg-emerald-100", text: "text-emerald-800", ring: "ring-emerald-400" },
  Unassigned: { bg: "bg-neutral-200", text: "text-neutral-700", ring: "ring-neutral-400" },
};
