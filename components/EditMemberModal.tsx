"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  TRIBES,
  SCHOOL_LEVELS,
  UNITS_OF_SERVICE,
  type Member,
  type Tribe,
  type SchoolLevel,
  type UnitOfService,
  type AdminProfile,
} from "@/lib/types";

export function EditMemberModal({
  member,
  admin,
  onClose,
  onSaved,
  onDeleted,
}: {
  member: Member;
  admin: AdminProfile;
  onClose: () => void;
  onSaved: (m: Member) => void;
  onDeleted: (id: string) => void;
}) {
  const [form, setForm] = useState({
    full_name: member.full_name,
    tribe: member.tribe,
    date_of_birth: member.date_of_birth,
    unit_of_service: member.unit_of_service,
    school_level: member.school_level,
    whatsapp_number: member.whatsapp_number,
    completed_membership_class: member.completed_membership_class,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tribe leaders may only assign into their own tribe (enforced again by RLS server-side).
  const tribeOptions: Tribe[] =
    admin.role === "super_admin"
      ? [...TRIBES, "Unassigned"]
      : admin.assigned_tribe
      ? [admin.assigned_tribe, "Unassigned"]
      : ["Unassigned"];

  async function handleSave() {
    setSaving(true);
    setError(null);
    const { data, error: updateError } = await supabase
      .from("members")
      .update(form)
      .eq("id", member.id)
      .select()
      .single();

    setSaving(false);

    if (updateError) {
      setError(updateError.code === "23505" ? "That WhatsApp number is already in use." : "Could not save changes.");
      return;
    }

    onSaved(data as Member);
  }

  async function handleDelete() {
    if (!confirm(`Remove ${member.full_name} from the database? This cannot be undone.`)) return;
    setDeleting(true);
    const { error: deleteError } = await supabase.from("members").delete().eq("id", member.id);
    setDeleting(false);
    if (deleteError) {
      setError("Could not delete this record.");
      return;
    }
    onDeleted(member.id);
  }

  return (
    <div className="fixed inset-0 bg-ink/60 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ink">Edit member</h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs mb-1 text-ink/60">Full name</label>
            <input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-ink/40"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-ink/60">Tribe</label>
            <select
              value={form.tribe}
              onChange={(e) => setForm({ ...form, tribe: e.target.value as Tribe })}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-ink/40"
            >
              {tribeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1 text-ink/60">Date of birth</label>
            <input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-ink/40"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-ink/60">School level</label>
            <select
              value={form.school_level}
              onChange={(e) => setForm({ ...form, school_level: e.target.value as SchoolLevel })}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-ink/40"
            >
              {SCHOOL_LEVELS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1 text-ink/60">Unit of service</label>
            <select
              value={form.unit_of_service}
              onChange={(e) => setForm({ ...form, unit_of_service: e.target.value as UnitOfService })}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-ink/40"
            >
              {UNITS_OF_SERVICE.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1 text-ink/60">WhatsApp number</label>
            <input
              value={form.whatsapp_number}
              onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-ink/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="membership-class"
              type="checkbox"
              checked={form.completed_membership_class}
              onChange={(e) => setForm({ ...form, completed_membership_class: e.target.checked })}
            />
            <label htmlFor="membership-class" className="text-sm text-ink/70">
              Completed membership class
            </label>
          </div>

          {error && <p className="text-sm text-ruby-jewel">{error}</p>}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm text-ruby-jewel hover:underline disabled:opacity-50"
            >
              {deleting ? "Removing…" : "Remove member"}
            </button>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm border border-ink/15 hover:bg-ink/5">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm bg-ink text-parchment hover:bg-ink-soft disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
