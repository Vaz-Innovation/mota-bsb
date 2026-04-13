import { MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  
  const quickLinks = [
    { key: "nav.home", href: "#inicio" },
    { key: "nav.about", href: "#sobre" },
    { key: "nav.practice_areas", href: "#areas" },
    { key: "nav.team", href: "#equipe" },
    { key: "nav.contact", href: "#contato" },
    { key: "trabalhe_conosco" as any, href: "/trabalhe-conosco" },
    { key: "intranet" as any, href: "https://dev.motaeadvogados.com.br", external: true },
  ];

  return (
    <footer className="bg-navy py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Quick Links */}
          <div>
            <h3 className="text-beige font-semibold mb-6">
              {t("footer.quick_links")}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="text-primary-foreground/80 hover:text-beige transition-colors text-sm"
                  >
                    {link.key === "intranet" ? "Intranet" : link.key === "trabalhe_conosco" ? "Trabalhe Conosco" : t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-beige font-semibold mb-6">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-3 text-primary-foreground/80 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary-foreground/80" />
                <div>
                  <p>SGAS 902, lote 74, Bloco B</p>
                  <p>Salas 102 a 112 - Ed. Athenas</p>
                  <p>Brasília - DF - CEP 70390-020</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary-foreground/80" />
                <span>(61) 3226-4025</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary-foreground/80" />
                <span>contato@mota.adv.br</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-beige font-semibold mb-6">
              {t("footer.social")}
            </h3>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/mota-&-advogados-associados/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-beige transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Mota & Advogados Associados. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};
