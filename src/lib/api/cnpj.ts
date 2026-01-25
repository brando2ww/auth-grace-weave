import { supabase } from '@/integrations/supabase/client';

export interface CNPJLookupResult {
  success: boolean;
  data?: {
    cnpj: string;
    razao_social: string;
    nome_fantasia: string;
    endereco: {
      logradouro: string;
      numero: string;
      complemento: string;
      bairro: string;
      cidade: string;
      uf: string;
      cep: string;
    };
    cnae_principal: string;
    cnae_descricao: string;
    situacao_cadastral: string;
    data_abertura: string | null;
  };
  error?: string;
}

export async function lookupCNPJ(cnpj: string): Promise<CNPJLookupResult> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session?.access_token) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const response = await fetch(
      'https://zzwujetawkfqhxkwakjr.supabase.co/functions/v1/cnpj-lookup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify({ cnpj }),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error looking up CNPJ:', error);
    return { success: false, error: 'Erro ao consultar CNPJ' };
  }
}

// Format CNPJ with mask: XX.XXX.XXX/XXXX-XX
export function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

// Remove CNPJ mask
export function cleanCNPJ(value: string): string {
  return value.replace(/\D/g, '');
}

// Validate CNPJ (basic check)
export function isValidCNPJ(cnpj: string): boolean {
  const digits = cleanCNPJ(cnpj);
  
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false; // All same digits
  
  // Validate check digits
  let sum = 0;
  let weight = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * weight[i];
  }
  
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(digits[12]) !== digit1) return false;
  
  sum = 0;
  weight = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i]) * weight[i];
  }
  
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(digits[13]) === digit2;
}
