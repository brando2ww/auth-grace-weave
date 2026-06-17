import { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Pencil, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  moderator: "Moderador",
  user: "Usuário",
};

const PerfilPage = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCpfCnpj, setEditCpfCnpj] = useState("");
  const [editCompanySize, setEditCompanySize] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const user = session.user;
        const meta = user.user_metadata || {};
        setName(meta.name || user.email?.split("@")[0] || "Usuário");
        setEmail(user.email || "");
        setPhone(meta.phone || meta.telefone || "");
        setCpfCnpj(meta.cpf_cnpj || "");
        setCompanySize(meta.company_size || meta.tamanho_empresa || "");
        setAvatarUrl(meta.avatar_url || null);

        const { data: roleData } = await supabase
          .from("user_roles" as any).select("role").eq("user_id", user.id).maybeSingle();
        setRole((roleData as any)?.role || "user");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStartEditing = () => {
    setEditName(name);
    setEditPhone(phone);
    setEditCpfCnpj(cpfCnpj);
    setEditCompanySize(companySize);
    setEditing(true);
  };

  const handleCancelEditing = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: editName,
          phone: editPhone,
          cpf_cnpj: editCpfCnpj,
          company_size: editCompanySize,
        },
      });
      if (error) throw error;
      setName(editName);
      setPhone(editPhone);
      setCpfCnpj(editCpfCnpj);
      setCompanySize(editCompanySize);
      setEditing(false);
      toast({ title: "Perfil atualizado", description: "Suas informações foram salvas com sucesso." });
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "E-mail enviado", description: "Verifique sua caixa de entrada para redefinir a senha." });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const userId = session.user.id;
      const ext = file.name.split(".").pop() || "png";
      const filePath = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: urlWithCacheBust },
      });
      if (updateError) throw updateError;

      setAvatarUrl(urlWithCacheBust);
      toast({ title: "Foto atualizada", description: "Sua foto de perfil foi salva com sucesso." });
    } catch (err: any) {
      toast({ title: "Erro ao enviar foto", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const initials = name
    .split(" ")
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DashboardLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Perfil</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <User className="h-7 w-7 text-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
        </div>
        <p className="text-sm text-muted-foreground">Informações do seu perfil de cadastro</p>
      </div>

      {!loading && (
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="relative h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold shrink-0 cursor-pointer group overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <div className="space-y-1">
                  {editing ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-lg font-bold uppercase h-9 w-64"
                    />
                  ) : (
                    <h2 className="text-lg font-bold text-foreground uppercase">{name}</h2>
                  )}
                  <p className="text-sm text-muted-foreground">{email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{roleLabels[role] || role}</Badge>
                    <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20">Ativo</Badge>
                  </div>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={handleStartEditing}
                  className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>

            <Separator />

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CPF / CNPJ</p>
                {editing ? (
                  <Input value={editCpfCnpj} onChange={(e) => setEditCpfCnpj(e.target.value)} />
                ) : (
                  <p className="text-sm text-foreground">{cpfCnpj || "—"}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Telefone</p>
                {editing ? (
                  <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                ) : (
                  <p className="text-sm text-foreground">{phone || "—"}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tamanho da empresa</p>
                {editing ? (
                  <Input value={editCompanySize} onChange={(e) => setEditCompanySize(e.target.value)} />
                ) : (
                  <p className="text-sm text-foreground">{companySize || "—"}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Senha</p>
                <p className="text-sm text-foreground">••••••••</p>
                <button
                  onClick={handleResetPassword}
                  className="text-cyan-500 hover:text-cyan-600 text-sm font-medium transition-colors"
                >
                  Alterar senha
                </button>
              </div>
            </div>

            {/* Action buttons */}
            {editing && (
              <div className="flex items-center gap-3 pt-2">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
                <Button variant="outline" onClick={handleCancelEditing} disabled={saving}>
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default PerfilPage;
