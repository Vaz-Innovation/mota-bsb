import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationKey } from "@/i18n/translations";

interface StatData {
  value: number;
  suffix: string;
  labelKey: TranslationKey;
}

const statsData: StatData[] = [
  { value: 26, suffix: "+", labelKey: "stats.years" },
  { value: 223000, suffix: "+", labelKey: "stats.clients" },
  { value: 95, suffix: "%", labelKey: "stats.success_rate" },
  { value: 211850, suffix: "+", labelKey: "stats.cases" },
];

const useCountUp = (end: number, duration: number = 2000, start: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
};

export const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-navy-deep relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-beige rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-beige rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {statsData.map((stat, index) => (
            <StatItem key={index} {...stat} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StatItem = ({
  value,
  suffix,
  labelKey,
  isVisible,
}: {
  value: number;
  suffix: string;
  labelKey: TranslationKey;
  isVisible: boolean;
}) => {
  const count = useCountUp(value, 2000, isVisible);
  const { t } = useLanguage();

  return (
    <div className="text-center">
      <div className="mb-3">
        <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground block">
          {count.toLocaleString()}
          <span className="text-beige">{suffix}</span>
        </span>
      </div>
      <p className="text-primary-foreground/80 text-sm md:text-base font-medium">
        {t(labelKey)}
      </p>
    </div>
  );
};
