import type { Metadata } from "next";
import CafeSite from "@/components/cafe-site";
import { getCafeContent } from "@/lib/content";
export const metadata: Metadata = {
  title: "PEBBLE — Cafea de specialitate, București",
  description:
    "Puțin ascuns. Ușor de iubit. Cafea MERON, plante și un ritm mai lent la PEBBLE, Mendeleev 10, București.",
};
export const revalidate = 60;
export default async function Page() {
  return <CafeSite content={await getCafeContent()} locale="ro" />;
}
