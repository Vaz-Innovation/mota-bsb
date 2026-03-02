import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Link2, Upload, Loader2, Languages } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
}

export default function AdminEditPost() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [generatingTranslations, setGeneratingTranslations] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchCategories();
    if (id) fetchPost();
  }, [id]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    
    if (!isAdmin) {
      navigate("/auth");
    }
  };

  const fetchPost = async () => {
    setLoadingPost(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Post não encontrado",
          description: "O post solicitado não existe.",
          variant: "destructive",
        });
        navigate("/admin");
        return;
      }

      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt || "");
      setContent(data.content);
      setCategoryId(data.category_id || "");
      setTags(data.tags?.join(", ") || "");
      setMetaTitle(data.meta_title || "");
      setMetaDescription(data.meta_description || "");
      setImageUrl(data.image_url || "");
      setIsDraft(data.status === "draft");
      setImportUrl((data as any).source_url || "");
    } catch (error: any) {
      toast({
        title: "Erro ao carregar",
        description: error.message || "Não foi possível carregar o post.",
        variant: "destructive",
      });
      navigate("/admin");
    } finally {
      setLoadingPost(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");
    if (data) setCategories(data);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  const handleImportUrl = async () => {
    if (!importUrl.trim()) {
      toast({
        title: "URL necessária",
        description: "Digite a URL do artigo para importar.",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("import-article", {
        body: { url: importUrl },
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        const article = data.data;
        setTitle(article.title || "");
        setSlug(generateSlug(article.title || ""));
        setExcerpt(article.excerpt || "");
        setContent(article.content || "");
        setTags(article.tags?.join(", ") || "");
        setMetaTitle(article.metaTitle || "");
        setMetaDescription(article.metaDescription || "");

        toast({
          title: "Importado com sucesso!",
          description: "O conteúdo foi preenchido automaticamente.",
        });
      } else {
        throw new Error(data?.error || "Falha ao importar");
      }
    } catch (error: any) {
      console.error("Import error:", error);
      let errorMessage = "Não foi possível importar o artigo.";
      
      if (error.message?.includes("Rate limit")) {
        errorMessage = "Limite de requisições excedido. Aguarde um momento e tente novamente.";
      } else if (error.message?.includes("credits")) {
        errorMessage = "Créditos de IA esgotados. Adicione mais créditos.";
      }
      
      toast({
        title: "Erro na importação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast({
        title: "Imagem carregada!",
        description: "A imagem foi enviada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível enviar a imagem.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !slug.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título, slug e conteúdo.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title,
          slug,
          excerpt: excerpt || null,
          content,
          category_id: categoryId || null,
          tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
          meta_title: metaTitle || null,
          meta_description: metaDescription || null,
          image_url: imageUrl || null,
          status: isDraft ? "draft" : "published",
          source_url: importUrl.trim() || null,
        } as any)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Post atualizado!",
        description: `O post foi ${isDraft ? "salvo como rascunho" : "publicado"} com sucesso.`,
      });

      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível atualizar o post.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTranslations = async () => {
    if (!id) return;
    
    setGeneratingTranslations(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-translations", {
        body: { postId: id },
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Traduções geradas!",
          description: `${data.translatedLanguages} idiomas traduzidos com sucesso.`,
        });
      } else {
        throw new Error(data?.error || "Erro ao gerar traduções");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao gerar traduções",
        description: error.message || "Não foi possível gerar as traduções.",
        variant: "destructive",
      });
    } finally {
      setGeneratingTranslations(false);
    }
  };

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-navy text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="font-bold text-lg">Editar Post</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="draft"
                checked={isDraft}
                onCheckedChange={setIsDraft}
              />
              <Label htmlFor="draft" className="text-white text-sm">
                Rascunho
              </Label>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-white text-navy hover:bg-white/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Import Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-gold">
              <div className="flex items-center gap-2 text-gold mb-2">
                <Link2 className="h-5 w-5" />
                <h3 className="font-semibold">Importar de URL</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Cole o link de um artigo para substituir o conteúdo com IA
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://exemplo.com/artigo"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleImportUrl}
                  disabled={importing}
                  className="bg-navy hover:bg-navy/90"
                >
                  {importing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    "Importar"
                  )}
                </Button>
              </div>
            </div>

            {/* Generate Translations Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-emerald-500">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <Languages className="h-5 w-5" />
                <h3 className="font-semibold">Traduções Automáticas</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Gere traduções do conteúdo para EN, ES, DE, IT, FR e ZH usando IA
              </p>
              <Button
                type="button"
                onClick={handleGenerateTranslations}
                disabled={generatingTranslations}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {generatingTranslations ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando traduções...
                  </>
                ) : (
                  <>
                    <Languages className="h-4 w-4 mr-2" />
                    Gerar Traduções
                  </>
                )}
              </Button>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-navy mb-6">Conteúdo</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Título do artigo"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    placeholder="titulo-do-artigo"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL: /blog/{slug || "titulo-do-artigo"}
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt">Resumo</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Breve resumo do artigo (aparece na listagem)"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {excerpt.length}/300 caracteres
                  </p>
                </div>

                <div>
                  <Label htmlFor="content">Conteúdo *</Label>
                  <Textarea
                    id="content"
                    placeholder="Escreva o conteúdo do artigo... (suporta HTML)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    className="font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Você pode usar HTML para formatação (h2, h3, p, ul, li, strong, em, a, etc.)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-navy mb-4">Imagem Destacada</h3>
              
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingImage ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Carregar imagem</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>

                <div>
                  <Label htmlFor="imageUrl">Ou cole a URL</Label>
                  <Input
                    id="imageUrl"
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
            </div>

            {/* Organization */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-navy mb-4">Organização</h3>
              
              <div className="space-y-4">
                <div>
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

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="direito, legislação, STF"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separe as tags por vírgula
                  </p>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-navy mb-4">SEO</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Título</Label>
                  <Input
                    id="metaTitle"
                    placeholder="Título para mecanismos de busca"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {metaTitle.length}/60 caracteres
                  </p>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Descrição</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="Descrição para mecanismos de busca"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {metaDescription.length}/160 caracteres
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
