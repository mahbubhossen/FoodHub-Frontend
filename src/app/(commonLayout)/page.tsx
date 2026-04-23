// ─── src/app/(commonLayout)/page.tsx ──────────────────────────────────────
import {
  HeroSection,
  CategoriesSection,
  FeaturedMealsSection,
  HowItWorksSection,
  TopProvidersSection,
  TestimonialsSection,
  CTASection,
} from "@/components/modules/homepage/Sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedMealsSection />
      <HowItWorksSection />
      <TopProvidersSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
