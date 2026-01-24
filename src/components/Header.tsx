import { useState, useEffect } from "react";
import { Menu, X, Search, Globe, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoGold from "@/assets/logo-gold.png";
import logoWhite from "@/assets/logo-white.png";

const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#areas", label: "Áreas de Atuação" },
  { href: "#equipe", label: "Equipe" },
  { href: "#contato", label: "Contato" },
  { href: "#blog", label: "Blog" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-navy py-2 shadow-lg"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3">
            <img
              src={logoGold}
              alt="Mota & Advogados"
              className="h-10 w-auto"
            />
            <span className="text-primary-foreground font-serif font-bold text-lg hidden sm:block">
              Mota & Advogados
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-primary-foreground/90 hover:text-gold-light transition-colors font-medium text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="text-primary-foreground/80 hover:text-gold-light transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            <Button
              variant="ghost"
              className="text-primary-foreground/90 hover:text-gold-light hover:bg-primary-foreground/10"
            >
              <User className="w-4 h-4 mr-2" />
              Acessos
            </Button>
            
            <Button
              variant="ghost"
              className="text-primary-foreground/90 hover:text-gold-light hover:bg-primary-foreground/10"
            >
              <Globe className="w-4 h-4 mr-2" />
              PT
            </Button>
            
            <Button className="bg-gradient-gold hover:opacity-90 text-navy font-semibold px-6">
              Fale Conosco
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-primary-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-primary-foreground/20">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-primary-foreground/90 hover:text-gold-light transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button className="bg-gradient-gold hover:opacity-90 text-navy font-semibold mt-4">
                Fale Conosco
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};