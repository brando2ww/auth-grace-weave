import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CNPJResponse {
  cnpj: string
  razao_social: string
  nome_fantasia: string | null
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  municipio: string
  uf: string
  cep: string
  cnae_fiscal: number
  cnae_fiscal_descricao: string
  descricao_situacao_cadastral: string
  data_inicio_atividade: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Validate auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: 'Token inválido' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { cnpj } = await req.json()

    if (!cnpj) {
      return new Response(
        JSON.stringify({ success: false, error: 'CNPJ não informado' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Clean CNPJ (only numbers)
    const cleanCnpj = cnpj.replace(/\D/g, '')

    if (cleanCnpj.length !== 14) {
      return new Response(
        JSON.stringify({ success: false, error: 'CNPJ deve ter 14 dígitos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate CNPJ format (basic check)
    if (!/^\d{14}$/.test(cleanCnpj)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Formato de CNPJ inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Looking up CNPJ: ${cleanCnpj}`)

    // Fetch from BrasilAPI (free, no auth required)
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('BrasilAPI error:', errorText)
      
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ success: false, error: 'CNPJ não encontrado na base da Receita Federal' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Erro ao consultar CNPJ' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data: CNPJResponse = await response.json()

    console.log(`Found company: ${data.razao_social}`)

    // Return formatted data
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          cnpj: data.cnpj,
          razao_social: data.razao_social,
          nome_fantasia: data.nome_fantasia || '',
          endereco: {
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cidade: data.municipio || '',
            uf: data.uf || '',
            cep: data.cep || '',
          },
          cnae_principal: String(data.cnae_fiscal || ''),
          cnae_descricao: data.cnae_fiscal_descricao || '',
          situacao_cadastral: data.descricao_situacao_cadastral || '',
          data_abertura: data.data_inicio_atividade || null,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in cnpj-lookup:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Erro interno ao processar requisição' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
