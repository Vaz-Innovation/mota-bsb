import { useEffect, useRef, useState } from "react";
import { TrendingUp, Shield, Target, MapPin } from "lucide-react";

const cards = [
  {
    icon: TrendingUp,
    badge: "Desde 2000",
    title: "Trajetória",
    description: "Mais de 25 anos de excelência jurídica",
  },
  {
    icon: Shield,
    badge: "Ética | Comprometimento",
    title: "Pilares Consolidados",
    description: "Os pilares de uma advocacia que une ética, excelência e resultados",
  },
  {
    icon: Target,
    badge: "Excelência",
    title: "Nossa Missão",
    description: "Relacionamento de qualidade e serviços jurídicos eficazes",
  },
  {
    icon: MapPin,
    badge: "Atuação Nacional",
    title: "Escritório",
    description: "Sede em Brasília com cobertura nacional",
  },
];

export const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
      className="relative py-24 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(var(--navy-deep)) 0%, hsl(var(--background)) 40%, hsl(var(--background)) 60%, hsl(var(--navy-deep) / 0.05) 100%)`,
      }}
    >
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-light/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
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
            Escritório
          </h2>
          <p
            className={`text-lg md:text-xl text-muted-foreground leading-relaxed transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Construindo soluções jurídicas com excelência, ética e resultados desde 2000, com atuação em todo o território nacional.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`group cursor-pointer transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="h-full p-8 rounded-2xl backdrop-blur-lg bg-background/40 border border-border/50 shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
                <div className="w-20 h-20 mb-6 bg-gold-light/10 border border-gold-light/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-gold-light/20">
                  <card.icon className="w-10 h-10 text-gold-light transition-all duration-300" />
                </div>
                
                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-gold-light/10 border border-gold-light/20">
                  <span className="text-xs font-semibold text-gold-light">{card.badge}</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-semibold text-navy mb-3 tracking-tight font-serif">
                  {card.title}
                </h3>
                
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  {card.description}
                </p>
                
                <div className="flex items-center gap-2 text-gold-light font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>Explorar</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};