import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const NewsletterSection = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Load Beehiiv embed script
    const script = document.createElement("script");
    script.src = "https://subscribe-forms.beehiiv.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    // Load Beehiiv attribution script
    const attributionScript = document.createElement("script");
    attributionScript.src = "https://subscribe-forms.beehiiv.com/attribution.js";
    attributionScript.type = "text/javascript";
    attributionScript.async = true;
    document.body.appendChild(attributionScript);

    return () => {
      // Cleanup scripts on unmount
      document.body.removeChild(script);
      document.body.removeChild(attributionScript);
    };
  }, []);

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

          <div className="flex justify-center">
            <iframe
              src="https://subscribe-forms.beehiiv.com/ab9d5704-ee39-4879-8564-1bad699ec4fa"
              className="beehiiv-embed"
              data-test-id="beehiiv-embed"
              frameBorder="0"
              scrolling="no"
              style={{
                width: "560px",
                height: "207px",
                margin: 0,
                borderRadius: "0px",
                backgroundColor: "transparent",
                boxShadow: "none",
                maxWidth: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
