import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface CompanyData {
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
}

export interface OperationData {
  stock_size: string;
  vehicle_types: string;
  team_size: string;
}

export interface OnboardingState {
  currentStep: number;
  companyData: CompanyData | null;
  operationData: OperationData | null;
  channels: string[];
  mainObjective: string | null;
}

const TOTAL_STEPS = 5;

const STEP_MAP: Record<string, number> = {
  'company': 1,
  'operation': 2,
  'channels': 3,
  'objective': 4,
  'complete': 5,
};

const STEP_NAMES: Record<number, string> = {
  1: 'company',
  2: 'operation',
  3: 'channels',
  4: 'objective',
  5: 'complete',
};

export function useOnboarding() {
  const navigate = useNavigate();
  const { profile, user, refreshProfile } = useAuthContext();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data for each step
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [operationData, setOperationData] = useState<OperationData | null>(null);
  const [channels, setChannels] = useState<string[]>([]);
  const [mainObjective, setMainObjective] = useState<string | null>(null);

  // Load existing data on mount
  useEffect(() => {
    const loadExistingData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Determine current step from profile
        const step = profile?.onboarding_step || 'company';
        const stepNumber = STEP_MAP[step] || 1;
        setCurrentStep(stepNumber);

        // Load company data if exists
        const { data: company } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (company) {
          setCompanyData({
            cnpj: company.cnpj,
            razao_social: company.razao_social,
            nome_fantasia: company.nome_fantasia || '',
            endereco: {
              logradouro: company.endereco_logradouro || '',
              numero: company.endereco_numero || '',
              complemento: company.endereco_complemento || '',
              bairro: company.endereco_bairro || '',
              cidade: company.endereco_cidade || '',
              uf: company.endereco_uf || '',
              cep: company.endereco_cep || '',
            },
            cnae_principal: company.cnae_principal || '',
            cnae_descricao: company.cnae_descricao || '',
            situacao_cadastral: company.situacao_cadastral || '',
            data_abertura: company.data_abertura,
          });
        }

        // Load onboarding data if exists
        const { data: onboardingData } = await supabase
          .from('onboarding_data')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (onboardingData) {
          if (onboardingData.stock_size || onboardingData.vehicle_types || onboardingData.team_size) {
            setOperationData({
              stock_size: onboardingData.stock_size || '',
              vehicle_types: onboardingData.vehicle_types || '',
              team_size: onboardingData.team_size || '',
            });
          }
          if (onboardingData.channels) {
            setChannels(onboardingData.channels);
          }
          if (onboardingData.main_objective) {
            setMainObjective(onboardingData.main_objective);
          }
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingData();
  }, [user, profile?.onboarding_step]);

  const updateProfileStep = async (step: string) => {
    if (!user) return;
    
    await supabase
      .from('profiles')
      .update({ onboarding_step: step })
      .eq('id', user.id);
  };

  const saveCompanyData = async (data: CompanyData): Promise<boolean> => {
    if (!user) return false;
    
    setIsSubmitting(true);
    
    try {
      // Upsert company data
      const { error } = await supabase
        .from('companies')
        .upsert({
          user_id: user.id,
          cnpj: data.cnpj,
          razao_social: data.razao_social,
          nome_fantasia: data.nome_fantasia,
          endereco_logradouro: data.endereco.logradouro,
          endereco_numero: data.endereco.numero,
          endereco_complemento: data.endereco.complemento,
          endereco_bairro: data.endereco.bairro,
          endereco_cidade: data.endereco.cidade,
          endereco_uf: data.endereco.uf,
          endereco_cep: data.endereco.cep,
          cnae_principal: data.cnae_principal,
          cnae_descricao: data.cnae_descricao,
          situacao_cadastral: data.situacao_cadastral,
          data_abertura: data.data_abertura,
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      setCompanyData(data);
      await updateProfileStep('operation');
      setCurrentStep(2);
      
      return true;
    } catch (error) {
      console.error('Error saving company data:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveOperationData = async (data: OperationData): Promise<boolean> => {
    if (!user) return false;
    
    setIsSubmitting(true);
    
    try {
      // Upsert onboarding data
      const { error } = await supabase
        .from('onboarding_data')
        .upsert({
          user_id: user.id,
          stock_size: data.stock_size,
          vehicle_types: data.vehicle_types,
          team_size: data.team_size,
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      setOperationData(data);
      await updateProfileStep('channels');
      setCurrentStep(3);
      
      return true;
    } catch (error) {
      console.error('Error saving operation data:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveChannelsData = async (selectedChannels: string[]): Promise<boolean> => {
    if (!user) return false;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('onboarding_data')
        .upsert({
          user_id: user.id,
          channels: selectedChannels,
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      setChannels(selectedChannels);
      await updateProfileStep('objective');
      setCurrentStep(4);
      
      return true;
    } catch (error) {
      console.error('Error saving channels data:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveObjectiveData = async (objective: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('onboarding_data')
        .upsert({
          user_id: user.id,
          main_objective: objective,
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      setMainObjective(objective);
      await updateProfileStep('complete');
      setCurrentStep(5);
      
      return true;
    } catch (error) {
      console.error('Error saving objective data:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeOnboarding = async (): Promise<boolean> => {
    if (!user) return false;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_step: 'complete',
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      navigate('/dashboard');
      
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    isSubmitting,
    isLoading,
    companyData,
    operationData,
    channels,
    mainObjective,
    saveCompanyData,
    saveOperationData,
    saveChannelsData,
    saveObjectiveData,
    completeOnboarding,
    goToStep,
    goBack,
  };
}
