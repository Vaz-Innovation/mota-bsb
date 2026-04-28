import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { z } from "zod";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const NewsletterSection = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect(() => {
  //   // Load Beehiiv embed script
  //   const script = document.createElement("script");
  //   script.src = "https://subscribe-forms.beehiiv.com/embed.js";
  //   script.async = true;
  //   document.body.appendChild(script);

  //   // Load Beehiiv attribution script
  //   const attributionScript = document.createElement("script");
  //   attributionScript.src =
  //     "https://subscribe-forms.beehiiv.com/attribution.js";
  //   attributionScript.type = "text/javascript";
  //   attributionScript.async = true;
  //   document.body.appendChild(attributionScript);

  //   return () => {
  //     // Cleanup scripts on unmount
  //     document.body.removeChild(script);
  //     document.body.removeChild(attributionScript);
  //   };
  // }, []);

  const newsLetterSchema = z.object({
    email: z.string().trim().email(t("newsletter.errorMessage")),
    source: z.string(),
  });

  type NewsletterFormData = z.infer<typeof newsLetterSchema>;

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsLetterSchema),
    defaultValues: {
      email: "",
      source: "brasilia",
    },
  });

  const handleSubmit = async (payload: NewsletterFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/wordpress/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed");
      }

      toast({ title: t("newsletter.success") });
      form.reset();
      router.push("/blog");
    } catch (err: any) {
      toast({
        title: t("newsletter.error"),
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

          <div className="flex justify-center p-12">
            {/* <iframe
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
            /> */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit, () => {
                  const message = form.formState.errors.email?.message;
                  toast({
                    title: t("newsletter.error"),
                    description: message
                      ? String(message)
                      : t("newsletter.errorMessage"),
                    variant: "destructive",
                  });
                })}
                className="flex border rounded-md border-accent max-w-md w-full"
              >
                <Input
                  className="rounded-md rounded-tr-none rounded-br-none p-3 h-auto"
                  placeholder={t("newsletter.placeholder")}
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  {...form.register("email")}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md rounded-tl-none bg-black hover:bg-black p-3 size-auto"
                >
                  {isSubmitting
                    ? t("newsletter.sending")
                    : t("newsletter.button")}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};
