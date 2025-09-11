import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const OrganizationSettings = () => {
  const [settings, setSettings] = useState({
    companyName: 'Mi Empresa S.L.',
    currency: 'EUR',
    defaultVat: '21',
    approvalLimit: '100',
    sandboxMode: false
  });
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Configuración guardada",
      description: "Los cambios se han aplicado correctamente",
    });
    
    setSaving(false);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Archivo demasiado grande",
          description: "El logo debe ser menor a 2MB",
          variant: "destructive",
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Formato no válido",
          description: "Por favor selecciona una imagen (PNG, JPG, SVG)",
          variant: "destructive",
        });
        return;
      }
      
      setLogoFile(file);
      toast({
        title: "Logo seleccionado",
        description: `${file.name} - ${(file.size / 1024).toFixed(1)} KB`,
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Configuración de Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="company-name">Nombre de la Empresa</Label>
          <Input
            id="company-name"
            value={settings.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="Introduce el nombre de tu empresa"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">Logo de la Empresa</Label>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="relative">
              <Upload className="h-4 w-4 mr-2" />
              Subir Logo
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </Button>
            {logoFile && (
              <span className="text-sm text-muted-foreground">
                {logoFile.name}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPG o SVG. Máximo 2MB. Recomendado: 200x60px
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currency">Moneda Base</Label>
            <Select
              value={settings.currency}
              onValueChange={(value) => handleInputChange('currency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vat">IVA por Defecto (%)</Label>
            <Input
              id="vat"
              type="number"
              min="0"
              max="100"
              value={settings.defaultVat}
              onChange={(e) => handleInputChange('defaultVat', e.target.value)}
              placeholder="21"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="approval-limit">Límite Aprobación Automática (€)</Label>
          <Input
            id="approval-limit"
            type="number"
            min="0"
            value={settings.approvalLimit}
            onChange={(e) => handleInputChange('approvalLimit', e.target.value)}
            placeholder="100"
          />
          <p className="text-sm text-muted-foreground">
            Gastos menores a este importe se aprueban automáticamente
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Modo Sandbox</Label>
            <p className="text-sm text-muted-foreground">
              Activar para pruebas sin facturación real
            </p>
          </div>
          <Switch
            checked={settings.sandboxMode}
            onCheckedChange={(value) => handleInputChange('sandboxMode', value)}
          />
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};