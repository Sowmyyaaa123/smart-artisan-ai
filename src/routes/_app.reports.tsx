import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from "recharts";
import { TrendingUp, Package, Wallet, Users } from "lucide-react";
import { getProducts, getPayments } from "@/lib/storage";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — ArtisanAI" }, { name: "description", content: "Production, revenue, and artisan performance analytics." }] }),
  component: ReportsPage,
});

const weekly = [
  { d: "W1", units: 62, rev: 21400 }, { d: "W2", units: 78, rev: 26800 },
  { d: "W3", units: 84, rev: 31200 }, { d: "W4", units: 96, rev: 36400 },
  { d: "W5", units: 88, rev: 33800 }, { d: "W6", units: 104, rev: 41200 },
];

const COLORS = ["oklch(0.55 0.2 285)", "oklch(0.7 0.18 200)", "oklch(0.75 0.16 65)", "oklch(0.7 0.18 320)"];

function ReportsPage() {
  const products = getProducts();
  const payments = getPayments();

  const methodData = useMemo(() => {
    const counts: Record<string, number> = {};
    payments.forEach((p) => { counts[p.method] = (counts[p.method] || 0) + p.amount; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [payments]);

  const artisanPerf = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => { map[p.artisan] = (map[p.artisan] || 0) + p.quantity; });
    return Object.entries(map).map(([artisan, units]) => ({ artisan, units }));
  }, [products]);

  const summary = [
    { label: "Total revenue", value: `₹${payments.reduce((s, p) => s + p.amount, 0).toLocaleString()}`, icon: TrendingUp, tint: "from-emerald-500 to-teal-500" },
    { label: "Units produced", value: products.reduce((s, p) => s + p.quantity, 0), icon: Package, tint: "from-indigo-500 to-violet-500" },
    { label: "Active artisans", value: new Set(products.map((p) => p.artisan)).size, icon: Users, tint: "from-fuchsia-500 to-pink-500" },
    { label: "Avg ticket", value: `₹${Math.round(payments.reduce((s, p) => s + p.amount, 0) / Math.max(payments.length, 1)).toLocaleString()}`, icon: Wallet, tint: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & analytics</h1>
        <p className="text-muted-foreground mt-1">A studio-level view of your business performance.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border p-5 shadow-card">
            <div className={`grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br ${s.tint} text-white shadow-md`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 text-2xl font-bold tracking-tight">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-card border p-6 shadow-card">
          <h3 className="font-semibold">Weekly production & revenue</h3>
          <p className="text-sm text-muted-foreground mb-4">Units shipped vs revenue over 6 weeks</p>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={weekly} margin={{ left: -10, right: 10 }}>
                <CartesianGrid stroke="oklch(0.92 0.01 270)" vertical={false} />
                <XAxis dataKey="d" axisLine={false} tickLine={false} fontSize={12} stroke="oklch(0.5 0.03 270)" />
                <YAxis yAxisId="L" axisLine={false} tickLine={false} fontSize={12} stroke="oklch(0.5 0.03 270)" />
                <YAxis yAxisId="R" orientation="right" axisLine={false} tickLine={false} fontSize={12} stroke="oklch(0.5 0.03 270)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 270)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="L" type="monotone" dataKey="units" stroke="oklch(0.55 0.2 285)" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line yAxisId="R" type="monotone" dataKey="rev" stroke="oklch(0.65 0.18 200)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-card border p-6 shadow-card">
          <h3 className="font-semibold">Payment methods</h3>
          <p className="text-sm text-muted-foreground mb-4">Share of total spend</p>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={methodData} innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                  {methodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 270)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card border p-6 shadow-card">
        <h3 className="font-semibold">Artisan performance</h3>
        <p className="text-sm text-muted-foreground mb-4">Total units produced per artisan</p>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={artisanPerf} margin={{ left: -10, right: 10 }}>
              <CartesianGrid stroke="oklch(0.92 0.01 270)" vertical={false} />
              <XAxis dataKey="artisan" axisLine={false} tickLine={false} fontSize={12} stroke="oklch(0.5 0.03 270)" />
              <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="oklch(0.5 0.03 270)" />
              <Tooltip cursor={{ fill: "oklch(0.96 0.02 285)" }} contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 270)" }} />
              <Bar dataKey="units" fill="oklch(0.55 0.2 285)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
