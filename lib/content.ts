import { createClient } from "@sanity/client";

export type Locale = "en" | "ro";
export type Localized = { en: string; ro: string };
export type MenuItem = { _key: string; name: Localized; description?: Localized; price: number };
export type CafeContent = {
  heroTitle: Localized; heroText: Localized; storyTitle: Localized; storyText: Localized;
  coffeeText: Localized; address: string; postalCode: string; weekdayHours: string; weekendHours: string;
  instagram: string; facebook: string; maps: string; menu: MenuItem[];
};
export const defaultContent: CafeContent = {
  heroTitle: { en: "A little hidden.\nEasy to love.", ro: "Puțin ascuns.\nUșor de iubit." },
  heroText: { en: "Specialty coffee. A slower pace. Your little place in the heart of Bucharest.", ro: "Cafea de specialitate. Un ritm mai lent. Micul tău loc din inima Bucureștiului." },
  storyTitle: { en: "Small space.\nRoom for you.", ro: "Un loc mic.\nLoc pentru tine." },
  storyText: { en: "Between the familiar cafés of central Bucharest, there’s a little place worth finding. Dark brick, green leaves, a little morning light. And coffee that gives you a reason to stay.", ro: "Printre cafenelele cunoscute din centrul Bucureștiului, există un mic loc care merită descoperit. Cărămidă închisă, frunze verzi, puțină lumină de dimineață. Și cafea care îți dă un motiv să mai stai." },
  coffeeText: { en: "We serve MERON specialty coffee, in a place made for taking your time. Come for your usual. Stay for another moment.", ro: "Servim cafea de specialitate MERON, într-un loc în care poți să încetinești. Vino pentru cafeaua ta preferată. Mai rămâi o clipă." },
  address: "Str. D. I. Mendeleev 10", postalCode: "030167", weekdayHours: "08:00–17:00", weekendHours: "10:00–19:00",
  instagram: "https://www.instagram.com/pebble.bucharest/",
  facebook: "https://www.facebook.com/profile.php?id=61569199823551",
  maps: "https://www.google.com/maps/search/?api=1&query=Pebble+Bucharest",
  menu: [],
};
const localFields = ["heroTitle", "heroText", "storyTitle", "storyText", "coffeeText"] as const;
const stringFields = ["address", "postalCode", "weekdayHours", "weekendHours"] as const;
const urlFields = ["instagram", "facebook", "maps"] as const;
export function normalizeContent(input: Partial<CafeContent> | null): CafeContent {
  const result = structuredClone(defaultContent);
  if (!input) return result;
  for (const field of localFields) for (const lang of ["en", "ro"] as const) {
    const value = input[field]?.[lang];
    if (typeof value === "string" && value.trim()) result[field][lang] = value;
  }
  for (const field of stringFields) if (typeof input[field] === "string" && input[field]?.trim()) result[field] = input[field];
  for (const field of urlFields) {
    const value = input[field];
    if (typeof value === "string") { try { const url = new URL(value); if (url.protocol === "https:") result[field] = value; } catch {} }
  }
  result.menu = Array.isArray(input.menu) ? input.menu.filter(item => item && item.name?.en && item.name?.ro && typeof item.price === "number" && Number.isFinite(item.price) && item.price >= 0) : [];
  return result;
}
export async function getCafeContent(): Promise<CafeContent> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return structuredClone(defaultContent);
  try {
    const client = createClient({ projectId, dataset, apiVersion: "2026-09-14", useCdn: true, timeout: 5000, maxRetries: 1 });
    const data = await client.fetch<Partial<CafeContent> | null>('*[_type == "cafeSettings"] | order(_updatedAt desc)[0]{heroTitle,heroText,storyTitle,storyText,coffeeText,address,postalCode,weekdayHours,weekendHours,instagram,facebook,maps,menu}', {}, { next: { revalidate: 60 } });
    return normalizeContent(data);
  } catch {
    console.error("PEBBLE: Sanity content unavailable; using the local café content.");
    return structuredClone(defaultContent);
  }
}
