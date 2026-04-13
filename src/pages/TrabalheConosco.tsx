import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, FileText, Users, User, Mail, Phone, Briefcase, Building, MessageSquare, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const benefits = [
  {
    icon: Building2,
    title: "Ambiente Colaborativo",
    description: "Trabalhe em uma equipe que valoriza a colaboração e o desenvolvimento profissional.",
  },
  {
    icon: FileText,
    title: "Casos Desafiadores",
    description: "Participe de casos complexos e relevantes em diversas áreas do direito.",
  },
  {
    icon: Users,
    title: "Crescimento Profissional",
    description: "Desenvolva sua carreira em um escritório com tradição e excelência jurídica.",
  },
];

const cargos = [
  "Advogado(a) Júnior",
  "Advogado(a) Pleno",
  "Advogado(a) Sênior",
  "Estagiário(a) de Direito",
  "Assistente Administrativo",
  "Outro",
];

const TrabalheConosco = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[hsl(var(--beige)/0.3)] to-background pt-32 pb-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy mb-4">
            Trabalhe Conosco
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Junte-se a nós e construa o futuro da advocacia com ética, inovação e compromisso com resultados.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-navy text-center mb-10">
            Por que trabalhar conosco?
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
              Envie sua Candidatura
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1.5">
                  <User className="w-4 h-4 text-gold" /> Nome Completo
                </label>
                <Input placeholder="Seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1.5">
                  <Mail className="w-4 h-4 text-gold" /> E-mail
                </label>
                <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1.5">
                  <Phone className="w-4 h-4 text-gold" /> Telefone
                </label>
                <Input placeholder="(00) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1.5">
                  <Briefcase className="w-4 h-4 text-gold" /> Cargo
                </label>
                <Select value={cargo} onValueChange={setCargo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo desejado" />
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
                  <Building className="w-4 h-4 text-gold" /> Área de Interesse
                </label>
                <Input placeholder="Ex: Direito Civil, Direito Trabalhista, etc." value={area} onChange={(e) => setArea(e.target.value)} />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1.5">
                  <MessageSquare className="w-4 h-4 text-gold" /> Mensagem / Experiência Profissional
                </label>
                <Textarea
                  placeholder="Conte-nos sobre sua experiência e por que deseja trabalhar conosco..."
                  rows={5}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                />
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                <Upload className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
                <div>
                  <span className="font-medium text-navy">Envio de Currículo</span>
                  <p>Após enviar este formulário, você será redirecionado ao WhatsApp onde poderá anexar seu currículo.</p>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-primary-foreground font-semibold py-6 text-base">
                Enviar
              </Button>
            </form>
          </div>
          <div className="text-center mt-8">
            <Link to="/" className="inline-block border border-navy text-navy px-6 py-2 rounded hover:bg-navy hover:text-primary-foreground transition-colors text-sm">
              Voltar para Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrabalheConosco;
