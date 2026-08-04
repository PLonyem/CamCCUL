import type { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About — CamCCUL",
  description:
    "The history, mission, leadership, and regional presence of the Cameroon Cooperative Credit Union League.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
