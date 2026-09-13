import CafeSite from "@/components/cafe-site";
import { getCafeContent } from "@/lib/content";
export const revalidate = 60;
export default async function Home() { return <CafeSite content={await getCafeContent()} locale="en" />; }
