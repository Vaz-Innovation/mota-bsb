import { useState, useEffect } from "react";
import { Menu, X, Search, Globe, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoHeader from "@/assets/logo-header.png";

const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#areas", label: "Áreas de Atuação" },
  { href: "#equipe", label: "Equipe" },
  { href: "#contato", label: "Contato" },
  { href: "#blog", label: "Blog" },
];

const languages = [
  { code: "PT", label: "Português" },
  { code: "ES", label: "Español" },
  { code: "EN", label: "English" },
  { code: "DE", label: "Deutsch" },
  { code: "IT", label: "Italiano" },
  { code: "FR", label: "Français" },
  { code: "ZH", label: "中文" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("PT");

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
          <a href="#inicio" className="flex items-center">
            <img
              src={logoHeader}
              alt="Mota & Advogados Associados"
              className="h-12 w-auto"
            />
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
            
            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-primary-foreground/90 hover:text-gold-light hover:bg-primary-foreground/10 gap-1"
                >
                  <Globe className="w-4 h-4" />
                  {currentLanguage}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-white border border-gray-200 shadow-lg z-[100] min-w-[160px]"
              >
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLanguage(lang.code)}
                    className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                      currentLanguage === lang.code 
                        ? "text-orange-500 font-semibold" 
                        : "text-gray-700"
                    }`}
                  >
                    <span className={`font-bold mr-2 ${
                      currentLanguage === lang.code ? "text-orange-500" : "text-navy"
                    }`}>
                      {lang.code}
                    </span>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
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
              
              {/* Mobile Language Selector */}
              <div className="border-t border-primary-foreground/20 pt-4 mt-2">
                <p className="text-primary-foreground/60 text-sm mb-2">Idioma</p>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setCurrentLanguage(lang.code)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        currentLanguage === lang.code
                          ? "bg-gold-light text-navy font-semibold"
                          : "bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20"
                      }`}
                    >
                      {lang.code}
                    </button>
                  ))}
                </div>
              </div>
              
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
