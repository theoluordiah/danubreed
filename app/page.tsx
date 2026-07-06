import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink text-parchment flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-jewel/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-diamond-jewel/10 blur-3xl" />

      <p className="uppercase tracking-[0.3em] text-xs text-parchment/50 mb-4">
        Membership Platform
      </p>
      <h1 className="font-display text-6xl md:text-7xl font-semibold mb-4 text-center">
        Danubreed
      </h1>
      <p className="text-parchment/60 max-w-md text-center mb-12">
        One home for every member — Amber, Ruby, Diamond, and Emerald — from
        first sign-up to Sunday follow-up.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/register"
          className="px-8 py-3 rounded-full bg-parchment text-ink font-medium hover:bg-parchment-dim transition"
        >
          Register a member
        </Link>
        <Link
          href="/admin/login"
          className="px-8 py-3 rounded-full border border-parchment/30 text-parchment font-medium hover:bg-white/5 transition"
        >
          Admin dashboard
        </Link>
      </div>
    </main>
  );
}
