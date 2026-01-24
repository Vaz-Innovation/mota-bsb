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

interface Area {
  icon: LucideIcon;
  title: string;
  description: string;
  fullDescription: string;
}

const areas: Area[] = [
  {
    icon: Users,
    title: "Direito Administrativo (Servidor Público)",
    description: "Defesa dos direitos e interesses dos servidores públicos",
    fullDescription: "Atuamos na defesa integral dos direitos dos servidores públicos federais, estaduais e municipais. Nossa equipe é especializada em processos administrativos disciplinares, revisão de aposentadorias, progressões funcionais, reenquadramentos, desvio de função, adicional de insalubridade e periculosidade, entre outras demandas relacionadas à carreira pública.",
  },
  {
    icon: Briefcase,
    title: "Direito do Trabalho Individual e Coletivo",
    description: "Reclamatórias trabalhistas e acompanhamento processual",
    fullDescription: "Oferecemos assessoria completa em questões trabalhistas, desde a elaboração de reclamatórias até o acompanhamento processual em todas as instâncias. Atuamos em casos de rescisão contratual, horas extras, assédio moral, acidentes de trabalho, e representamos tanto trabalhadores quanto empresas em negociações coletivas.",
  },
  {
    icon: Building,
    title: "Direito Sindical",
    description: "Assessoria completa para entidades sindicais",
    fullDescription: "Prestamos assessoria jurídica especializada para sindicatos e entidades de classe. Nossa atuação abrange desde a constituição e registro sindical até a representação em negociações coletivas, elaboração de convenções e acordos coletivos, e defesa dos interesses da categoria em instâncias administrativas e judiciais.",
  },
  {
    icon: Heart,
    title: "Direito Previdenciário",
    description: "Concessão e revisão de benefícios previdenciários",
    fullDescription: "Especializados em direito previdenciário, atuamos na concessão e revisão de aposentadorias (por idade, tempo de contribuição, especial), pensões por morte, auxílios (doença, acidente), BPC/LOAS, e demais benefícios junto ao INSS e regimes próprios de previdência.",
  },
  {
    icon: Scale,
    title: "Direito Constitucional",
    description: "Elaboração de ADI e recursos extraordinários",
    fullDescription: "Atuamos em questões constitucionais de alta complexidade, incluindo a elaboração e acompanhamento de Ações Diretas de Inconstitucionalidade (ADI), Arguições de Descumprimento de Preceito Fundamental (ADPF), e recursos extraordinários junto ao Supremo Tribunal Federal.",
  },
  {
    icon: Shield,
    title: "Direito Penal",
    description: "Habeas Corpus e recursos criminais",
    fullDescription: "Nossa equipe de direito penal atua em todas as fases do processo criminal, desde a investigação até os recursos em tribunais superiores. Oferecemos defesa técnica qualificada em crimes contra a administração pública, crimes econômicos, habeas corpus e revisões criminais.",
  },
  {
    icon: Vote,
    title: "Direito Eleitoral",
    description: "Assessoria eleitoral completa",
    fullDescription: "Prestamos assessoria eleitoral completa para candidatos, partidos políticos e coligações. Nossa atuação abrange registro de candidaturas, prestação de contas, propaganda eleitoral, representações e recursos junto à Justiça Eleitoral em todas as instâncias.",
  },
  {
    icon: Landmark,
    title: "Tribunais Superiores",
    description: "Atuação em Brasília junto aos Tribunais Superiores",
    fullDescription: "Com sede em Brasília, temos atuação direta e constante junto aos Tribunais Superiores: STF, STJ, TST, TSE e STM. Oferecemos acompanhamento processual presencial, sustentações orais e toda a expertise necessária para a condução de processos nas mais altas instâncias do Judiciário.",
  },
  {
    icon: Home,
    title: "Direito Imobiliário",
    description: "Assessoria completa em negócios e regularização imobiliária",
    fullDescription: "Atuamos em todas as questões relacionadas a imóveis: compra e venda, locação, usucapião, regularização fundiária, incorporações imobiliárias, condomínios, e resolução de conflitos envolvendo propriedades urbanas e rurais.",
  },
  {
    icon: UserPlus,
    title: "Direito de Família e Sucessões",
    description: "Inventários, divórcios, pensões e sucessões",
    fullDescription: "Oferecemos assessoria sensível e especializada em questões familiares: divórcios, guarda de filhos, pensão alimentícia, união estável, inventários, testamentos e planejamento sucessório. Buscamos sempre soluções que preservem os interesses e o bem-estar de todos os envolvidos.",
  },
  {
    icon: Gavel,
    title: "Fazenda Pública e Entes Federados",
    description: "Ações contra União, Estados, DF e Municípios",
    fullDescription: "Representamos clientes em ações contra a União, Estados, Distrito Federal e Municípios. Nossa experiência abrange desapropriações, responsabilidade civil do Estado, execuções contra a Fazenda Pública, precatórios e RPVs.",
  },
  {
    icon: Handshake,
    title: "Mediação e Conciliação",
    description: "Métodos alternativos de resolução de conflitos",
    fullDescription: "Acreditamos nos métodos alternativos de resolução de conflitos como forma eficiente e menos desgastante de solucionar disputas. Oferecemos serviços de mediação e conciliação conduzidos por profissionais capacitados, buscando acordos que atendam aos interesses de todas as partes.",
  },
  {
    icon: Calculator,
    title: "Direito Tributário e Empresarial",
    description: "Assessoria jurídica para empresas e matéria tributária",
    fullDescription: "Prestamos consultoria tributária e empresarial completa: planejamento fiscal, defesa em execuções fiscais, recuperação de créditos tributários, constituição e reestruturação societária, contratos empresariais e compliance corporativo.",
  },
];

export const PracticeAreasSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
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
                onClick={() => setSelectedArea(area)}
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

      {/* Modal */}
      <Dialog open={!!selectedArea} onOpenChange={() => setSelectedArea(null)}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              {selectedArea && (
                <div className="w-14 h-14 bg-gold-light/10 border border-gold-light/20 rounded-full flex items-center justify-center">
                  <selectedArea.icon className="w-7 h-7 text-gold-light" />
                </div>
              )}
              <DialogTitle className="text-xl font-serif text-navy">
                {selectedArea?.title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-base text-muted-foreground leading-relaxed">
              {selectedArea?.fullDescription}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};