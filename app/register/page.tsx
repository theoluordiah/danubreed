"use client";

import { useCallback, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";
import {
  TRIBES,
  SCHOOL_LEVELS,
  UNITS_OF_SERVICE,
  calculateAge,
  type Tribe,
  type SchoolLevel,
  type UnitOfService,
} from "@/lib/types";

const TRIBE_INFO: Record<string, { style: string; description: string; borderColor: string }> = {
  Amber: {
    style: "bg-amber-jewel text-white",
    description: "Wisdom & counsel",
    borderColor: "bg-amber-jewel",
  },
  Ruby: {
    style: "bg-ruby-jewel text-white",
    description: "Valour & service",
    borderColor: "bg-ruby-jewel",
  },
  Diamond: {
    style: "bg-diamond-jewel text-ink",
    description: "Purity & leadership",
    borderColor: "bg-diamond-jewel",
  },
  Emerald: {
    style: "bg-emerald-jewel text-white",
    description: "Growth & nurture",
    borderColor: "bg-emerald-jewel",
  },
};

type FormState = {
  full_name: string;
  tribe: Tribe | "";
  date_of_birth: string;
  unit_of_service: UnitOfService;
  school_level: SchoolLevel | "";
  whatsapp_number: string;
  completed_membership_class: "" | "yes" | "no";
};

const initialState: FormState = {
  full_name: "",
  tribe: "",
  date_of_birth: "",
  unit_of_service: "None",
  school_level: "",
  whatsapp_number: "",
  completed_membership_class: "",
};

type FieldErrors = Partial<Record<keyof FormState | "knowsTribe", string>>;

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [knowsTribe, setKnowsTribe] = useState<"yes" | "no" | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function markTouched(field: string) {
    setTouched((prev) => new Set(prev).add(field));
  }

  const validateField = useCallback(
    (field: string, f: FormState, kt: typeof knowsTribe): string | undefined => {
      switch (field) {
        case "full_name":
          return !f.full_name.trim() ? "Please enter your full name" : undefined;
        case "tribe":
          return kt === "yes" && !f.tribe ? "Please select your tribe" : undefined;
        case "date_of_birth":
          return !f.date_of_birth ? "Please enter your date of birth" : undefined;
        case "school_level":
          return !f.school_level ? "Please select your school level" : undefined;
        case "whatsapp_number":
          if (!f.whatsapp_number.trim()) return "Please enter your WhatsApp number";
          if (!/^\d{11,}$/.test(f.whatsapp_number.replace(/\s/g, "")))
            return "Enter at least 11 digits";
          return undefined;
        case "completed_membership_class":
          return !f.completed_membership_class
            ? "Please answer this question"
            : undefined;
        case "knowsTribe":
          return !kt ? "Please select an option" : undefined;
        default:
          return undefined;
      }
    },
    [],
  );

  const allErrors = useMemo(() => {
    const errs: FieldErrors = {};
    const fields: (keyof FormState | "knowsTribe")[] = [
      "full_name",
      "knowsTribe",
      "tribe",
      "date_of_birth",
      "school_level",
      "whatsapp_number",
      "completed_membership_class",
    ];
    for (const f of fields) {
      const msg =
        f === "knowsTribe"
          ? validateField(f, form, knowsTribe)
          : validateField(f, form, knowsTribe);
      if (msg) errs[f] = msg;
    }
    return errs;
  }, [form, knowsTribe, validateField]);

  function canSubmit(): boolean {
    return Object.keys(allErrors).length === 0;
  }

  function getError(field: keyof FieldErrors): string | null {
    return touched.has(field) ? (fieldErrors[field] ?? null) : null;
  }

  function handleBlur(field: keyof FieldErrors) {
    markTouched(field);
    const msg = validateField(field, form, knowsTribe);
    setFieldErrors((prev) => ({ ...prev, [field]: msg }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const allTouched = new Set(touched);
    const fields = [
      "full_name",
      "knowsTribe",
      "tribe",
      "date_of_birth",
      "school_level",
      "whatsapp_number",
      "completed_membership_class",
    ];
    for (const f of fields) allTouched.add(f);
    setTouched(allTouched);
    setFieldErrors(allErrors);

    if (!canSubmit()) return;

    setError(null);
    setSubmitting(true);

    const supabase = getSupabase();

    const { data: exists } = await supabase.rpc("check_member_exists", {
      p_full_name: form.full_name.trim(),
      p_date_of_birth: form.date_of_birth,
    });

    if (exists) {
      setError("A member with this name and date of birth is already registered.");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("members").insert({
      full_name: form.full_name.trim(),
      tribe: knowsTribe === "yes" ? form.tribe : "Unassigned",
      date_of_birth: form.date_of_birth,
      unit_of_service: form.unit_of_service,
      school_level: form.school_level,
      whatsapp_number: form.whatsapp_number.trim(),
      completed_membership_class: form.completed_membership_class === "yes",
    });

    setSubmitting(false);

    if (insertError) {
      if (insertError.code === "23505") {
        setError("This WhatsApp number is already registered.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      return;
    }

    setSuccess(true);
  }

  const age = form.date_of_birth ? calculateAge(form.date_of_birth) : null;

  if (success) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="max-w-md text-center fade-in">
          <div className="relative mx-auto mb-6 w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-jewel/15 animate-ping" style={{ animationDuration: "1.5s" }} />
            <div className="relative w-16 h-16 rounded-full bg-emerald-jewel/10 flex items-center justify-center text-emerald-jewel text-3xl">
              ✓
            </div>
          </div>
          <h1 className="font-display text-3xl mb-2 text-ink">You&apos;re registered</h1>
          <p className="text-ink-soft mb-6 leading-relaxed">
            Thanks, {form.full_name.split(" ")[0]} A tribe leader will reach out to you soon.
          </p>

          <div className="bg-surface border border-border rounded-2xl p-5 mb-8 text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Name</span>
              <span className="font-medium text-ink">{form.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Tribe</span>
              <span className="font-medium text-ink">{knowsTribe === "yes" ? form.tribe : "Not yet assigned"}</span>
            </div>
            {age !== null && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Age</span>
                <span className="font-medium text-ink">{age}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink-muted">School level</span>
              <span className="font-medium text-ink">{form.school_level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Unit of service</span>
              <span className="font-medium text-ink">{form.unit_of_service}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setForm(initialState);
              setKnowsTribe("");
              setTouched(new Set());
              setFieldErrors({});
              setSuccess(false);
            }}
            className="px-6 py-2.5 rounded-full border border-border text-ink-soft hover:text-ink hover:border-border-hover hover:bg-surface transition-all font-medium"
          >
            Register another person
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-16 flex flex-col items-center">
      <div className="w-full max-w-lg fade-in">
        <p className="uppercase tracking-[0.25em] text-xs text-ink-muted mb-2 text-center">
          Danubreed
        </p>
        <h1 className="font-display text-4xl font-semibold mb-1 text-center text-ink">
          Member Registration
        </h1>
        <p className="text-ink-soft text-center mb-10 leading-relaxed">
          Fill in your details below. It takes less than two minutes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ── Section 1: Personal Info ── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-orange" />
              <h2 className="font-display text-sm uppercase tracking-wider text-ink-muted">
                Personal Info
              </h2>
            </div>

            <div className="space-y-5 pl-4 border-l border-border">
              <FieldWrapper error={getError("full_name")}>
                <label className="block text-sm font-medium mb-1.5 text-ink-soft">
                  Full name
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  onBlur={() => handleBlur("full_name")}
                  placeholder="e.g. Ada Okafor"
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-ink outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 transition placeholder:text-ink-muted"
                />
              </FieldWrapper>

              <FieldWrapper error={getError("date_of_birth")}>
                <label className="block text-sm font-medium mb-1.5 text-ink-soft">
                  Date of birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => update("date_of_birth", e.target.value)}
                    onBlur={() => handleBlur("date_of_birth")}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-ink outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 transition"
                  />
                  {age !== null && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-muted pointer-events-none">
                      {age} years
                    </span>
                  )}
                </div>
              </FieldWrapper>

              <FieldWrapper error={getError("school_level")}>
                <label className="block text-sm font-medium mb-1.5 text-ink-soft">
                  School level
                </label>
                <select
                  value={form.school_level}
                  onChange={(e) => update("school_level", e.target.value as SchoolLevel)}
                  onBlur={() => handleBlur("school_level")}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-ink outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 transition"
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {SCHOOL_LEVELS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FieldWrapper>
            </div>
          </section>

          {/* ── Section 2: Tribe & Service ── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-diamond-jewel" />
              <h2 className="font-display text-sm uppercase tracking-wider text-ink-muted">
                Tribe &amp; Service
              </h2>
            </div>

            <div className="space-y-5 pl-4 border-l border-border">
              <FieldWrapper error={getError("knowsTribe")}>
                <label className="block text-sm font-medium mb-2 text-ink-soft">
                  Do you know your current tribe?
                </label>
                <div className="flex gap-3 mb-4">
                  {(["yes", "no"] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => {
                        setKnowsTribe(opt);
                        markTouched("knowsTribe");
                        const msg = validateField("knowsTribe", form, opt);
                        setFieldErrors((prev) => ({ ...prev, knowsTribe: msg }));
                        if (opt === "no") {
                          update("tribe", "");
                          markTouched("tribe");
                          setFieldErrors((prev) => ({ ...prev, tribe: undefined }));
                        }
                      }}
                      className={`px-5 py-2 rounded-full border text-sm capitalize transition-all ${
                        knowsTribe === opt
                          ? "bg-orange text-white border-orange"
                          : "bg-surface text-ink-soft border-border hover:border-border-hover hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {knowsTribe === "yes" && (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
                      {TRIBES.map((t, i) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => {
                            update("tribe", t);
                            markTouched("tribe");
                            setFieldErrors((prev) => ({ ...prev, tribe: undefined }));
                          }}
                          onBlur={() => handleBlur("tribe")}
                          className={`
                            relative flex flex-col items-center justify-center gap-0.5
                            h-28 rounded-xl pt-3 pb-3 px-2
                            border-2 transition-all duration-200
                            bg-surface/60
                            hover:bg-surface hover:scale-[1.03]
                            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange/60
                            ${form.tribe === t
                              ? "border-orange bg-surface scale-105 shadow-sm"
                              : "border-border"
                            }
                            fade-in
                          `}
                          style={{ animationDelay: `${i * 0.08}s` }}
                        >
                          <span className={`absolute top-0 left-3 right-3 h-1 rounded-full ${TRIBE_INFO[t].borderColor}`} />

                          {form.tribe === t && (
                            <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                              ✓
                            </span>
                          )}

                          <span className={`text-xs sm:text-sm font-semibold ${TRIBE_INFO[t].style}`}>
                            {t}
                          </span>

                          <span className="text-[10px] text-ink-muted leading-tight text-center px-0.5">
                            {TRIBE_INFO[t].description}
                          </span>
                        </button>
                      ))}
                    </div>
                    {getError("tribe") && (
                      <p className="text-xs text-ruby-jewel mt-1">{getError("tribe")}</p>
                    )}
                  </div>
                )}
                {knowsTribe === "no" && (
                  <p className="text-xs text-ink-muted leading-relaxed">
                    No problem — you&apos; will be assigned to a tribe soon.
                  </p>
                )}
              </FieldWrapper>

              <FieldWrapper error={getError("whatsapp_number")}>
                <label className="block text-sm font-medium mb-1.5 text-ink-soft">
                  WhatsApp number
                </label>
                <input
                  type="tel"
                  value={form.whatsapp_number}
                  onChange={(e) =>
                    update("whatsapp_number", e.target.value.replace(/\s/g, ""))
                  }
                  onBlur={() => handleBlur("whatsapp_number")}
                  placeholder="e.g. 08012345678"
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-ink outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 transition placeholder:text-ink-muted"
                />
                <p className="text-[11px] text-ink-muted mt-1">
                  Enter at least 11 digits (no spaces)
                </p>
              </FieldWrapper>

              <FieldWrapper>
                <label className="block text-sm font-medium mb-1.5 text-ink-soft">
                  Unit of service
                </label>
                <select
                  value={form.unit_of_service}
                  onChange={(e) => update("unit_of_service", e.target.value as UnitOfService)}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-ink outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 transition"
                >
                  {UNITS_OF_SERVICE.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </FieldWrapper>
            </div>
          </section>

          {/* ── Section 3: Membership ── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-jewel" />
              <h2 className="font-display text-sm uppercase tracking-wider text-ink-muted">
                Membership
              </h2>
            </div>

            <div className="space-y-5 pl-4 border-l border-border">
              <FieldWrapper error={getError("completed_membership_class")}>
                <label className="block text-sm font-medium mb-2 text-ink-soft">
                  Have you completed membership class?
                </label>
                <div className="flex gap-3">
                  {(["yes", "no"] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => {
                        update("completed_membership_class", opt);
                        markTouched("completed_membership_class");
                        setFieldErrors((prev) => ({
                          ...prev,
                          completed_membership_class: undefined,
                        }));
                      }}
                      onBlur={() => handleBlur("completed_membership_class")}
                      className={`px-5 py-2 rounded-full border text-sm capitalize transition-all ${
                        form.completed_membership_class === opt
                          ? "bg-orange text-white border-orange"
                          : "bg-surface text-ink-soft border-border hover:border-border-hover hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </FieldWrapper>
            </div>
          </section>

          {error && (
            <p className="text-sm text-ruby-jewel bg-ruby-jewel/10 border border-ruby-jewel/30 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-full bg-orange text-white font-semibold hover:bg-orange-deep hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-sm"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white/80 animate-spin" />
                Submitting…
              </span>
            ) : (
              "Complete registration"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

function FieldWrapper({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: string | null;
}) {
  return (
    <div>
      {children}
      {error && <p className="text-xs text-ruby-jewel mt-1">{error}</p>}
    </div>
  );
}
