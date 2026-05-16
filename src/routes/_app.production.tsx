import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Package } from "lucide-react";
import { getProducts, setProducts, type Product, uid } from "@/lib/storage";
import { StatusBadge } from "./_app.index";

export const Route = createFileRoute("/_app/production")({
  head: () => ({ meta: [{ title: "Production — ArtisanAI" }, { name: "description", content: "Manage handmade product runs, costs, and status." }] }),
  component: ProductionPage,
});

const empty: Omit<Product, "id"> = {
  name: "", artisan: "", quantity: 1, materialCost: 0, laborCost: 0,
  status: "Pending", date: new Date().toISOString().slice(0, 10),
};

function ProductionPage() {
  const [items, setItems] = useState<Product[]>(() => getProducts());
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(empty);

  const filtered = useMemo(
    () =>
      items.filter(
        (p) =>
          (status === "All" || p.status === status) &&
          (p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.artisan.toLowerCase().includes(q.toLowerCase())),
      ),
    [items, q, status],
  );

  function persist(next: Product[]) { setItems(next); setProducts(next); }
  function startNew() { setEditing(null); setForm(empty); setOpen(true); }
  function startEdit(p: Product) {
    setEditing(p);
    setForm({ name: p.name, artisan: p.artisan, quantity: p.quantity, materialCost: p.materialCost, laborCost: p.laborCost, status: p.status, date: p.date });
    setOpen(true);
  }
  function save() {
    if (!form.name || !form.artisan) return;
    if (editing) persist(items.map((p) => (p.id === editing.id ? { ...editing, ...form } : p)));
    else persist([{ id: uid(), ...form }, ...items]);
    setOpen(false);
  }
  function remove(id: string) { persist(items.filter((p) => p.id !== id)); }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production</h1>
          <p className="text-muted-foreground mt-1">Track every handmade run from raw materials to ready-to-ship.</p>
        </div>
        <button onClick={startNew}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-elegant hover:shadow-glow transition">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div className="rounded-2xl bg-card border shadow-card">
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products or artisans…"
              className="w-full rounded-xl bg-muted/50 pl-9 pr-3 py-2.5 text-sm outline-none focus:bg-card focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-border transition" />
          </div>
          <div className="flex gap-2">
            {["All", "Pending", "In Progress", "Completed"].map((s) => (
              <button key={s} onClick={() => setStatus(s)}
                className={`text-xs px-3 py-2 rounded-lg font-medium transition ${
                  status === s ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"
                }`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-left font-medium px-6 py-3">Product</th>
                <th className="text-left font-medium px-4 py-3">Artisan</th>
                <th className="text-right font-medium px-4 py-3">Qty</th>
                <th className="text-right font-medium px-4 py-3">Material</th>
                <th className="text-right font-medium px-4 py-3">Labor</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-left font-medium px-4 py-3">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t hover:bg-muted/30 transition">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/15 to-primary-glow/15 grid place-items-center text-primary">
                        <Package className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{p.artisan}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums">{p.quantity}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums">₹{p.materialCost}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums">₹{p.laborCost}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3.5 text-muted-foreground">{p.date}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">No products match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-up" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-card border shadow-elegant p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">{editing ? "Edit product" : "New product"}</h3>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Product name" className="sm:col-span-2">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Artisan">
                <input value={form.artisan} onChange={(e) => setForm({ ...form, artisan: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Quantity">
                <input type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: +e.target.value })} className={inputCls} />
              </Field>
              <Field label="Material cost (₹)">
                <input type="number" min={0} value={form.materialCost} onChange={(e) => setForm({ ...form, materialCost: +e.target.value })} className={inputCls} />
              </Field>
              <Field label="Labor cost (₹)">
                <input type="number" min={0} value={form.laborCost} onChange={(e) => setForm({ ...form, laborCost: +e.target.value })} className={inputCls} />
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Product["status"] })} className={inputCls}>
                  <option>Pending</option><option>In Progress</option><option>Completed</option>
                </select>
              </Field>
              <Field label="Date">
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-muted">Cancel</button>
              <button onClick={save} className="px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow hover:shadow-glow transition">
                {editing ? "Save changes" : "Create product"}
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
