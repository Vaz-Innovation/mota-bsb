import { useEffect, useState, useRef } from "react";

const stats = [
  { value: 25, suffix: "+", label: "Anos de Experiência" },
  { value: 5000, suffix: "+", label: "Clientes Atendidos" },
  { value: 98, suffix: "%", label: "Taxa de Sucesso" },
  { value: 10000, suffix: "+", label: "Casos Resolvidos" },
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
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-light rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-light rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
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
  label,
  isVisible,
}: {
  value: number;
  suffix: string;
  label: string;
  isVisible: boolean;
}) => {
  const count = useCountUp(value, 2000, isVisible);

  return (
    <div className="text-center">
      <div className="mb-3">
        <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground block">
          {count.toLocaleString()}
          <span className="text-gold-light">{suffix}</span>
        </span>
      </div>
      <p className="text-primary-foreground/80 text-sm md:text-base font-medium">
        {label}
      </p>
    </div>
  );
};