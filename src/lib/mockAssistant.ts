// Local smart mock assistant — no backend required.

export type Topic =
  | "sales"
  | "inventory"
  | "marketing"
  | "pricing"
  | "packaging"
  | "production"
  | "payments"
  | "photography"
  | "materials"
  | "customers"
  | "default";

const RESPONSES: Record<Topic, string[]> = {
  sales: [
    "Here are a few sales boosters tailored for handmade studios:\n\n• **Bundle smartly** — pair a hero product with a low-cost add-on (e.g. vase + care kit) to lift AOV by 15–25%.\n• **Limited drops** — release small batches with a countdown to create urgency.\n• **Repeat buyers** — your existing customers convert 4× higher than cold traffic. Send a personal note 14 days after delivery with a 10% returning-customer code.\n• **Track weekly** — watch revenue per SKU, not just totals. Cut the bottom 20% next season.",
  ],
  inventory: [
    "A lean inventory plan for handmade businesses:\n\n• **Par levels** — set a min/max for each SKU based on 30-day sell-through.\n• **Material kits** — pre-cut/pre-measure raw materials in batches of 5–10 units to shave 30% off production time.\n• **ABC analysis** — A items (top 20% revenue) get tight stock control; C items become made-to-order.\n• **Dead stock** — anything not sold in 90 days → bundle, discount, or repurpose materials.",
  ],
  marketing: [
    "Marketing playbook for a handmade brand:\n\n• **Story over specs** — show the maker, the workshop, the hands. Authenticity converts.\n• **Short-form video** — 15–30s reels of the *process* outperform finished-product shots 3–5×.\n• **Local + niche** — list on regional artisan marketplaces and 2–3 themed micro-communities.\n• **Email > social** — collect emails at every touchpoint; a 500-person list beats 5k passive followers.\n• **UGC** — ask buyers for a photo in exchange for a small discount on next order.",
  ],
  pricing: [
    "A reliable handmade pricing formula:\n\n**Price = (Materials + Labor + Overhead) × Margin**\n\n• Pay yourself at least ₹250–₹500/hour for skilled craft time.\n• Overhead ≈ 15–25% of (materials + labor).\n• Retail margin: 2.2–2.5×. Wholesale: 1.6–1.8×.\n• Always test a 10–15% price lift on your hero product — demand for handmade is usually less elastic than you think.",
  ],
  packaging: [
    "Premium yet eco-friendly packaging ideas:\n\n• **Recycled kraft boxes** with a custom stamp — low cost, high perceived value.\n• **Tissue + twine + dried flower** wrap = instagrammable unboxing for under ₹20/unit.\n• **Care card** with the maker's name and a QR to a thank-you video.\n• For fragile items: shredded recycled paper > bubble wrap, and corner inserts beat loose fill.",
  ],
  production: [
    "Production tips to ship more without burning out:\n\n• **Batch by step**, not by product — cut all, then paint all, then finish all.\n• **2-week sprints** with a clear output target per artisan.\n• **Quality gates** at 3 stages: raw material check, mid-production, pre-packing.\n• Track *yield* (good units ÷ started units). Below 90%? Investigate the step before the failure.",
  ],
  payments: [
    "Keeping artisan payments clean and motivating:\n\n• **Pay per piece**, not per day — aligns incentives with output.\n• Settle within **7 days** of completion; faster pay = better retention.\n• Add a **quality bonus** (5–10%) for zero-defect batches.\n• Keep a simple ledger: artisan · batch · units · rate · bonus · paid date. Review monthly.",
  ],
  photography: [
    "Phone photography that sells handmade:\n\n• **North-facing window** at 10am–2pm = free studio lighting.\n• White foam board as a bounce reflector on the shadow side.\n• Shoot 3 angles per product: hero, detail, in-use.\n• Edit: lift shadows, add +5 warmth, never over-saturate. Keep the craft honest.",
  ],
  materials: [
    "Smart material sourcing for artisans:\n\n• Build relationships with **2 suppliers per material** — never single-source.\n• Buy seasonal raw materials in bulk when prices dip; store properly.\n• Test sustainable swaps (natural dyes, organic cotton, FSC wood) — they justify a 15–20% price premium.\n• Track cost per unit monthly; a 5% material creep silently destroys margins.",
  ],
  customers: [
    "Build a loyal handmade customer base:\n\n• **Handwritten thank-you note** in every order — 70% remember it months later.\n• Birthday/anniversary email with a small free add-on.\n• Private \"first access\" list for new drops.\n• Ask one question after delivery: *\"What almost stopped you from buying?\"* — gold for fixing conversion.",
  ],
  default: [
    "Great question. A few principles that apply to almost every handmade business decision:\n\n• **Margin before volume** — fix pricing before chasing scale.\n• **One channel mastered** beats five channels dabbled in.\n• **Document your process** — it becomes training, marketing, and IP.\n• **Talk to 5 customers a month** — patterns will surface that no dashboard shows.\n\nTell me more about your specific situation (product, stage, biggest blocker) and I'll give sharper advice.",
  ],
};

const KEYWORDS: Array<[Topic, RegExp]> = [
  ["sales", /\b(sale|sales|revenue|sell|selling|conversion|aov|order value)\b/i],
  ["inventory", /\b(inventory|stock|sku|warehouse|restock|dead stock)\b/i],
  ["marketing", /\b(market|marketing|instagram|reels|social|brand|promot|advertis|seo|reach|audience)\b/i],
  ["pricing", /\b(price|pricing|cost|charge|margin|profit|how much)\b/i],
  ["packaging", /\b(packag|wrap|box|unboxing|shipping box)\b/i],
  ["production", /\b(production|produce|manufactur|batch|workflow|process|output)\b/i],
  ["payments", /\b(payment|payout|pay artisan|wages|salary|settle)\b/i],
  ["photography", /\b(photo|photograph|picture|shoot|camera|lighting)\b/i],
  ["materials", /\b(material|fabric|wood|clay|yarn|supplier|sourcing|raw)\b/i],
  ["customers", /\b(customer|client|buyer|retention|loyal|repeat)\b/i],
];

export function detectTopic(text: string): Topic {
  for (const [topic, re] of KEYWORDS) {
    if (re.test(text)) return topic;
  }
  return "default";
}

export function generateReply(userMessage: string): string {
  const topic = detectTopic(userMessage);
  const pool = RESPONSES[topic];
  return pool[Math.floor(Math.random() * pool.length)];
}

// Simulate realistic typing delay based on response length.
export function estimateDelay(reply: string): number {
  const base = 600;
  const perChar = 4;
  return Math.min(2400, base + reply.length * perChar);
}
