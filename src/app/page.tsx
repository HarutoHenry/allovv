import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { BusinessSection } from "@/components/business-section"
import { NumbersSection } from "@/components/numbers-section"
import { NewsSection } from "@/components/news-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main">
        <HeroSection />
        <BusinessSection />
        <PhilosophySection />
        <NumbersSection />
        <NewsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
