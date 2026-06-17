import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  userId: string | null;
  userName: string;
  role: string;
  permissions: string[];
  plan: string | null;
  planFeatures: string[];
  loading: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    userId: null,
    userName: "",
    role: "user",
    permissions: [],
    plan: null,
    planFeatures: [],
    loading: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setState(prev => ({ ...prev, loading: false }));
          return;
        }

        const user = session.user;
        const userName = user.user_metadata?.name || user.email?.split("@")[0] || "Usuário";

        // Load role, permissions, profile, and plan features in parallel
        const [roleRes, permRes, profileRes] = await Promise.all([
          supabase.from("user_roles" as any).select("role").eq("user_id", user.id).maybeSingle(),
          supabase.from("user_permissions" as any).select("permission").eq("user_id", user.id),
          supabase.from("profiles").select("subscription_plan").eq("id", user.id).maybeSingle(),
        ]);

        const role = (roleRes.data as any)?.role || "user";
        const permissions = ((permRes.data as any[]) || []).map((p: any) => p.permission);
        const plan = profileRes.data?.subscription_plan || null;

        // Load plan features if plan exists
        let planFeatures: string[] = [];
        if (plan) {
          const { data: featData } = await supabase
            .from("plan_features" as any)
            .select("feature")
            .eq("plan", plan);
          planFeatures = ((featData as any[]) || []).map((f: any) => f.feature);
        }

        setState({
          userId: user.id,
          userName,
          role,
          permissions,
          plan,
          planFeatures,
          loading: false,
        });
      } catch (err) {
        console.error("useAuth error:", err);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    load();
  }, []);

  const hasPermission = (permission: string): boolean => {
    // owner and admin have all permissions
    if (state.role === "super_admin" || state.role === "owner" || state.role === "admin") return true;
    return state.permissions.includes(permission);
  };

  const planAllows = (feature: string): boolean => {
    // If no plan set, allow everything (grace period / trial)
    if (!state.plan) return true;
    return state.planFeatures.includes(feature);
  };

  const hasRole = (role: string): boolean => state.role === role;

  const canAccess = (permission: string, feature?: string): boolean => {
    if (!hasPermission(permission)) return false;
    if (feature && !planAllows(feature)) return false;
    return true;
  };

  return {
    ...state,
    hasPermission,
    planAllows,
    hasRole,
    canAccess,
  };
};
