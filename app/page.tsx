import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div
        className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full bg-orange/10 blur-3xl animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-diamond-jewel/10 blur-3xl animate-pulse"
        style={{ animationDuration: "10s", animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-jewel/5 blur-3xl animate-pulse"
        style={{ animationDuration: "12s", animationDelay: "4s" }}
      />

      <div className="relative slide-up text-center max-w-lg w-full">
        <div className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-3xl px-10 py-14 shadow-xl">
          <h1 className="font-display text-5xl md:text-7xl font-semibold mb-5 leading-[1.05]">
            Welcome to
            <br />
            <span className="text-orange">Danubreed</span>
          </h1>

          <p className="text-orange-deep font-medium mb-3 italic">
            &ldquo;Let no man despise thy youth.&rdquo; — 1 Timothy 4:12
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-block px-8 py-3 rounded-full bg-orange text-white font-medium hover:bg-orange-deep hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
            >
              Member Registration
            </Link>
            {/* <a
              href="https://mount-up-camp.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-full border-2 border-orange text-orange font-medium hover:bg-orange hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
            >
              Camp Registration
            </a> */}
          </div>
        </div>
      </div>
    </main>
  );
}
