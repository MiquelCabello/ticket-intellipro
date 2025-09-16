import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type ThemePreference = 'LIGHT' | 'DARK' | 'SYSTEM';

export interface UserPreferences {
  timezone: string;
  theme: ThemePreference;
  language: string;
  updated_at: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  timezone: 'Europe/Madrid',
  theme: 'SYSTEM',
  language: 'es-ES',
  updated_at: new Date().toISOString()
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load user preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    applyTheme(preferences.theme);
  }, [preferences.theme]);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // For now, work without authentication - use default preferences
      if (!user) {
        setPreferences(DEFAULT_PREFERENCES);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las preferencias",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (data) {
        setPreferences(data);
      } else {
        // Create default preferences for new user
        await createDefaultPreferences(user.id);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error in loadPreferences:', error);
      setLoading(false);
    }
  };

  const createDefaultPreferences = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          ...DEFAULT_PREFERENCES
        });

      if (error) {
        console.error('Error creating default preferences:', error);
      }
    } catch (error) {
      console.error('Error in createDefaultPreferences:', error);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // For now, work without authentication - just update local state
      if (!user) {
        const updatedPreferences = { ...preferences, ...updates, updated_at: new Date().toISOString() };
        setPreferences(updatedPreferences);
        
        toast({
          title: "Guardado",
          description: "Preferencias actualizadas (modo demo)",
        });
        
        setSaving(false);
        return;
      }

      const updatedPreferences = { ...preferences, ...updates, updated_at: new Date().toISOString() };

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...updatedPreferences
        });

      if (error) {
        console.error('Error updating preferences:', error);
        toast({
          title: "Error",
          description: "No se pudieron guardar las preferencias",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      setPreferences(updatedPreferences);
      
      toast({
        title: "Guardado",
        description: "Preferencias actualizadas correctamente",
      });

      setSaving(false);
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      toast({
        title: "Error",
        description: "Error inesperado al guardar",
        variant: "destructive",
      });
      setSaving(false);
    }
  };

  const applyTheme = (theme: ThemePreference) => {
    const root = window.document.documentElement;
    
    if (theme === 'SYSTEM') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.className = systemTheme;
    } else {
      root.className = theme.toLowerCase();
    }
  };

  const resetPreferences = async () => {
    await updatePreferences(DEFAULT_PREFERENCES);
  };

  return {
    preferences,
    loading,
    saving,
    updatePreferences,
    resetPreferences
  };
};