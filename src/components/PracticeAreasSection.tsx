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
} from "lucide-react";

const areas = [
  {
    icon: Users,
    title: "Direito Administrativo (Servidor Público)",
    description: "Defesa dos direitos e interesses dos servidores públicos",
  },
  {
    icon: Briefcase,
    title: "Direito do Trabalho Individual e Coletivo",
    description: "Reclamatórias trabalhistas e acompanhamento processual",
  },
  {
    icon: Building,
    title: "Direito Sindical",
    description: "Assessoria completa para entidades sindicais",
  },
  {
    icon: Heart,
    title: "Direito Previdenciário",
    description: "Concessão e revisão de benefícios previdenciários",
  },
  {
    icon: Scale,
    title: "Direito Constitucional",
    description: "Elaboração de ADI e recursos extraordinários",
  },
  {
    icon: Shield,
    title: "Direito Penal",
    description: "Habeas Corpus e recursos criminais",
  },
  {
    icon: Vote,
    title: "Direito Eleitoral",
    description: "Assessoria eleitoral completa",
  },
  {
    icon: Landmark,
    title: "Tribunais Superiores",
    description: "Atuação em Brasília junto aos Tribunais Superiores",
  },
  {
    icon: Home,
    title: "Direito Imobiliário",
    description: "Assessoria completa em negócios e regularização imobiliária",
  },
  {
    icon: UserPlus,
    title: "Direito de Família e Sucessões",
    description: "Inventários, divórcios, pensões e sucessões",
  },
  {
    icon: Gavel,
    title: "Fazenda Pública e Entes Federados",
    description: "Ações contra União, Estados, DF e Municípios",
  },
  {
    icon: Handshake,
    title: "Mediação e Conciliação",
    description: "Métodos alternativos de resolução de conflitos",
  },
  {
    icon: Calculator,
    title: "Direito Tributário e Empresarial",
    description: "Assessoria jurídica para empresas e matéria tributária",
  },
];

export const PracticeAreasSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
            Áreas de Atuação
          </h2>
          <p
            className={`text-lg md:text-xl text-muted-foreground leading-relaxed transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Especializados em Direito Administrativo e atuantes em diversas áreas do Direito.
          </p>
        </div>

        {/* Horizontal Scroll Cards */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {areas.map((area, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-80 snap-center transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="h-full p-6 rounded-2xl bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer">
                  <div className="w-14 h-14 mb-4 bg-gold-light/10 border border-gold-light/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-gold-light/20">
                    <area.icon className="w-7 h-7 text-gold-light" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-navy mb-2 font-serif">
                    {area.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {area.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-gold-light font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                    <span>Saiba mais</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="text-center mt-6 text-muted-foreground text-sm">
            ← Deslize para navegar →
          </div>
        </div>
      </div>
    </section>
  );
};