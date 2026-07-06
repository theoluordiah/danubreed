"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  TRIBES,
  SCHOOL_LEVELS,
  UNITS_OF_SERVICE,
  type Tribe,
  type SchoolLevel,
  type UnitOfService,
} from "@/lib/types";

const TRIBE_STYLES: Record<Tribe | "Unassigned", string> = {
  Amber: "bg-amber-jewel text-ink",
  Ruby: "bg-ruby-jewel text-parchment",
  Diamond: "bg-diamond-jewel text-ink",
  Emerald: "bg-emerald-jewel text-parchment",
  Unassigned: "bg-white/10 text-parchment",
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

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [knowsTribe, setKnowsTribe] = useState<"yes" | "no" | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): string | null {
    if (!form.full_name.trim()) return "Please enter your full name.";
    if (knowsTribe === "yes" && !form.tribe) return "Please select your tribe.";
    if (!form.date_of_birth) return "Please enter your date of birth.";
    if (!form.school_level) return "Please select your school level.";
    if (!form.whatsapp_number.trim()) return "Please enter your WhatsApp number.";
    if (!form.completed_membership_class) return "Please answer the membership class question.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);

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

  if (success) {
    return (
      <main className="min-h-screen bg-ink text-parchment flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-emerald-jewel/20 flex items-center justify-center text-emerald-jewel text-2xl">
            ✓
          </div>
          <h1 className="font-display text-3xl mb-3">You&apos;re registered</h1>
          <p className="text-parchment/60 mb-8">
            Thanks, {form.full_name.split(" ")[0]}. Your details have been saved.
            A tribe leader will be in touch on WhatsApp.
          </p>
          <button
            onClick={() => {
              setForm(initialState);
              setKnowsTribe("");
              setSuccess(false);
            }}
            className="px-6 py-2 rounded-full border border-parchment/30 hover:bg-white/5 transition"
          >
            Register another person
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink text-parchment px-6 py-16 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <p className="uppercase tracking-[0.3em] text-xs text-parchment/50 mb-2 text-center">
          Danubreed
        </p>
        <h1 className="font-display text-4xl font-semibold mb-2 text-center">
          Member Registration
        </h1>
        <p className="text-parchment/60 text-center mb-10">
          Fill in your details below. It takes less than two minutes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Full name */}
          <div>
            <label className="block text-sm mb-2 text-parchment/70">Full name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              placeholder="e.g. Ada Okafor"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-parchment/40 transition"
            />
          </div>

          {/* Tribe knowledge */}
          <div>
            <label className="block text-sm mb-2 text-parchment/70">
              Do you know your current tribe?
            </label>
            <div className="flex gap-3 mb-4">
              {(["yes", "no"] as const).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => {
                    setKnowsTribe(opt);
                    if (opt === "no") update("tribe", "");
                  }}
                  className={`px-5 py-2 rounded-full border text-sm capitalize transition ${
                    knowsTribe === opt
                      ? "bg-parchment text-ink border-parchment"
                      : "border-white/15 hover:bg-white/5"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {knowsTribe === "yes" && (
              <div className="grid grid-cols-4 gap-3">
                {TRIBES.map((t) => (
                  <button
                    type="button"
                    key={t}
                    data-selected={form.tribe === t}
                    onClick={() => update("tribe", t)}
                    className={`gem-chip h-20 flex items-center justify-center text-xs font-medium ${TRIBE_STYLES[t]}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
            {knowsTribe === "no" && (
              <p className="text-xs text-parchment/50">
                No problem — you&apos;ll be marked as <em>Unassigned</em> and a tribe leader will place you.
              </p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm mb-2 text-parchment/70">Date of birth</label>
            <input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => update("date_of_birth", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-parchment/40 transition [color-scheme:dark]"
            />
          </div>

          {/* School level */}
          <div>
            <label className="block text-sm mb-2 text-parchment/70">School level</label>
            <select
              value={form.school_level}
              onChange={(e) => update("school_level", e.target.value as SchoolLevel)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-parchment/40 transition"
            >
              <option value="" disabled className="text-ink">
                Select one
              </option>
              {SCHOOL_LEVELS.map((s) => (
                <option key={s} value={s} className="text-ink">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Unit of service */}
          <div>
            <label className="block text-sm mb-2 text-parchment/70">Unit of service</label>
            <select
              value={form.unit_of_service}
              onChange={(e) => update("unit_of_service", e.target.value as UnitOfService)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-parchment/40 transition"
            >
              {UNITS_OF_SERVICE.map((u) => (
                <option key={u} value={u} className="text-ink">
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm mb-2 text-parchment/70">WhatsApp number</label>
            <input
              type="tel"
              value={form.whatsapp_number}
              onChange={(e) => update("whatsapp_number", e.target.value)}
              placeholder="e.g. 08012345678"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-parchment/40 transition"
            />
          </div>

          {/* Membership class */}
          <div>
            <label className="block text-sm mb-2 text-parchment/70">
              Have you completed membership class?
            </label>
            <div className="flex gap-3">
              {(["yes", "no"] as const).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => update("completed_membership_class", opt)}
                  className={`px-5 py-2 rounded-full border text-sm capitalize transition ${
                    form.completed_membership_class === opt
                      ? "bg-parchment text-ink border-parchment"
                      : "border-white/15 hover:bg-white/5"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-ruby-jewel bg-ruby-jewel/10 border border-ruby-jewel/30 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full bg-parchment text-ink font-medium hover:bg-parchment-dim transition disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Complete registration"}
          </button>
        </form>
      </div>
    </main>
  );
}
