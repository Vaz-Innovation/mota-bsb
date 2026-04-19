import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Avalie = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t("avalie.heroTitle") || "Avalie"} />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-navy text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-beige mb-4">
            {t("avalie.heroTitle")}
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            {t("avalie.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-10 h-10 text-orange-400 fill-orange-400" />
            ))}
          </div>

          <h2 className="text-3xl font-serif text-navy mb-4">
            {t("avalie.cardTitle")}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t("avalie.cardSubtitle")}
          </p>

          {/* Info card */}
          <div className="bg-muted rounded-xl p-6 mb-8">
            <p className="text-muted-foreground">
              {t("avalie.note")}
            </p>
          </div>

          {/* CTA */}
          <a
            href="https://share.google/1EuNfdFzLLHbqCPWT"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="bg-navy hover:bg-navy/90 text-beige gap-2 text-lg px-8 py-6">
              <Star className="w-5 h-5" />
              {t("avalie.cta")}
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
          <p className="text-sm text-muted-foreground mt-4">
            {t("avalie.disclaimer")}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Avalie;
