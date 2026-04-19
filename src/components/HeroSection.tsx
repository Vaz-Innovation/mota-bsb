import Image from "next/image";
import logoHero from "@/assets/logo-hero.png";

export const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center bg-navy pt-20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-deep to-navy opacity-90"></div>
      
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-beige/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-beige/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <Image
            src={logoHero}
            alt="Mota & Advogados Associados"
            className="w-full max-w-none px-4 md:px-8 lg:px-16 h-auto drop-shadow-2xl animate-fade-in scale-[3] md:scale-[4] lg:scale-[5]"
            priority
          />
        </div>
      </div>
    </section>
  );
};