import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("newsletter.success"));
    setEmail("");
  };

  return (
    <section className="py-20 bg-navy-deep">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 font-serif">
            {t("newsletter.title")}
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            {t("newsletter.subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t("newsletter.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
            />
            <Button
              type="submit"
              className="h-12 px-8 bg-gradient-gold hover:opacity-90 text-navy font-semibold"
            >
              {t("newsletter.button")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
