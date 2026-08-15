import { FeaturedTrio } from "@/components/sections/FeaturedTrio";
import { Hero } from "@/components/sections/Hero";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { NotesStrip } from "@/components/sections/NotesStrip";
import { StoreInfo } from "@/components/sections/StoreInfo";
import { TwoHouses } from "@/components/sections/TwoHouses";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedTrio />
      <NotesStrip />
      <TwoHouses />
      <StoreInfo />
      <JournalPreview />
    </>
  );
}
