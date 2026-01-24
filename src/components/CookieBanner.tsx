import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card rounded-lg shadow-2xl border border-border p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              {t("cookie.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("cookie.description")}
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={handleReject}
              className="flex-1 md:flex-none"
            >
              {t("cookie.reject")}
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1 md:flex-none bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {t("cookie.accept")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
