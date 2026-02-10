import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-default opacity-60"
      aria-label="Contato via WhatsApp (indisponível)"
      disabled
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </button>
  );
};
