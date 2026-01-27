import { useEffect, useRef, useState } from "react";
import {
  Users,
  Briefcase,
  Building,
  Heart,
  Scale,
  Shield,
  Vote,
  Landmark,
  Home,
  UserPlus,
  Gavel,
  Handshake,
  Calculator,
  LucideIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationKey } from "@/i18n/translations";

interface AreaData {
  icon: LucideIcon;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  fullDescriptionKey: TranslationKey;
}

const areasData: AreaData[] = [
  {
    icon: Users,
    titleKey: "areas.admin.title",
    descriptionKey: "areas.admin.description",
    fullDescriptionKey: "areas.admin.full",
  },
  {
    icon: Briefcase,
    titleKey: "areas.labor.title",
    descriptionKey: "areas.labor.description",
    fullDescriptionKey: "areas.labor.full",
  },
  {
    icon: Building,
    titleKey: "areas.union.title",
    descriptionKey: "areas.union.description",
    fullDescriptionKey: "areas.union.full",
  },
  {
    icon: Heart,
    titleKey: "areas.social_security.title",
    descriptionKey: "areas.social_security.description",
    fullDescriptionKey: "areas.social_security.full",
  },
  {
    icon: Scale,
    titleKey: "areas.constitutional.title",
    descriptionKey: "areas.constitutional.description",
    fullDescriptionKey: "areas.constitutional.full",
  },
  {
    icon: Shield,
    titleKey: "areas.criminal.title",
    descriptionKey: "areas.criminal.description",
    fullDescriptionKey: "areas.criminal.full",
  },
  {
    icon: Vote,
    titleKey: "areas.electoral.title",
    descriptionKey: "areas.electoral.description",
    fullDescriptionKey: "areas.electoral.full",
  },
  {
    icon: Landmark,
    titleKey: "areas.superior_courts.title",
    descriptionKey: "areas.superior_courts.description",
    fullDescriptionKey: "areas.superior_courts.full",
  },
  {
    icon: Home,
    titleKey: "areas.real_estate.title",
    descriptionKey: "areas.real_estate.description",
    fullDescriptionKey: "areas.real_estate.full",
  },
  {
    icon: UserPlus,
    titleKey: "areas.family.title",
    descriptionKey: "areas.family.description",
    fullDescriptionKey: "areas.family.full",
  },
  {
    icon: Gavel,
    titleKey: "areas.public_treasury.title",
    descriptionKey: "areas.public_treasury.description",
    fullDescriptionKey: "areas.public_treasury.full",
  },
  {
    icon: Handshake,
    titleKey: "areas.mediation.title",
    descriptionKey: "areas.mediation.description",
    fullDescriptionKey: "areas.mediation.full",
  },
  {
    icon: Calculator,
    titleKey: "areas.tax.title",
    descriptionKey: "areas.tax.description",
    fullDescriptionKey: "areas.tax.full",
  },
];

export const PracticeAreasSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="areas"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="h-1 w-20 bg-gradient-gold mx-auto mb-6 rounded-full"></div>
          <h2
            className={`text-4xl md:text-6xl font-bold text-navy mb-6 tracking-tight font-serif transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {t("areas.title")}
          </h2>
          <p
            className={`text-lg md:text-xl text-muted-foreground leading-relaxed transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {t("areas.subtitle")}
          </p>
        </div>

        {/* Horizontal Scroll Cards */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {areasData.map((area, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-80 snap-center transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
                onClick={() => setSelectedArea(area)}
              >
                <div className="h-full p-6 rounded-2xl bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer">
                  <div className="w-14 h-14 mb-4 bg-navy/10 border border-navy/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-navy/20">
                    <area.icon className="w-7 h-7 text-[#0a1639]" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-navy mb-2 font-serif">
                    {t(area.titleKey)}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {t(area.descriptionKey)}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[#0a1639] font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                    <span>{t("areas.learn_more")}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="text-center mt-6 text-muted-foreground text-sm">
            {t("areas.scroll_hint")}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedArea} onOpenChange={() => setSelectedArea(null)}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              {selectedArea && (
                <div className="w-14 h-14 bg-navy/10 border border-navy/20 rounded-full flex items-center justify-center">
                  <selectedArea.icon className="w-7 h-7 text-[#0a1639]" />
                </div>
              )}
              <DialogTitle className="text-xl font-serif text-navy">
                {selectedArea && t(selectedArea.titleKey)}
              </DialogTitle>
            </div>
            <DialogDescription className="text-base text-muted-foreground leading-relaxed">
              {selectedArea && t(selectedArea.fullDescriptionKey)}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};
