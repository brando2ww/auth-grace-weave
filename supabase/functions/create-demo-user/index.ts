import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. Criar usuário demo
  const { data: user, error: userError } = await supabase.auth.admin.createUser({
    email: 'demonstracao@wiseauto.com.br',
    password: '1234567',
    email_confirm: true,
    user_metadata: { name: 'Demo Estoque' }
  })

  if (userError) {
    return new Response(
      JSON.stringify({ error: userError.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // 2. Atribuir role demo_estoque
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({ user_id: user.user.id, role: 'demo_estoque' })

  if (roleError) {
    return new Response(
      JSON.stringify({ error: roleError.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true, userId: user.user.id, email: user.user.email }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
