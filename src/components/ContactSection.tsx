import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    phone: "",
    email: "",
    processNumber: "",
    message: "",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setStatusMessage("");

    try {
      // Register user in WordPress with source=brasilia
      const registerResponse = await fetch("/api/wordpress/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          source: "brasilia",
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok && registerData.code !== "existing_user_email") {
        throw new Error(registerData.error || "Erro ao registrar");
      }

      // Send message via WhatsApp
      const message = `Nome completo: ${formData.name}
CPF: ${formData.cpf}
Telefone: ${formData.phone}
E-mail: ${formData.email}
Número do processo: ${formData.processNumber || "Não informado"}

Mensagem: ${formData.message}`;

      const whatsappNumber = "5561984393925";
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
      
      setSubmitStatus("success");
      setStatusMessage("E-mail registrado com sucesso!");
      
      // Open WhatsApp after a short delay
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 500);

      // Reset form after success
      setFormData({
        name: "",
        cpf: "",
        phone: "",
        email: "",
        processNumber: "",
        message: "",
      });

    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Erro ao enviar. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-background to-navy/5"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="h-1 w-20 bg-gradient-gold mx-auto mb-6 rounded-full"></div>
          <h2
            className={`text-4xl md:text-6xl font-bold text-navy mb-6 tracking-tight font-serif transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {t("contact.title")}
          </h2>
          <p
            className={`text-lg md:text-xl text-muted-foreground leading-relaxed transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {t("contact.subtitle")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t("contact.address")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Map */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="rounded-2xl overflow-hidden shadow-lg h-full min-h-[400px]">
              <iframe
                src="https://maps.google.com/maps?q=Edif%C3%ADcio+Athenas+SGAS+902+Bras%C3%ADlia+DF&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do escritório"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="bg-card rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-navy mb-2 font-serif">
                {t("contact.form_title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("contact.form_subtitle")}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t("contact.name")}
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      CPF/CNPJ
                    </label>
                    <Input
                      type="text"
                      value={formData.cpf}
                      onChange={(e) =>
                        setFormData({ ...formData, cpf: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t("contact.phone")}
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t("contact.email")}
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t("contact.process_number")}
                  </label>
                  <Input
                    type="text"
                    value={formData.processNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, processNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t("contact.message")}
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={4}
                    required
                  />
                </div>

                {submitStatus !== "idle" && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      submitStatus === "success"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-gold hover:opacity-90 text-navy font-semibold h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enviando..." : t("contact.send")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
