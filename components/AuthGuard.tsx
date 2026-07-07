"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabaseClient";
import type { AdminProfile } from "@/lib/types";

export function useAdminSession() {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { session },
      } = await getSupabase().auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await getSupabase()
        .from("admins")
        .select("id, full_name, role, assigned_tribe")
        .eq("id", session.user.id)
        .single();

      if (!active) return;

      if (error || !data) {
        // Authenticated with Supabase, but not registered as an admin.
        await getSupabase().auth.signOut();
        router.replace("/admin/login");
        return;
      }

      setProfile(data as AdminProfile);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [router]);

  return { profile, loading };
}
