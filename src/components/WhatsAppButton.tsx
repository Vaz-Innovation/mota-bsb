import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  return (
    <button
      onClick={(e) => e.preventDefault()}
      disabled
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </button>
  );
};
