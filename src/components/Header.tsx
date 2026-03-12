import { useState, useEffect } from "react";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/i18n/translations";
import logoHeader from "@/assets/logo-header.png";

const languages: { code: Language; label: string }[] = [
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
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  
  // Always show solid header on non-home pages
  const isHomePage = location.pathname === "/";
  const showSolidHeader = !isHomePage || isScrolled;

  const navLinks = [
    { href: "/", label: t("nav.home"), isRoute: true },
    { href: "/#sobre", label: t("nav.about"), isRoute: true },
    { href: "/#areas", label: t("nav.practice_areas"), isRoute: true },
    { href: "/#equipe", label: t("nav.team"), isRoute: true },
    { href: "/#contato", label: t("nav.contact"), isRoute: true },
    { href: "/blog", label: t("nav.blog"), isRoute: true },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If we're on homepage and clicking a section link
    if (isHomePage && href.startsWith("/#")) {
      e.preventDefault();
      const sectionId = href.substring(2); // Remove "/#"
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

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
        showSolidHeader
          ? "bg-navy py-2 shadow-lg"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logoHeader}
              alt="Mota & Advogados Associados"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-primary-foreground/90 hover:text-beige transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-primary-foreground/90 hover:text-beige hover:bg-primary-foreground/10 gap-1"
                >
                  <Globe className="w-4 h-4" />
                  {language}
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
                    onClick={() => setLanguage(lang.code)}
                    className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                      language === lang.code 
                        ? "text-[#0a1639] font-semibold" 
                        : "text-gray-700"
                    }`}
                  >
                    <span className={`font-bold mr-2 ${
                      language === lang.code ? "text-[#0a1639]" : "text-navy"
                    }`}>
                      {lang.code}
                    </span>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <a href="https://api.whatsapp.com/send?phone=5561984393925" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-gold hover:opacity-90 text-navy font-semibold px-6">
                {t("header.contact_us")}
              </Button>
            </a>
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
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-primary-foreground/90 hover:text-beige transition-colors font-medium"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="border-t border-primary-foreground/20 pt-4 mt-2">
                <p className="text-primary-foreground/60 text-sm mb-2">{t("header.language")}</p>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        language === lang.code
                          ? "bg-navy text-white font-semibold"
                          : "bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20"
                      }`}
                    >
                      {lang.code}
                    </button>
                  ))}
                </div>
              </div>
              
              <a href="https://api.whatsapp.com/send?phone=5561984393925" target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-gold hover:opacity-90 text-navy font-semibold mt-4">
                  {t("header.contact_us")}
                </Button>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
