import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { CreativeSection } from "@/components/creative-section"
import { BusinessSection } from "@/components/business-section"
import { NewsSection } from "@/components/news-section"
import { BlogSection } from "@/components/blog-section"
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
        <CreativeSection />
        <NewsSection />
        <BlogSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
