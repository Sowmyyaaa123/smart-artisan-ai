import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Package, Wallet, TrendingUp, Clock, ArrowUpRight, Plus, Bot, Sparkles,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from "recharts";
import { getProducts, getPayments } from "@/lib/storage";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — ArtisanAI" },
      { name: "description", content: "Studio overview, production stats, revenue, and recent activity." },
    ],
  }),
  component: Dashboard,
});

const revenueData = [
  { m: "Nov", r: 18400 }, { m: "Dec", r: 22100 }, { m: "Jan", r: 24800 },
  { m: "Feb", r: 27200 }, { m: "Mar", r: 31600 }, { m: "Apr", r: 36800 },
  { m: "May", r: 41200 },
];

const productionData = [
  { d: "Mon", units: 14 }, { d: "Tue", units: 22 }, { d: "Wed", units: 18 },
  { d: "Thu", units: 27 }, { d: "Fri", units: 31 }, { d: "Sat", units: 24 },
  { d: "Sun", units: 12 },
];

function Dashboard() {
  const products = getProducts();
  const payments = getPayments();

  const stats = useMemo(() => {
    const revenue = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
    const pending = products.filter((p) => p.status !== "Completed").length;
    return [
      { label: "Total products", value: products.length, delta: "+12%", icon: Package, tint: "from-indigo-500 to-violet-500" },
      { label: "Revenue (paid)", value: `₹${revenue.toLocaleString()}`, delta: "+24%", icon: TrendingUp, tint: "from-emerald-500 to-teal-500" },
      { label: "Total payments", value: payments.length, delta: "+8%", icon: Wallet, tint: "from-fuchsia-500 to-pink-500" },
      { label: "Pending orders", value: pending, delta: "-3%", icon: Clock, tint: "from-amber-500 to-orange-500" },
    ];
  }, [products, payments]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero text-white p-8 sm:p-10 shadow-elegant">
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Studio overview
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Good morning, Aarav.
            </h1>
            <p className="mt-2 text-white/80 max-w-xl">
              Your studio is up <span className="font-semibold text-white">+24%</span> in revenue this month. Three orders need attention.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/production"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-foreground px-4 py-2.5 text-sm font-semibold hover:bg-white/90 transition shadow">
              <Plus className="h-4 w-4" /> New product
            </Link>
            <Link to="/assistant"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 px-4 py-2.5 text-sm font-semibold hover:bg-white/20 transition">
              <Bot className="h-4 w-4" /> Ask the assistant
            </Link>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="group relative overflow-hidden rounded-2xl bg-card border p-5 shadow-card hover:shadow-elegant transition">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.tint} opacity-15 blur-2xl group-hover:opacity-25 transition`} />
            <div className="flex items-start justify-between">
              <div className={`grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br ${s.tint} text-white shadow-md`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-medium ${s.delta.startsWith("-") ? "text-destructive" : "text-emerald-600"}`}>
                {s.delta}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-card border p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Revenue trend</h3>
              <p className="text-sm text-muted-foreground">Last 7 months</p>
            </div>
            <div className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-700 font-medium">+24%</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={revenueData} margin={{ left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.6 0.22 290)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="oklch(0.6 0.22 290)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.92 0.01 270)" vertical={false} />
                <XAxis dataKey="m" axisLine={false} tickLine={false} fontSize={12} stroke="oklch(0.5 0.03 270)" />
                <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="oklch(0.5 0.03 270)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 270)" }} />
                <Area type="monotone" dataKey="r" stroke="oklch(0.5 0.22 285)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-card border p-6 shadow-card">
          <h3 className="font-semibold">Production this week</h3>
          <p className="text-sm text-muted-foreground mb-4">Units completed per day</p>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={productionData} margin={{ left: -20, right: 0 }}>
                <CartesianGrid stroke="oklch(0.92 0.01 270)" vertical={false} />
                <XAxis dataKey="d" axisLine={false} tickLine={false} fontSize={12} stroke="oklch(0.5 0.03 270)" />
                <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="oklch(0.5 0.03 270)" />
                <Tooltip cursor={{ fill: "oklch(0.96 0.02 285)" }} contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 270)" }} />
                <Bar dataKey="units" fill="oklch(0.55 0.2 285)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent + Quick actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-card border shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-6 pb-4">
            <h3 className="font-semibold">Recent production</h3>
            <Link to="/production" className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-muted/40 transition">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary-glow/20 grid place-items-center text-primary">
                  <Package className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.artisan} · qty {p.quantity}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-card border p-6 shadow-card">
          <h3 className="font-semibold">Quick actions</h3>
          <div className="mt-4 space-y-2">
            {[
              { to: "/production", label: "Add a product", icon: Package },
              { to: "/payments", label: "Record payment", icon: Wallet },
              { to: "/reports", label: "View reports", icon: TrendingUp },
              { to: "/assistant", label: "Get AI guidance", icon: Bot },
            ].map((a) => (
              <Link key={a.to} to={a.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border hover:border-primary/40 hover:bg-primary/5 transition group">
                <div className="h-9 w-9 rounded-lg bg-muted grid place-items-center group-hover:bg-primary/10 group-hover:text-primary transition">
                  <a.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{a.label}</span>
                <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Completed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    "In Progress": "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
    Pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    Paid: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    Overdue: "bg-rose-500/10 text-rose-700 border-rose-500/20",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${m[status] ?? "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}
