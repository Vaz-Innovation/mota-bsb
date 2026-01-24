import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Upload, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
}

export default function AdminNewPost() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/");
      }
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Auto-generate slug from title
    const generatedSlug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setSlug(generatedSlug);
  }, [title]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Erro ao fazer upload",
        description: uploadError.message,
        variant: "destructive",
      });
    } else {
      const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    }

    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const { error } = await supabase.from("blog_posts").insert({
      title,
      slug,
      excerpt,
      content,
      image_url: imageUrl || null,
      category_id: categoryId || null,
      tags: tagsArray.length > 0 ? tagsArray : null,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      status: isDraft ? "draft" : "published",
      author_id: user.id,
    });

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Post criado com sucesso!" });
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
      {/* Header */}
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
            <h1 className="text-lg font-bold">Novo Post</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="draft"
                checked={isDraft}
                onCheckedChange={setIsDraft}
              />
              <Label htmlFor="draft" className="text-white">
                Rascunho
              </Label>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={saving || !title || !content}
              className="bg-white text-navy hover:bg-white/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Import URL (placeholder) */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-gold-light mb-2">
                <LinkIcon className="w-5 h-5" />
                <span className="font-medium">Importar de URL</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Cole o link de um artigo para preencher automaticamente com IA
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://exemplo.com/artigo"
                  className="flex-1"
                  disabled
                />
                <Button variant="secondary" disabled>
                  Importar
                </Button>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-navy">Conteúdo</h2>

              <div className="space-y-2">
                <Label htmlFor="title">
                  Título <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Título do artigo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug (URL) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="slug"
                  placeholder="titulo-do-artigo"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  URL: /blog/{slug || "titulo-do-artigo"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Breve resumo do artigo (aparece na listagem)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground text-right">
                  {excerpt.length}/300 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">
                  Conteúdo <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Escreva o conteúdo do artigo... (suporta HTML)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                  required
                />
                <p className="text-sm text-gold-light">
                  Você pode usar HTML para formatação (h2, h3, p, ul, li, strong, em, a, etc.)
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-navy">Imagem Destacada</h3>

              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {uploading ? "Enviando..." : "Carregar imagem"}
                  </span>
                </label>
              </div>

              <div className="space-y-2">
                <Label>Ou cole a URL</Label>
                <Input
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Organization */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-navy">Organização</h3>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="direito, legislação, STF"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <p className="text-sm text-gold-light">Separe as tags por vírgula</p>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-bold text-navy">SEO</h3>
                <p className="text-sm text-muted-foreground">
                  Otimização para mecanismos de busca
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Título</Label>
                <Input
                  id="metaTitle"
                  placeholder="Título para SEO"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
                <p className="text-sm text-muted-foreground text-right">
                  {metaTitle.length}/60 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Descrição</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Descrição para SEO"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground text-right">
                  {metaDescription.length}/160 caracteres
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
