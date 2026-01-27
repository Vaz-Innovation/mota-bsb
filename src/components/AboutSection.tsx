import { useEffect, useRef, useState } from "react";
import { TrendingUp, Shield, Target, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationKey } from "@/i18n/translations";

interface CardData {
  icon: typeof TrendingUp;
  badgeKey: TranslationKey;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  fullDescriptionKey: TranslationKey;
}

const cardsData: CardData[] = [
  {
    icon: TrendingUp,
    badgeKey: "about.since",
    titleKey: "about.trajectory.title",
    descriptionKey: "about.trajectory.description",
    fullDescriptionKey: "about.trajectory.full",
  },
  {
    icon: Shield,
    badgeKey: "about.pillars.badge",
    titleKey: "about.pillars.title",
    descriptionKey: "about.pillars.description",
    fullDescriptionKey: "about.pillars.full",
  },
  {
    icon: Target,
    badgeKey: "about.mission.badge",
    titleKey: "about.mission.title",
    descriptionKey: "about.mission.description",
    fullDescriptionKey: "about.mission.full",
  },
  {
    icon: MapPin,
    badgeKey: "about.office.badge",
    titleKey: "about.office.title",
    descriptionKey: "about.office.description",
    fullDescriptionKey: "about.office.full",
  },
];

export const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-background to-muted/30"
    >

      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block mb-4">
            <div className="h-1 w-20 bg-gradient-gold mx-auto mb-6 rounded-full"></div>
          </div>
          <h2
            className={`text-4xl md:text-6xl font-bold text-navy mb-6 tracking-tight font-serif transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {t("about.title")}
          </h2>
          <p
            className={`text-lg md:text-xl text-muted-foreground leading-relaxed transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {t("about.subtitle")}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {cardsData.map((card, index) => (
            <div
              key={index}
              className={`group cursor-pointer transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
              onClick={() => setSelectedCard(card)}
            >
              <div className="h-full p-8 rounded-2xl bg-white border border-border/50 shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
                <div className="w-20 h-20 mb-6 bg-navy/10 border border-navy/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-navy/20">
                  <card.icon className="w-10 h-10 text-[#0a1639] transition-all duration-300" />
                </div>
                
                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-gold-light/10 border border-gold-light/20">
                  <span className="text-xs font-semibold text-gold-light">{t(card.badgeKey)}</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-semibold text-navy mb-3 tracking-tight font-serif">
                  {t(card.titleKey)}
                </h3>
                
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  {t(card.descriptionKey)}
                </p>
                
                <div className="flex items-center gap-2 text-gold-light font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>{t("about.explore")}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              {selectedCard && (
                <div className="w-16 h-16 bg-navy/10 border border-navy/20 rounded-full flex items-center justify-center">
                  <selectedCard.icon className="w-8 h-8 text-[#0a1639]" />
                </div>
              )}
              <div>
                <div className="inline-block px-3 py-1 mb-2 rounded-full bg-gold-light/10 border border-gold-light/20">
                  <span className="text-xs font-semibold text-gold-light">{selectedCard && t(selectedCard.badgeKey)}</span>
                </div>
                <DialogTitle className="text-2xl font-serif text-navy">
                  {selectedCard && t(selectedCard.titleKey)}
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {selectedCard && t(selectedCard.fullDescriptionKey)}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};
