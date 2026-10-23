import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { FaqSection } from "@/components/sections/faq";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { Highlights } from "@/components/sections/highlights";
import { InstagramEmbeds } from "@/components/sections/instagram-embeds";
import { Menu } from "@/components/sections/menu";
import { Order } from "@/components/sections/order";
import { Reels } from "@/components/sections/reels";
import { Reviews } from "@/components/sections/reviews";

// Section order lives here. Each section returns null when its config is empty.
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Highlights />
      <Menu />
      <Gallery />
      <Reels />
      <About />
      <Reviews />
      <InstagramEmbeds />
      <Order />
      <FaqSection />
      <Contact />
    </main>
  );
}
