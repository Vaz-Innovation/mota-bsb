import logoWhite from "@/assets/logo-white.png";

export const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center bg-navy pt-20"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-deep to-navy opacity-90"></div>
      
      {/* Decorative gold accents */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-gold-light/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-gold-light/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <img
            src={logoWhite}
            alt="Mota & Advogados Associados"
            className="h-[16rem] md:h-[22rem] lg:h-[28rem] xl:h-[34rem] w-auto drop-shadow-2xl animate-fade-in animate-float animate-glow mb-8"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary-foreground mb-4 animate-fade-in">
            Mota & Advogados Associados
          </h1>
          <p className="text-lg md:text-xl text-beige/80 max-w-2xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Excelência jurídica com ética e resultados
          </p>
        </div>
      </div>
    </section>
  );
};