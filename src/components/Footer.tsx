import { MapPin, Phone, Mail, Clock } from "lucide-react";
import logoGold from "@/assets/logo-gold.png";

export const Footer = () => {
  return (
    <footer className="bg-navy py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={logoGold}
                alt="Mota & Advogados"
                className="h-14 w-auto"
              />
              <span className="text-primary-foreground font-serif font-bold text-xl">
                Mota & Advogados
              </span>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed mb-6">
              Desde 2000, oferecemos soluções jurídicas com excelência, ética e resultados, atuando em todo o território nacional.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-primary-foreground font-semibold mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              {["Início", "Sobre", "Áreas de Atuação", "Equipe", "Contato", "Blog"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-primary-foreground/70 hover:text-gold-light transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-primary-foreground font-semibold mb-4">
              Contato
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-gold-light" />
                <span>Porto Alegre, RS</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="w-5 h-5 flex-shrink-0 text-gold-light" />
                <span>(51) 98198-1210</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Mail className="w-5 h-5 flex-shrink-0 text-gold-light" />
                <span>contato@mota.adv.br</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Clock className="w-5 h-5 flex-shrink-0 text-gold-light" />
                <span>Seg - Sex: 9h às 18h</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Mota & Advogados Associados. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};