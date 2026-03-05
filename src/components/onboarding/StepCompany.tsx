import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, CheckCircle2, AlertCircle, Loader2, MapPin, FileText } from 'lucide-react';
import { lookupCNPJ, formatCNPJ, cleanCNPJ, isValidCNPJ } from '@/lib/api/cnpj';
import { CompanyData } from '@/hooks/useOnboarding';
import { cn } from '@/lib/utils';

interface StepCompanyProps {
  initialData: CompanyData | null;
  onSubmit: (data: CompanyData) => Promise<boolean>;
  isSubmitting: boolean;
}

export function StepCompany({ initialData, onSubmit, isSubmitting }: StepCompanyProps) {
  const [cnpj, setCnpj] = useState(initialData?.cnpj ? formatCNPJ(initialData.cnpj) : '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(initialData);
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields
  const [razaoSocial, setRazaoSocial] = useState(initialData?.razao_social || '');
  const [nomeFantasia, setNomeFantasia] = useState(initialData?.nome_fantasia || '');
  const [logradouro, setLogradouro] = useState(initialData?.endereco.logradouro || '');
  const [numero, setNumero] = useState(initialData?.endereco.numero || '');
  const [complemento, setComplemento] = useState(initialData?.endereco.complemento || '');
  const [bairro, setBairro] = useState(initialData?.endereco.bairro || '');
  const [cidade, setCidade] = useState(initialData?.endereco.cidade || '');
  const [uf, setUf] = useState(initialData?.endereco.uf || '');
  const [cep, setCep] = useState(initialData?.endereco.cep || '');

  const handleCnpjChange = (value: string) => {
    const formatted = formatCNPJ(value);
    setCnpj(formatted);
    setSearchError(null);
    
    // Reset company data when CNPJ changes
    if (cleanCNPJ(formatted) !== cleanCNPJ(companyData?.cnpj || '')) {
      setCompanyData(null);
      setIsEditing(false);
    }
  };

  const handleSearch = async () => {
    const cleanedCnpj = cleanCNPJ(cnpj);
    
    if (!isValidCNPJ(cleanedCnpj)) {
      setSearchError('CNPJ inválido. Verifique os dígitos.');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const result = await lookupCNPJ(cleanedCnpj);

    if (result.success && result.data) {
      setCompanyData(result.data);
      setRazaoSocial(result.data.razao_social);
      setNomeFantasia(result.data.nome_fantasia);
      setLogradouro(result.data.endereco.logradouro);
      setNumero(result.data.endereco.numero);
      setComplemento(result.data.endereco.complemento);
      setBairro(result.data.endereco.bairro);
      setCidade(result.data.endereco.cidade);
      setUf(result.data.endereco.uf);
      setCep(result.data.endereco.cep);
      setIsEditing(true);
    } else {
      setSearchError(result.error || 'Erro ao buscar CNPJ');
    }

    setIsSearching(false);
  };

  // Auto-search when 14 digits are entered
  useEffect(() => {
    const cleanedCnpj = cleanCNPJ(cnpj);
    if (cleanedCnpj.length === 14 && !companyData && !isSearching) {
      handleSearch();
    }
  }, [cnpj]);

  const handleSubmit = async () => {
    if (!companyData) return;

    const updatedData: CompanyData = {
      ...companyData,
      razao_social: razaoSocial,
      nome_fantasia: nomeFantasia,
      endereco: {
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        uf,
        cep,
      },
    };

    await onSubmit(updatedData);
  };

  const isFormValid = companyData && razaoSocial.trim().length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-element">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Confirme os dados da sua empresa
        </h1>
        <p className="text-muted-foreground">
          Digite o CNPJ e confirme se as informações estão corretas.
        </p>
      </div>

      {/* CNPJ Input */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            CNPJ da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="00.000.000/0000-00"
                value={cnpj}
                onChange={(e) => handleCnpjChange(e.target.value)}
                className="text-lg font-mono"
                disabled={isSearching || isSubmitting}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={cleanCNPJ(cnpj).length !== 14 || isSearching || isSubmitting}
              variant="outline"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {searchError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{searchError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Loading skeleton */}
      {isSearching && (
        <Card className="animate-element">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-10" />
          </CardContent>
        </Card>
      )}

      {/* Company Data Form */}
      {companyData && !isSearching && (
        <Card className="animate-element animate-delay-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Dados Encontrados</CardTitle>
            </div>
            <CardDescription>
              Revise e ajuste os dados se necessário. CNAE não pode ser alterado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="razao_social">Razão Social *</Label>
                <Input
                  id="razao_social"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                <Input
                  id="nome_fantasia"
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Endereço
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input
                    id="logradouro"
                    value={logradouro}
                    onChange={(e) => setLogradouro(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uf">UF</Label>
                  <Input
                    id="uf"
                    value={uf}
                    onChange={(e) => setUf(e.target.value.toUpperCase().slice(0, 2))}
                    disabled={isSubmitting}
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!isFormValid || isSubmitting}
        className="w-full h-12 text-lg"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Salvando...
          </>
        ) : (
          'Confirmar e continuar'
        )}
      </Button>
    </div>
  );
}
