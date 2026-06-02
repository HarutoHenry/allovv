import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { BusinessSection } from "@/components/business-section"
import { NumbersSection } from "@/components/numbers-section"
import { NewsSection } from "@/components/news-section"
import { AboutSection } from "@/components/about-section"
import { CTABanner } from "@/components/cta-banner"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <PhilosophySection />
        <BusinessSection />
        <NumbersSection />
        <NewsSection />
        <AboutSection />
        <CTABanner />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
