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

  // 1. Criar usuário
  const { data: user, error: userError } = await supabase.auth.admin.createUser({
    email: 'superadmin@izotopetechnolgybusiness.com.br',
    password: 'iz_IA_k3pQ0mY4m2b2q9xq7J0o0yR8cJp1eF3nN7aH2sL9dXw',
    email_confirm: true,
    user_metadata: { name: 'Super Admin' }
  })

  if (userError) {
    return new Response(
      JSON.stringify({ error: userError.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // 2. Atribuir role admin
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({ user_id: user.user.id, role: 'admin' })

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
