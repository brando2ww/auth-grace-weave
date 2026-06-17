import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Cake, Gift, CalendarDays, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const FILTROS = [
  { value: "hoje", label: "Hoje" },
  { value: "todos", label: "Todos" },
  { value: "1", label: "Janeiro" }, { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" }, { value: "4", label: "Abril" },
  { value: "5", label: "Maio" }, { value: "6", label: "Junho" },
  { value: "7", label: "Julho" }, { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" }, { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" }, { value: "12", label: "Dezembro" },
];

const AniversariosPage = () => {
  const [mesFiltro, setMesFiltro] = useState("hoje");

  const { data: contatos, isLoading } = useQuery({
    queryKey: ["contatos-aniversarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contatos" as any)
        .select("id, nome, data_nascimento, telefone, codigo_pais, profile_picture_url" as any)
        .not("data_nascimento", "is", null)
        .order("data_nascimento");
      if (error) throw error;
      return data as any[];
    },
  });

  const hoje = new Date();
  const hojeMes = hoje.getMonth() + 1;
  const hojeDia = hoje.getDate();

  const aniversariantes = useMemo(() => {
    if (!contatos) return [];
    return contatos
      .map((c: any) => {
        const d = new Date(c.data_nascimento + "T00:00:00");
        const mes = d.getMonth() + 1;
        const dia = d.getDate();
        const idade = hoje.getFullYear() - d.getFullYear();
        const isHoje = mes === hojeMes && dia === hojeDia;
        const estaSemana = (() => {
          const proximoAniv = new Date(hoje.getFullYear(), mes - 1, dia);
          if (proximoAniv < hoje) proximoAniv.setFullYear(proximoAniv.getFullYear() + 1);
          const diff = (proximoAniv.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff <= 7;
        })();
        return { ...c, mes, dia, idade, isHoje, estaSemana };
      })
      .filter((c: any) => {
        if (mesFiltro === "hoje") return c.isHoje;
        if (mesFiltro === "todos") return true;
        return c.mes === parseInt(mesFiltro);
      })
      .sort((a: any, b: any) => {
        // Sort by upcoming: closest birthday first
        const getNext = (m: number, d: number) => {
          const dt = new Date(hoje.getFullYear(), m - 1, d);
          if (dt < hoje) dt.setFullYear(dt.getFullYear() + 1);
          return dt.getTime();
        };
        return getNext(a.mes, a.dia) - getNext(b.mes, b.dia);
      });
  }, [contatos, mesFiltro, hojeMes, hojeDia]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Cake className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Aniversários</h1>
          </div>
          <Select value={mesFiltro} onValueChange={setMesFiltro}>
            <SelectTrigger className="w-[180px]">
              <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTROS.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : aniversariantes.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border">
            <Gift className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">
              {mesFiltro === "hoje"
                ? "Nenhum aniversariante hoje."
                : mesFiltro === "todos"
                ? "Nenhum contato com data de nascimento cadastrada."
                : `Nenhum aniversário em ${FILTROS.find(f => f.value === mesFiltro)?.label}.`}
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {aniversariantes.map((c: any) => (
              <Card
                key={c.id}
                className={`flex items-center gap-4 p-4 transition-colors ${
                  c.isHoje ? "border-primary bg-primary/5" : c.estaSemana ? "border-yellow-400/50 bg-yellow-50/50 dark:bg-yellow-900/10" : ""
                }`}
              >
                {c.profile_picture_url ? (
                  <img src={c.profile_picture_url} alt={c.nome} className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {String(c.dia).padStart(2, "0")}/{String(c.mes).padStart(2, "0")} · {c.idade} anos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {c.isHoje && (
                    <Badge className="bg-primary text-primary-foreground border-0">
                      <Cake className="h-3 w-3 mr-1" /> Hoje!
                    </Badge>
                  )}
                  {!c.isHoje && c.estaSemana && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-400 dark:text-yellow-400">
                      Esta semana
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AniversariosPage;
