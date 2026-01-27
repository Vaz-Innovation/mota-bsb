import { useEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import joseMota from "@/assets/jose-mota.jpg";
import maristelaMota from "@/assets/maristela-mota.jpg";
import rafaelMota from "@/assets/rafael-mota.jpg";
import kamillaBarbosa from "@/assets/kamilla-barbosa.jpg";
import priscilaAbritta from "@/assets/priscila-abritta.jpg";
import marianaVelho from "@/assets/mariana-velho.jpg";

const team = [
  {
    image: joseMota,
    name: "Dr. José Mota",
    oab: "OAB/DF 1413-A",
    email: "josemota@mota.adv.br",
  },
  {
    image: maristelaMota,
    name: "Dra. Maristela Mota",
    oab: "OAB/DF 1.691-A",
    email: "maristela@mota.adv.br",
  },
  {
    image: rafaelMota,
    name: "Dr. Rafael Augusto Mota",
    oab: "OAB/DF 72.907",
    email: "rafael@mota.adv.br",
  },
  {
    image: kamillaBarbosa,
    name: "Dra. Kamilla Flávila e Léles Barbosa",
    oab: "OAB/DF 19.512",
    email: "kamilla@mota.adv.br",
  },
  {
    image: priscilaAbritta,
    name: "Dra. Priscila Souza Abritta",
    oab: "OAB/DF 54.644",
    email: "priscila@mota.adv.br",
  },
  {
    image: marianaVelho,
    name: "Dra. Mariana Prado Garcia de Queiroz Velho",
    oab: "OAB/DF 16.362",
    email: "mariana@mota.adv.br",
  },
];

export const TeamSection = () => {
  const [isVisible, setIsVisible] = useState(false);
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
      id="equipe"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-muted/30 to-background"
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
            {t("team.title")}
          </h2>
          <p
            className={`text-lg md:text-xl text-muted-foreground leading-relaxed transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {t("team.subtitle")}
          </p>
        </div>

        {/* Team Cards - Horizontal Scroll on Mobile */}
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-72 lg:w-auto snap-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group h-full flex flex-col">
                <div className="aspect-[3/4] overflow-hidden flex-shrink-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 text-center flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-navy mb-1 font-serif min-h-[3.5rem] flex items-center justify-center">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {member.oab}
                    </p>
                  </div>
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-[#0a1639] hover:text-navy-deep transition-colors text-sm font-medium justify-center"
                  >
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator - Mobile Only */}
        <div className="text-center mt-6 text-muted-foreground text-sm lg:hidden">
          {t("team.scroll_hint")}
        </div>
      </div>
    </section>
  );
};
