"use client";

import type { SiteData } from "@/lib/types";
import { SiteProvider } from "./SiteContext";
import { LanguageGate } from "./Gate";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Ticker } from "./Ticker";
import { FeaturedOffer } from "./FeaturedOffer";
import { Steps } from "./Steps";
import { Highlights } from "./Highlights";
import { Departments } from "./Departments";
import { CartBar } from "./CartBar";
import { OrderModal } from "./OrderModal";
import { Footer } from "./Footer";

export default function HomeApp({ data }: { data: SiteData }) {
  return (
    <SiteProvider texts={data.texts}>
      {/* soft blurred background layers */}
      <div className="bg-scene" aria-hidden />
      <div className="bg-wash" aria-hidden />
      <div className="bg-grain" aria-hidden />

      <Nav />

      <main>
        <Hero />
        <Ticker />
        <FeaturedOffer offer={data.featured} />
        <Steps />
        <Highlights bundles={data.highlighted} />
        <Departments departments={data.departments} />
      </main>

      <Footer />

      <CartBar />
      <OrderModal />
      <LanguageGate />
    </SiteProvider>
  );
}
