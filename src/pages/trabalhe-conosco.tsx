import { useState } from "react";
import Link from "next/link";
import { Building2, FileText, Users, User, Mail, Phone, Briefcase, Building, MessageSquare, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

const TrabalheConosco = () => {
  const { t } = useLanguage();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cargo, setCargo] = useState("");
  const [area, setArea] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*Candidatura - Trabalhe Conosco*%0A%0A` +
      `*Nome:* ${encodeURIComponent(nome)}%0A` +
      `*E-mail:* ${encodeURIComponent(email)}%0A` +
      `*Telefone:* ${encodeURIComponent(telefone)}%0A` +
      `*Cargo:* ${encodeURIComponent(cargo)}%0A` +
      `*Área de Interesse:* ${encodeURIComponent(area)}%0A` +
      `*Mensagem:* ${encodeURIComponent(mensagem)}`;
    window.open(`https://wa.me/5561984393925?text=${text}`, "_blank");
  };

  const benefits = [
    {
      icon: Building2,
      title: t("trabalheConosco.benefits.collaborativeTitle"),
      description: t("trabalheConosco.benefits.collaborativeDesc"),
    },
    {
      icon: FileText,
      title: t("trabalheConosco.benefits.challengingTitle"),
      description: t("trabalheConosco.benefits.challengingDesc"),
    },
    {
      icon: Users,
      title: t("trabalheConosco.benefits.growthTitle"),
      description: t("trabalheConosco.benefits.growthDesc"),
    },
  ];

  const cargos = [
    t("trabalheConosco.roles.lawyer"),
    t("trabalheConosco.roles.intern"),
    t("trabalheConosco.roles.adminAssistant"),
    t("trabalheConosco.roles.correspondentLawyer"),
    t("trabalheConosco.roles.partnerLawyer"),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO title={t("trabalheConosco.heroTitle") || "Trabalhe Conosco"} />
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[hsl(var(--beige)/0.3)] to-background pt-32 pb-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy mb-4">
            {t("trabalheConosco.heroTitle")}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("trabalheConosco.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-navy text-center mb-10">
            {t("trabalheConosco.whyTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((b) => (
              <div key={b.title} className="border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <b.icon className="w-10 h-10 mx-auto mb-4 text-gold" />
                <h3 className="font-semibold text-navy mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="border border-border rounded-xl p-8">
            <h2 className="font-serif text-2xl font-bold text-navy text-center mb-8">
              {t("trabalheConosco.formTitle")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1.5">
                  <User className="w-4 h-4 text-gold" /> {t("trabalheConosco.fields.nameLabel")}
                </label>
                <Input placeholder={t("trabalheConosco.fields.namePlaceholder")} value={nome} onChange={(e) => setNome(e.target.value)} required />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1.5">
                  <Mail className="w-4 h-4 text-gold" /> {t("trabalheConosco.fields.emailLabel")}
                </label>
                <Input type="email" placeholder={t("trabalheConosco.fields.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1.5">
                  <Phone className="w-4 h-4 text-gold" /> {t("trabalheConosco.fields.phoneLabel")}
                </label>
                <Input placeholder={t("trabalheConosco.fields.phonePlaceholder")} value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1.5">
                  <Briefcase className="w-4 h-4 text-gold" /> {t("trabalheConosco.fields.roleLabel")}
                </label>
                <Select value={cargo} onValueChange={setCargo}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("trabalheConosco.fields.rolePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {cargos.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1.5">
                  <Building className="w-4 h-4 text-gold" /> {t("trabalheConosco.fields.interestAreaLabel")}
                </label>
                <Input placeholder={t("trabalheConosco.fields.interestAreaPlaceholder")} value={area} onChange={(e) => setArea(e.target.value)} />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1.5">
                  <MessageSquare className="w-4 h-4 text-gold" /> {t("trabalheConosco.fields.messageLabel")}
                </label>
                <Textarea
                  placeholder={t("trabalheConosco.fields.messagePlaceholder")}
                  rows={5}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                />
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                <Upload className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
                <div>
                  <span className="font-medium text-navy">{t("trabalheConosco.resumeBox.title")}</span>
                  <p>{t("trabalheConosco.resumeBox.description")}</p>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-primary-foreground font-semibold py-6 text-base">
                {t("trabalheConosco.submit")}
              </Button>
            </form>
          </div>
          <div className="text-center mt-8">
            <Link href="/" className="inline-block border border-navy text-navy px-6 py-2 rounded hover:bg-navy hover:text-primary-foreground transition-colors text-sm">
              {t("trabalheConosco.backHome")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrabalheConosco;
