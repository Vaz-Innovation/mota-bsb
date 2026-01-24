import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminNewCategory() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const generatedSlug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setSlug(generatedSlug);
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("categories").insert({
      name,
      slug,
    });

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Categoria criada com sucesso!" });
      navigate("/admin");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-light flex items-center justify-center">
        <div className="text-navy">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-light">
      <header className="bg-navy text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <h1 className="text-lg font-bold">Nova Categoria</h1>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={saving || !name}
            className="bg-white text-navy hover:bg-white/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nome da categoria"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              placeholder="nome-da-categoria"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </form>
      </main>
    </div>
  );
}
