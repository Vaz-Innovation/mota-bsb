import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoNavy from "@/assets/logo-navy.png";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Redirect based on admin status after login/signup
  const handleRedirect = () => {
    // After auth, redirect to home - admin will be verified there
    navigate("/");
  };
  const { toast } = useToast();

  const withTimeout = async <T,>(promise: Promise<T>, ms: number): Promise<T> => {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("Tempo limite ao autenticar. Tente novamente.")), ms),
      ),
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await withTimeout(signIn(email, password), 15000);
        if (error) throw error;
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando...",
        });
        // Navigate after a small delay to ensure auth state updates
        setLoading(false);
        setTimeout(() => {
          navigate("/admin");
        }, 100);
      } else {
        const { error } = await withTimeout(signUp(email, password), 15000);
        if (error) throw error;
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao site!",
        });
        setLoading(false);
        setTimeout(() => {
          navigate("/admin");
        }, 100);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logoNavy} alt="Logo" className="h-12" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-navy text-center mb-2 font-serif">
            Área Administrativa
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Acesse o painel de gerenciamento do blog
          </p>

          {/* Tabs */}
          <div className="flex rounded-lg bg-muted p-1 mb-6">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin
                  ? "bg-white shadow-sm text-navy"
                  : "text-muted-foreground hover:text-navy"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Entrar
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin
                  ? "bg-white shadow-sm text-navy"
                  : "text-muted-foreground hover:text-navy"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Cadastrar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-navy hover:bg-navy-deep text-white"
              disabled={loading}
            >
              {loading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
            </Button>
          </form>

          {/* Back Link */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground hover:text-navy transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}
