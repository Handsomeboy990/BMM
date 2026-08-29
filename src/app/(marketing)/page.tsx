import { AudiencesSection } from "@/components/marketing/audiences-section";
import { AvailabilitySection } from "@/components/marketing/availability-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { ImpactSection } from "@/components/marketing/impact-section";
import { RegionsStrip } from "@/components/marketing/regions-strip";
import {
  ScrollStory,
  type StoryPanel,
} from "@/components/marketing/scroll-story";
import { SecuritySection } from "@/components/marketing/security-section";

const storyPanels: StoryPanel[] = [
  {
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=70&auto=format&fit=crop",
    alt: "Équipe médicale au-dessus d'un patient au bloc opératoire",
    eyebrow: "Urgence",
    title: "Quand chaque minute compte",
    description:
      "Une demande de sang rare peut surgir à tout instant. La rapidité de mobilisation fait la différence entre la vie et la perte.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?w=1600&q=70&auto=format&fit=crop",
    alt: "Don du sang en cours dans un centre de collecte",
    eyebrow: "Le don",
    title: "Un donneur, une vie",
    description:
      "En quelques secondes, HEMORA identifie le bon donneur, compatible et disponible, au plus près du besoin.",
  },
  {
    image: "/emergency-banner.png",
    alt: "Carte d'Afrique lumineuse avec profil médical d'urgence",
    eyebrow: "La communauté",
    title: "Une Afrique qui répond présente",
    description:
      "Un réseau de volontaires qui grandit ville après ville, mobilisable d'un seul geste quand un besoin survient.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <RegionsStrip />
      <ScrollStory panels={storyPanels} />
      <FeaturesSection />
      <HowItWorksSection />
      <AvailabilitySection />
      <AudiencesSection />
      <ImpactSection />
      <SecuritySection />
      <CtaSection />
    </>
  );
}
