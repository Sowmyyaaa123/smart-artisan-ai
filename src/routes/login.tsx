import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight, Mail, Lock } from "lucide-react";
import { setAuth, getAuth } from "@/lib/storage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ArtisanAI" },
      { name: "description", content: "Sign in to ArtisanAI, the smart business assistant for handmade product businesses." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("demo@artisan.ai");
  const [password, setPassword] = useState("demo1234");
  const [remember, setRemember] = useState(true);

  useEffect(() => { if (getAuth()) nav({ to: "/" }); }, [nav]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setAuth(true);
    nav({ to: "/" });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left visual */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 bg-gradient-mesh opacity-70" />
        <div className="absolute top-20 -left-10 h-72 w-72 rounded-full bg-primary-glow/40 blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-blob animation-delay-2000" />

        <div className="relative flex items-center gap-2 text-lg font-semibold">
          <div className="grid place-items-center h-9 w-9 rounded-xl bg-white/15 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </div>
          ArtisanAI
        </div>

        <div className="relative space-y-6 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">
            Run your handmade<br />business like a studio.
          </h1>
          <p className="text-lg text-white/80">
            Track production, pay artisans, see what's selling — and get smart guidance from your built-in AI partner.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { k: "+38%", v: "Revenue lift" },
              { k: "12hr", v: "Saved weekly" },
              { k: "5★", v: "Artisan reviews" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur px-4 py-3">
                <div className="text-2xl font-semibold">{s.k}</div>
                <div className="text-xs text-white/70">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-sm text-white/60">
          "ArtisanAI helped us double our orders without losing the soul of our craft."
          <div className="mt-1 text-white/80">— Meera Iyer, Indigo Bloom Studio</div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={submit} className="w-full max-w-md animate-fade-in-up">
          <div className="lg:hidden flex items-center gap-2 text-lg font-semibold mb-8">
            <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            ArtisanAI
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground mt-2">Sign in to your studio dashboard.</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="mt-1.5 relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border bg-card pl-10 pr-3 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="mt-1.5 relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border bg-card pl-10 pr-3 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground select-none">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-input accent-[var(--primary)]" />
              Remember me for 30 days
            </label>
          </div>

          <button type="submit"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground py-3 text-sm font-semibold shadow-elegant hover:shadow-glow transition">
            Sign in <ArrowRight className="h-4 w-4" />
          </button>

          <div className="mt-6 rounded-xl border border-dashed bg-muted/40 p-4 text-xs text-muted-foreground">
            <div className="font-semibold text-foreground mb-1">Demo credentials</div>
            Email: <span className="font-mono">demo@artisan.ai</span><br />
            Password: <span className="font-mono">demo1234</span>
          </div>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            By signing in you agree to our <Link to="/" className="underline">Terms</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
