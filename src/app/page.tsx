import { AvailabilitySection } from "@/components/marketing/availability-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { RegionsStrip } from "@/components/marketing/regions-strip";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";

export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <RegionsStrip />
      <FeaturesSection />
      <AvailabilitySection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
