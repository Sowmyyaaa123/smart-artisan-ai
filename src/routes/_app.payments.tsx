import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X, Wallet, TrendingUp, CircleDollarSign, Clock } from "lucide-react";
import { getPayments, setPayments, type Payment, uid } from "@/lib/storage";
import { StatusBadge } from "./_app.index";

export const Route = createFileRoute("/_app/payments")({
  head: () => ({ meta: [{ title: "Payments — ArtisanAI" }, { name: "description", content: "Track artisan payments, methods, and statuses." }] }),
  component: PaymentsPage,
});

const empty: Omit<Payment, "id"> = {
  artisan: "", amount: 0, date: new Date().toISOString().slice(0, 10),
  method: "UPI", status: "Pending",
};

function PaymentsPage() {
  const [items, setItems] = useState<Payment[]>(() => getPayments());
  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);
  const [form, setForm] = useState<Omit<Payment, "id">>(empty);

  const filtered = useMemo(
    () => (filter === "All" ? items : items.filter((p) => p.status === filter)),
    [items, filter],
  );

  const totals = useMemo(() => {
    const paid = items.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
    const pending = items.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
    const overdue = items.filter((p) => p.status === "Overdue").reduce((s, p) => s + p.amount, 0);
    return { paid, pending, overdue, count: items.length };
  }, [items]);

  function persist(next: Payment[]) { setItems(next); setPayments(next); }
  function startNew() { setEditing(null); setForm(empty); setOpen(true); }
  function startEdit(p: Payment) {
    setEditing(p);
    setForm({ artisan: p.artisan, amount: p.amount, date: p.date, method: p.method, status: p.status });
    setOpen(true);
  }
  function save() {
    if (!form.artisan || !form.amount) return;
    if (editing) persist(items.map((p) => (p.id === editing.id ? { ...editing, ...form } : p)));
    else persist([{ id: uid(), ...form }, ...items]);
    setOpen(false);
  }
  function remove(id: string) { persist(items.filter((p) => p.id !== id)); }

  const cards = [
    { label: "Total paid", value: `₹${totals.paid.toLocaleString()}`, icon: TrendingUp, tint: "from-emerald-500 to-teal-500" },
    { label: "Pending", value: `₹${totals.pending.toLocaleString()}`, icon: Clock, tint: "from-amber-500 to-orange-500" },
    { label: "Overdue", value: `₹${totals.overdue.toLocaleString()}`, icon: CircleDollarSign, tint: "from-rose-500 to-red-500" },
    { label: "Transactions", value: totals.count, icon: Wallet, tint: "from-indigo-500 to-violet-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-1">Pay your artisans on time and keep your books clean.</p>
        </div>
        <button onClick={startNew}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-elegant hover:shadow-glow transition">
          <Plus className="h-4 w-4" /> Record payment
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border p-5 shadow-card">
            <div className={`grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br ${s.tint} text-white shadow-md`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 text-2xl font-bold tracking-tight">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card border shadow-card">
        <div className="p-4 flex flex-wrap gap-2 border-b">
          {["All", "Paid", "Pending", "Overdue"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-2 rounded-lg font-medium transition ${
                filter === s ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"
              }`}>{s}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-left font-medium px-6 py-3">Artisan</th>
                <th className="text-right font-medium px-4 py-3">Amount</th>
                <th className="text-left font-medium px-4 py-3">Method</th>
                <th className="text-left font-medium px-4 py-3">Date</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t hover:bg-muted/30 transition">
                  <td className="px-6 py-3.5 font-medium">{p.artisan}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums font-semibold">₹{p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{p.method}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{p.date}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No payments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-up" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-card border shadow-elegant p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">{editing ? "Edit payment" : "New payment"}</h3>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Artisan" className="sm:col-span-2">
                <input value={form.artisan} onChange={(e) => setForm({ ...form, artisan: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Amount (₹)">
                <input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: +e.target.value })} className={inputCls} />
              </Field>
              <Field label="Date">
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Method">
                <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value as Payment["method"] })} className={inputCls}>
                  <option>UPI</option><option>Bank Transfer</option><option>Cash</option><option>Card</option>
                </select>
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Payment["status"] })} className={inputCls}>
                  <option>Pending</option><option>Paid</option><option>Overdue</option>
                </select>
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-muted">Cancel</button>
              <button onClick={save} className="px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow hover:shadow-glow transition">
                {editing ? "Save changes" : "Record payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition";
function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
