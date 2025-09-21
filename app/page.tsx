import { PublicLayout } from "@/components/layouts/public-layout";
import { HeroSection, BenefitsSection, CarLists, CtaSection } from "@/components/homepage";

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <BenefitsSection />
      <CarLists />
      <CtaSection />
    </PublicLayout>
  );
}
