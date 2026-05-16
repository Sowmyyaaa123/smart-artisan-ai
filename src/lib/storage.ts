// Tiny localStorage helpers + demo data seeding

export type Product = {
  id: string;
  name: string;
  artisan: string;
  quantity: number;
  materialCost: number;
  laborCost: number;
  status: "Pending" | "In Progress" | "Completed";
  date: string;
};

export type Payment = {
  id: string;
  artisan: string;
  amount: number;
  date: string;
  method: "Cash" | "Bank Transfer" | "UPI" | "Card";
  status: "Pending" | "Paid" | "Overdue";
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
};

const KEYS = {
  auth: "artisanai_auth",
  user: "artisanai_user",
  products: "artisanai_products",
  payments: "artisanai_payments",
  chat: "artisanai_chat",
} as const;

const isBrowser = () => typeof window !== "undefined";

export function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const storage = { KEYS, read, write };

// ---------- Auth ----------
export type User = { name: string; email: string; business: string; joined: string };

export function getAuth(): boolean {
  return read<boolean>(KEYS.auth, false);
}
export function getUser(): User {
  return read<User>(KEYS.user, {
    name: "Aarav Mehta",
    email: "demo@artisan.ai",
    business: "Mehta Handcrafted Studio",
    joined: "2024-08-12",
  });
}
export function setAuth(v: boolean) { write(KEYS.auth, v); }
export function setUser(u: User) { write(KEYS.user, u); }

// ---------- Products ----------
const seedProducts: Product[] = [
  { id: "p1", name: "Hand-painted Ceramic Vase", artisan: "Priya Sharma", quantity: 12, materialCost: 320, laborCost: 480, status: "Completed", date: "2026-04-22" },
  { id: "p2", name: "Woven Jute Tote Bag", artisan: "Ravi Kumar", quantity: 24, materialCost: 180, laborCost: 220, status: "In Progress", date: "2026-05-02" },
  { id: "p3", name: "Block-printed Cotton Scarf", artisan: "Meera Iyer", quantity: 40, materialCost: 240, laborCost: 360, status: "In Progress", date: "2026-05-08" },
  { id: "p4", name: "Carved Sandalwood Box", artisan: "Sandeep Rao", quantity: 8, materialCost: 540, laborCost: 720, status: "Pending", date: "2026-05-12" },
  { id: "p5", name: "Macramé Wall Hanging", artisan: "Anika Das", quantity: 16, materialCost: 200, laborCost: 300, status: "Completed", date: "2026-04-30" },
];

const seedPayments: Payment[] = [
  { id: "y1", artisan: "Priya Sharma", amount: 9600, date: "2026-04-25", method: "UPI", status: "Paid" },
  { id: "y2", artisan: "Ravi Kumar", amount: 5280, date: "2026-05-04", method: "Bank Transfer", status: "Paid" },
  { id: "y3", artisan: "Meera Iyer", amount: 14400, date: "2026-05-10", method: "UPI", status: "Pending" },
  { id: "y4", artisan: "Sandeep Rao", amount: 5760, date: "2026-05-13", method: "Cash", status: "Overdue" },
  { id: "y5", artisan: "Anika Das", amount: 4800, date: "2026-05-01", method: "Card", status: "Paid" },
];

export function getProducts(): Product[] {
  const cur = read<Product[] | null>(KEYS.products, null);
  if (cur === null) { write(KEYS.products, seedProducts); return seedProducts; }
  return cur;
}
export function setProducts(p: Product[]) { write(KEYS.products, p); }

export function getPayments(): Payment[] {
  const cur = read<Payment[] | null>(KEYS.payments, null);
  if (cur === null) { write(KEYS.payments, seedPayments); return seedPayments; }
  return cur;
}
export function setPayments(p: Payment[]) { write(KEYS.payments, p); }

export function getChat(): ChatMessage[] { return read<ChatMessage[]>(KEYS.chat, []); }
export function setChat(c: ChatMessage[]) { write(KEYS.chat, c); }

export const uid = () => Math.random().toString(36).slice(2, 10);
