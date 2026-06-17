export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      atendente_departamentos: {
        Row: {
          atendente_id: string
          created_at: string | null
          departamento_id: string
          id: string
        }
        Insert: {
          atendente_id: string
          created_at?: string | null
          departamento_id: string
          id?: string
        }
        Update: {
          atendente_id?: string
          created_at?: string | null
          departamento_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "atendente_departamentos_atendente_id_fkey"
            columns: ["atendente_id"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atendente_departamentos_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "departamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      atendentes: {
        Row: {
          ativo: boolean | null
          avatar_url: string | null
          codigo_pais: string | null
          config_ia: Json | null
          created_at: string | null
          descricao: string | null
          email: string
          id: string
          is_admin: boolean | null
          mensagem_finalizacao: string | null
          nome: string
          telefone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          avatar_url?: string | null
          codigo_pais?: string | null
          config_ia?: Json | null
          created_at?: string | null
          descricao?: string | null
          email: string
          id?: string
          is_admin?: boolean | null
          mensagem_finalizacao?: string | null
          nome: string
          telefone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          avatar_url?: string | null
          codigo_pais?: string | null
          config_ia?: Json | null
          created_at?: string | null
          descricao?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          mensagem_finalizacao?: string | null
          nome?: string
          telefone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      campanhas: {
        Row: {
          agendada_para: string | null
          conteudos: Json | null
          created_at: string | null
          departamento_id: string | null
          destinatarios_contatos: string[] | null
          destinatarios_etiquetas: string[] | null
          destinatarios_grupos: string[] | null
          id: string
          nome: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agendada_para?: string | null
          conteudos?: Json | null
          created_at?: string | null
          departamento_id?: string | null
          destinatarios_contatos?: string[] | null
          destinatarios_etiquetas?: string[] | null
          destinatarios_grupos?: string[] | null
          id?: string
          nome: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agendada_para?: string | null
          conteudos?: Json | null
          created_at?: string | null
          departamento_id?: string | null
          destinatarios_contatos?: string[] | null
          destinatarios_etiquetas?: string[] | null
          destinatarios_grupos?: string[] | null
          id?: string
          nome?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campanhas_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "departamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_pins: {
        Row: {
          chat_jid: string
          created_at: string | null
          id: string
          session_name: string
          user_id: string
        }
        Insert: {
          chat_jid: string
          created_at?: string | null
          id?: string
          session_name: string
          user_id: string
        }
        Update: {
          chat_jid?: string
          created_at?: string | null
          id?: string
          session_name?: string
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          cnae_descricao: string | null
          cnae_principal: string | null
          cnpj: string
          created_at: string | null
          data_abertura: string | null
          endereco_bairro: string | null
          endereco_cep: string | null
          endereco_cidade: string | null
          endereco_complemento: string | null
          endereco_logradouro: string | null
          endereco_numero: string | null
          endereco_uf: string | null
          id: string
          nome_fantasia: string | null
          razao_social: string
          situacao_cadastral: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cnae_descricao?: string | null
          cnae_principal?: string | null
          cnpj: string
          created_at?: string | null
          data_abertura?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_complemento?: string | null
          endereco_logradouro?: string | null
          endereco_numero?: string | null
          endereco_uf?: string | null
          id?: string
          nome_fantasia?: string | null
          razao_social: string
          situacao_cadastral?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cnae_descricao?: string | null
          cnae_principal?: string | null
          cnpj?: string
          created_at?: string | null
          data_abertura?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_complemento?: string | null
          endereco_logradouro?: string | null
          endereco_numero?: string | null
          endereco_uf?: string | null
          id?: string
          nome_fantasia?: string | null
          razao_social?: string
          situacao_cadastral?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes: {
        Row: {
          assinar_fila: boolean | null
          assinar_fila_minutos: number | null
          ativar_horario_atendimento: boolean | null
          ativar_rodizio: boolean | null
          avaliacao_atendimento: boolean | null
          coletar_mensagens_celular: boolean | null
          created_at: string | null
          enviar_fora_horario: boolean | null
          enviar_notificacao_transferencia: boolean | null
          enviar_protocolo: boolean | null
          esconder_grupos_whatsapp: boolean | null
          exibir_conversas_robo: boolean | null
          exibir_nome_atendente: boolean | null
          fora_horario_minutos: number | null
          habilitar_transcricao_ia: boolean | null
          horarios: Json | null
          id: string
          incluir_admins_rodizio: boolean | null
          mensagem_feedback: string | null
          mensagem_finalizacao: string | null
          mensagem_fora_horario: string | null
          mensagem_optout: string | null
          modo_rodizio: string | null
          permitir_optout: boolean | null
          selecionar_atendentes_rodizio: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assinar_fila?: boolean | null
          assinar_fila_minutos?: number | null
          ativar_horario_atendimento?: boolean | null
          ativar_rodizio?: boolean | null
          avaliacao_atendimento?: boolean | null
          coletar_mensagens_celular?: boolean | null
          created_at?: string | null
          enviar_fora_horario?: boolean | null
          enviar_notificacao_transferencia?: boolean | null
          enviar_protocolo?: boolean | null
          esconder_grupos_whatsapp?: boolean | null
          exibir_conversas_robo?: boolean | null
          exibir_nome_atendente?: boolean | null
          fora_horario_minutos?: number | null
          habilitar_transcricao_ia?: boolean | null
          horarios?: Json | null
          id?: string
          incluir_admins_rodizio?: boolean | null
          mensagem_feedback?: string | null
          mensagem_finalizacao?: string | null
          mensagem_fora_horario?: string | null
          mensagem_optout?: string | null
          modo_rodizio?: string | null
          permitir_optout?: boolean | null
          selecionar_atendentes_rodizio?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assinar_fila?: boolean | null
          assinar_fila_minutos?: number | null
          ativar_horario_atendimento?: boolean | null
          ativar_rodizio?: boolean | null
          avaliacao_atendimento?: boolean | null
          coletar_mensagens_celular?: boolean | null
          created_at?: string | null
          enviar_fora_horario?: boolean | null
          enviar_notificacao_transferencia?: boolean | null
          enviar_protocolo?: boolean | null
          esconder_grupos_whatsapp?: boolean | null
          exibir_conversas_robo?: boolean | null
          exibir_nome_atendente?: boolean | null
          fora_horario_minutos?: number | null
          habilitar_transcricao_ia?: boolean | null
          horarios?: Json | null
          id?: string
          incluir_admins_rodizio?: boolean | null
          mensagem_feedback?: string | null
          mensagem_finalizacao?: string | null
          mensagem_fora_horario?: string | null
          mensagem_optout?: string | null
          modo_rodizio?: string | null
          permitir_optout?: boolean | null
          selecionar_atendentes_rodizio?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contato_documentos: {
        Row: {
          contato_id: string
          created_at: string | null
          id: string
          nome: string
          tipo: string | null
          url: string
        }
        Insert: {
          contato_id: string
          created_at?: string | null
          id?: string
          nome: string
          tipo?: string | null
          url: string
        }
        Update: {
          contato_id?: string
          created_at?: string | null
          id?: string
          nome?: string
          tipo?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "contato_documentos_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
        ]
      }
      contatos: {
        Row: {
          bairro: string | null
          canal_preferido: string | null
          cargo: string | null
          cep: string | null
          cidade: string | null
          codigo_pais: string | null
          complemento: string | null
          cpf_cnpj: string | null
          created_at: string | null
          data_nascimento: string | null
          data_renovacao: string | null
          documentos_ativados: boolean | null
          email: string | null
          empresa: string | null
          estado: string | null
          etiquetas: string[] | null
          grupo: string | null
          id: string
          nome: string
          numero_endereco: string | null
          numero_pedidos: number | null
          observacoes: string | null
          origem_contato: string | null
          pais: string | null
          produto_servico: string | null
          profile_picture_url: string | null
          proximo_followup: string | null
          rua: string | null
          status_funil: string | null
          telefone: string | null
          telefone_secundario: string | null
          tipo_contato: string | null
          total_gasto: number | null
          ultima_compra: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bairro?: string | null
          canal_preferido?: string | null
          cargo?: string | null
          cep?: string | null
          cidade?: string | null
          codigo_pais?: string | null
          complemento?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          data_renovacao?: string | null
          documentos_ativados?: boolean | null
          email?: string | null
          empresa?: string | null
          estado?: string | null
          etiquetas?: string[] | null
          grupo?: string | null
          id?: string
          nome: string
          numero_endereco?: string | null
          numero_pedidos?: number | null
          observacoes?: string | null
          origem_contato?: string | null
          pais?: string | null
          produto_servico?: string | null
          profile_picture_url?: string | null
          proximo_followup?: string | null
          rua?: string | null
          status_funil?: string | null
          telefone?: string | null
          telefone_secundario?: string | null
          tipo_contato?: string | null
          total_gasto?: number | null
          ultima_compra?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bairro?: string | null
          canal_preferido?: string | null
          cargo?: string | null
          cep?: string | null
          cidade?: string | null
          codigo_pais?: string | null
          complemento?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          data_renovacao?: string | null
          documentos_ativados?: boolean | null
          email?: string | null
          empresa?: string | null
          estado?: string | null
          etiquetas?: string[] | null
          grupo?: string | null
          id?: string
          nome?: string
          numero_endereco?: string | null
          numero_pedidos?: number | null
          observacoes?: string | null
          origem_contato?: string | null
          pais?: string | null
          produto_servico?: string | null
          profile_picture_url?: string | null
          proximo_followup?: string | null
          rua?: string | null
          status_funil?: string | null
          telefone?: string | null
          telefone_secundario?: string | null
          tipo_contato?: string | null
          total_gasto?: number | null
          ultima_compra?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      departamentos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          updated_at: string | null
          user_id: string
          whatsapp_numero: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string | null
          user_id: string
          whatsapp_numero?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
          user_id?: string
          whatsapp_numero?: string | null
        }
        Relationships: []
      }
      etiquetas: {
        Row: {
          cor: string
          created_at: string | null
          id: string
          nome: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cor?: string
          created_at?: string | null
          id?: string
          nome: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cor?: string
          created_at?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      integracoes: {
        Row: {
          ativo: boolean | null
          config: Json | null
          created_at: string | null
          id: string
          tipo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          config?: Json | null
          created_at?: string | null
          id?: string
          tipo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          config?: Json | null
          created_at?: string | null
          id?: string
          tipo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      onboarding_data: {
        Row: {
          channels: string[] | null
          created_at: string | null
          id: string
          main_objective: string | null
          stock_size: string | null
          team_size: string | null
          updated_at: string | null
          user_id: string
          vehicle_types: string | null
        }
        Insert: {
          channels?: string[] | null
          created_at?: string | null
          id?: string
          main_objective?: string | null
          stock_size?: string | null
          team_size?: string | null
          updated_at?: string | null
          user_id: string
          vehicle_types?: string | null
        }
        Update: {
          channels?: string[] | null
          created_at?: string | null
          id?: string
          main_objective?: string | null
          stock_size?: string | null
          team_size?: string | null
          updated_at?: string | null
          user_id?: string
          vehicle_types?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_verifications: {
        Row: {
          attempts: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          phone_number: string
          user_data: Json
          verification_code: string
          verified: boolean | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          phone_number: string
          user_data: Json
          verification_code: string
          verified?: boolean | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          phone_number?: string
          user_data?: Json
          verification_code?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      plan_features: {
        Row: {
          feature: string
          id: string
          plan: string
        }
        Insert: {
          feature: string
          id?: string
          plan: string
        }
        Update: {
          feature?: string
          id?: string
          plan?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          document: string | null
          document_type: string | null
          first_name: string | null
          guarantee_ends_at: string | null
          id: string
          language: string | null
          mp_customer_id: string | null
          mp_preapproval_id: string | null
          mp_subscription_id: string | null
          onboarding_completed: boolean | null
          onboarding_step: string | null
          phone: string | null
          subscription_cancelled_at: string | null
          subscription_ends_at: string | null
          subscription_next_payment_date: string | null
          subscription_plan: string | null
          subscription_started_at: string | null
          subscription_status: string | null
          trial_ends_at: string | null
          trial_started_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document?: string | null
          document_type?: string | null
          first_name?: string | null
          guarantee_ends_at?: string | null
          id: string
          language?: string | null
          mp_customer_id?: string | null
          mp_preapproval_id?: string | null
          mp_subscription_id?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: string | null
          phone?: string | null
          subscription_cancelled_at?: string | null
          subscription_ends_at?: string | null
          subscription_next_payment_date?: string | null
          subscription_plan?: string | null
          subscription_started_at?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document?: string | null
          document_type?: string | null
          first_name?: string | null
          guarantee_ends_at?: string | null
          id?: string
          language?: string | null
          mp_customer_id?: string | null
          mp_preapproval_id?: string | null
          mp_subscription_id?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: string | null
          phone?: string | null
          subscription_cancelled_at?: string | null
          subscription_ends_at?: string | null
          subscription_next_payment_date?: string | null
          subscription_plan?: string | null
          subscription_started_at?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_sessions: {
        Row: {
          connection_name: string
          created_at: string | null
          id: string
          instance_name: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          connection_name: string
          created_at?: string | null
          id?: string
          instance_name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          connection_name?: string
          created_at?: string | null
          id?: string
          instance_name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      plan_allows: {
        Args: { _feature: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "demo_estoque"
        | "owner"
        | "vendedor"
        | "operacional"
        | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "moderator",
        "user",
        "demo_estoque",
        "owner",
        "vendedor",
        "operacional",
        "super_admin",
      ],
    },
  },
} as const
