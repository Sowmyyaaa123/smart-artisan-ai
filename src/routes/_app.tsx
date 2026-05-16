import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Package, Wallet, BarChart3, Bot, User, Sparkles,
  LogOut, Search, Bell, Menu, X,
} from "lucide-react";
import { getAuth, setAuth, getUser } from "@/lib/storage";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/production", label: "Production", icon: Package },
  { to: "/payments", label: "Payments", icon: Wallet },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/profile", label: "Profile", icon: User },
] as const;

function AppLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const ok = getAuth();
    setAuthed(ok);
    if (!ok) navigate({ to: "/login" });
  }, [navigate]);

  if (!authed) return null;

  const user = getUser();

  function logout() {
    setAuth(false);
    navigate({ to: "/login" });
  }

  return (
    <div className="min-h-screen flex bg-gradient-soft">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-72 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 font-semibold">
              <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-primary shadow-glow">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg tracking-tight">ArtisanAI</span>
            </Link>
            <button className="lg:hidden text-sidebar-foreground/70" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
            {nav.map((n) => {
              const active =
                n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                    active
                      ? "bg-sidebar-accent text-white shadow-sm"
                      : "text-sidebar-foreground/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-sidebar-border">
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-4 mb-3">
              <div className="text-xs uppercase tracking-wider text-white/60">Pro tip</div>
              <p className="text-sm mt-1 text-white/90">Ask the AI assistant for pricing help on slow-moving items.</p>
            </div>
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-sm font-semibold text-white">
                {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">{user.name}</div>
                <div className="text-xs text-white/60 truncate">{user.email}</div>
              </div>
              <button onClick={logout} className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {open && (
        <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/40 lg:hidden" />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 glass border-b">
          <div className="px-4 sm:px-8 h-16 flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search products, artisans, payments…"
                className="w-full rounded-xl bg-muted/60 pl-9 pr-3 py-2 text-sm outline-none focus:bg-card focus:ring-2 focus:ring-primary/20 transition border border-transparent focus:border-border"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="relative h-9 w-9 grid place-items-center rounded-xl hover:bg-muted transition">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
              </button>
              <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-xs font-semibold text-white">
                {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-8 py-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
