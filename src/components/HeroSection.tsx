import logoMota from "@/assets/logo-mota.png";

export const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center bg-orange pt-20"
    >
      <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col items-center justify-center">
        <div className="flex justify-center">
          <img
            src={logoMota}
            alt="Mota & Advogados Associados"
            className="h-[20rem] md:h-[28rem] lg:h-[36rem] xl:h-[44rem] w-auto drop-shadow-2xl animate-fade-in animate-float animate-glow"
          />
        </div>
      </div>
    </section>
  );
};
