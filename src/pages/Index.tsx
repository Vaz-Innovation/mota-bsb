import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { ProcessSearchSection } from "@/components/ProcessSearchSection";
import { AboutSection } from "@/components/AboutSection";
import { PracticeAreasSection } from "@/components/PracticeAreasSection";
import { TeamSection } from "@/components/TeamSection";
import { LatestNewsSection } from "@/components/LatestNewsSection";
import { ContactSection } from "@/components/ContactSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieBanner } from "@/components/CookieBanner";
// import { ScamAlertPopup } from "@/components/ScamAlertPopup";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <ProcessSearchSection />
        <AboutSection />
        <PracticeAreasSection />
        <TeamSection />
        <LatestNewsSection />
        <ContactSection />
        <NewsletterSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
      {/* <ScamAlertPopup /> */}
    </div>
  );
};

export default Index;
