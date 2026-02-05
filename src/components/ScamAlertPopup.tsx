import { useState, useEffect } from "react";
import { X, AlertTriangle, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import scamExampleImage from "@/assets/scam-example.png";

export const ScamAlertPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem("scamAlertSeen");
    if (!hasSeenPopup) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("scamAlertSeen", "true");
    setIsOpen(false);
  };

  const handleWhatsApp = () => {
    window.open(
      "https://api.whatsapp.com/send?phone=5561995362668&text=Ol%C3%A1!%20Gostaria%20de%20entender%20melhor%20sobre%20o%20golpe%20em%20circula%C3%A7%C3%A3o.",
      "_blank"
    );
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl text-destructive">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <span>Atenção: mensagem falsa em circulação</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm sm:text-base">
          <p className="text-foreground leading-relaxed">
            Estão sendo enviadas mensagens em nome do{" "}
            <strong>SINDIFISCO NACIONAL</strong> informando sobre suposta
            liberação de valores judiciais.
          </p>

          <div className="space-y-2">
            <p className="text-foreground font-medium">
              Para ajudar você a identificar, veja abaixo um exemplo da mensagem
              falsa que está sendo enviada:
            </p>

            <div className="rounded-lg overflow-hidden border border-border">
              <img
                src={scamExampleImage}
                alt="Exemplo de mensagem falsa do golpe"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
