import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Package, Wallet, Star, Building2, Mail, Calendar, Save } from "lucide-react";
import { getUser, setUser, getProducts, getPayments } from "@/lib/storage";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — ArtisanAI" }, { name: "description", content: "Your studio profile, achievements, and settings." }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [user, setU] = useState(() => getUser());
  const [saved, setSaved] = useState(false);
  const products = getProducts();
  const payments = getPayments();

  function save() {
    setUser(user);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const stats = [
    { label: "Products", value: products.length, icon: Package, tint: "from-indigo-500 to-violet-500" },
    { label: "Payments", value: payments.length, icon: Wallet, tint: "from-emerald-500 to-teal-500" },
    { label: "Artisans", value: new Set(products.map((p) => p.artisan)).size, icon: Star, tint: "from-fuchsia-500 to-pink-500" },
  ];

  const achievements = [
    { title: "First sale", desc: "Recorded your first paid order", earned: true },
    { title: "10 products", desc: "Added 10+ products to production", earned: products.length >= 10 },
    { title: "Studio scaler", desc: "Worked with 5+ artisans", earned: new Set(products.map((p) => p.artisan)).size >= 5 },
    { title: "Premium seller", desc: "Crossed ₹1,00,000 revenue", earned: payments.reduce((s, p) => s + p.amount, 0) >= 100000 },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Cover */}
      <div className="relative h-44 rounded-3xl bg-gradient-hero overflow-hidden shadow-elegant">
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <div className="absolute -top-10 right-10 h-44 w-44 rounded-full bg-white/10 blur-3xl animate-blob" />
      </div>

      <div className="-mt-16 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="h-28 w-28 rounded-3xl bg-gradient-primary text-white grid place-items-center text-3xl font-bold shadow-elegant border-4 border-background">
          {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground flex items-center gap-1.5 mt-0.5"><Building2 className="h-4 w-4" /> {user.business}</p>
        </div>
        <div className="flex gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-card border px-4 py-3 shadow-card text-center min-w-24">
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Settings */}
        <div className="lg:col-span-2 rounded-2xl bg-card border p-6 shadow-card">
          <h3 className="font-semibold">Business information</h3>
          <p className="text-sm text-muted-foreground mb-5">Update how you appear across ArtisanAI.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name" icon={<Star className="h-4 w-4" />}>
              <input value={user.name} onChange={(e) => setU({ ...user, name: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Email" icon={<Mail className="h-4 w-4" />}>
              <input value={user.email} onChange={(e) => setU({ ...user, email: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Business name" icon={<Building2 className="h-4 w-4" />} className="sm:col-span-2">
              <input value={user.business} onChange={(e) => setU({ ...user, business: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Joined" icon={<Calendar className="h-4 w-4" />}>
              <input value={user.joined} disabled className={`${inputCls} opacity-60 cursor-not-allowed`} />
            </Field>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            {saved && <span className="text-sm text-emerald-600">Saved.</span>}
            <button onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow hover:shadow-glow transition">
              <Save className="h-4 w-4" /> Save changes
            </button>
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-2xl bg-card border p-6 shadow-card">
          <h3 className="font-semibold flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Achievements</h3>
          <p className="text-sm text-muted-foreground mb-4">Milestones you've unlocked.</p>
          <div className="space-y-3">
            {achievements.map((a) => (
              <div key={a.title} className={`flex items-start gap-3 rounded-xl border p-3 ${a.earned ? "" : "opacity-50"}`}>
                <div className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${a.earned ? "bg-gradient-primary text-white shadow" : "bg-muted text-muted-foreground"}`}>
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition";
function Field({ label, icon, children, className = "" }: { label: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-muted-foreground inline-flex items-center gap-1.5">{icon}{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
