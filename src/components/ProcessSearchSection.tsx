import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const ProcessSearchSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [processNumber, setProcessNumber] = useState("");
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-background to-navy/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div
            className="bg-card border border-border rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-light/10">
                  <Search className="w-8 h-8 text-gold-light" />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-navy font-serif">
                    {t("process.title")}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {t("process.subtitle")}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-8 h-8 text-gold-light transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {isOpen && (
            <div className="mt-4 bg-card border border-border rounded-lg shadow-lg p-8 animate-fade-in">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder={t("process.placeholder")}
                  value={processNumber}
                  onChange={(e) => setProcessNumber(e.target.value)}
                  className="h-12 text-lg"
                />
                <Button className="w-full h-12 bg-gradient-gold hover:opacity-90 text-navy font-semibold">
                  {t("process.button")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
