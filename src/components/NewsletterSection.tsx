import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Sucesso! Agora verifique seu e-mail para confirmar sua inscrição.");
    setEmail("");
  };

  return (
    <section className="py-20 bg-navy">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 font-serif">
            Fique por Dentro
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Cadastre-se na newsletter e receba dicas jurídicas e novidades do escritório.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
            />
            <Button
              type="submit"
              className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Inscrever
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
