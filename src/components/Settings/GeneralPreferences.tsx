import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, RotateCcw } from "lucide-react";
import { useUserPreferences, ThemePreference } from "@/hooks/useUserPreferences";

const TIMEZONES = [
  { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
  { value: 'Europe/London', label: 'Londres (GMT+0)' },
  { value: 'Europe/Paris', label: 'París (GMT+1)' },
  { value: 'Europe/Berlin', label: 'Berlín (GMT+1)' },
  { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'Los Ángeles (GMT-8)' },
  { value: 'Asia/Tokyo', label: 'Tokio (GMT+9)' },
];

const LANGUAGES = [
  { value: 'es-ES', label: 'Español' },
  { value: 'en-US', label: 'English' },
  { value: 'fr-FR', label: 'Français' },
  { value: 'de-DE', label: 'Deutsch' },
];

export const GeneralPreferences = () => {
  const { preferences, loading, saving, updatePreferences, resetPreferences } = useUserPreferences();

  const handleThemeToggle = (isDark: boolean) => {
    const newTheme: ThemePreference = isDark ? 'DARK' : 'LIGHT';
    updatePreferences({ theme: newTheme });
  };

  const handleTimezoneChange = (timezone: string) => {
    updatePreferences({ timezone });
  };

  const handleLanguageChange = (language: string) => {
    updatePreferences({ language });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Preferencias Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse h-4 bg-muted rounded" />
            <div className="animate-pulse h-4 bg-muted rounded" />
            <div className="animate-pulse h-4 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Preferencias Generales
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={resetPreferences}
            disabled={saving}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Restablecer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Tema Oscuro</Label>
            <p className="text-sm text-muted-foreground">
              Alternar entre tema claro y oscuro
            </p>
          </div>
          <Switch
            checked={preferences.theme === 'DARK'}
            onCheckedChange={handleThemeToggle}
            disabled={saving}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="language">Idioma</Label>
          <Select
            value={preferences.language}
            onValueChange={handleLanguageChange}
            disabled={saving}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un idioma" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Zona Horaria</Label>
          <Select
            value={preferences.timezone}
            onValueChange={handleTimezoneChange}
            disabled={saving}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una zona horaria" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Todas las fechas se mostrarán en esta zona horaria
          </p>
        </div>

        {saving && (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
            Guardando cambios...
          </div>
        )}
      </CardContent>
    </Card>
  );
};