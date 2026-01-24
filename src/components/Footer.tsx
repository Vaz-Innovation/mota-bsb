import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logoFooter from "@/assets/logo-footer.png";

export const Footer = () => {
  const { t } = useLanguage();
  
  const quickLinks = [
    { key: "nav.home", href: "#inicio" },
    { key: "nav.about", href: "#sobre" },
    { key: "nav.practice_areas", href: "#areas" },
    { key: "nav.team", href: "#equipe" },
    { key: "nav.contact", href: "#contato" },
    { key: "nav.blog", href: "#blog" },
  ] as const;

  return (
    <footer className="bg-navy py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <img
                src={logoFooter}
                alt="Mota & Advogados Associados"
                className="h-20 w-auto"
              />
            </div>
            <p className="text-primary-foreground/70 leading-relaxed mb-6">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-primary-foreground font-semibold mb-4">
              {t("footer.quick_links")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-gold-light transition-colors"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-primary-foreground font-semibold mb-4">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-gold-light" />
                <span>Brasília, DF</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="w-5 h-5 flex-shrink-0 text-gold-light" />
                <span>(61) 3226-4025</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Mail className="w-5 h-5 flex-shrink-0 text-gold-light" />
                <span>contato@mota.adv.br</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Clock className="w-5 h-5 flex-shrink-0 text-gold-light" />
                <span>{t("footer.hours")}</span>
              </li>
            </ul>
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
