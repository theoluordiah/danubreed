"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-parchment flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="uppercase tracking-[0.3em] text-xs text-ink/50 mb-2 text-center">
          Danubreed
        </p>
        <h1 className="font-display text-3xl font-semibold mb-8 text-center text-ink">
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-ink/70">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 outline-none focus:border-ink/40 transition"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-ink/70">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 outline-none focus:border-ink/40 transition"
            />
          </div>

          {error && <p className="text-sm text-ruby-jewel">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-ink text-parchment font-medium hover:bg-ink-soft transition disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
