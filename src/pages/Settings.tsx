import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Moon, Sun, Euro, Database, Shield, Download } from "lucide-react";

const Settings = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Personaliza las preferencias del sistema y configuración financiera
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Preferencias Generales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tema Oscuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Alternar entre tema claro y oscuro
                  </p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select defaultValue="es">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Select defaultValue="europe-madrid">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="europe-madrid">Europe/Madrid</SelectItem>
                    <SelectItem value="europe-london">Europe/London</SelectItem>
                    <SelectItem value="america-new_york">America/New_York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Financial Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5" />
                Configuración Financiera
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currency">Moneda Base</Label>
                <Select defaultValue="EUR">
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
                  placeholder="21"
                  defaultValue="21"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="approval-limit">Límite Aprobación Automática (€)</Label>
                <Input
                  id="approval-limit"
                  type="number"
                  placeholder="100"
                  defaultValue="100"
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
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Categories Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Categorías</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Categorías Activas</Label>
                <div className="space-y-2">
                  {["Viajes", "Dietas", "Transporte", "Alojamiento", "Material", "Software", "Otros"].map((category) => (
                    <div key={category} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{category}</span>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full">Añadir Categoría</Button>
            </CardContent>
          </Card>

          {/* Project Codes */}
          <Card>
            <CardHeader>
              <CardTitle>Códigos de Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Proyectos Activos</Label>
                <div className="space-y-2">
                  {[
                    { code: "PRJ-001", name: "Proyecto General" },
                    { code: "PRJ-CLIENTE-A", name: "Cliente A - Marketing" },
                    { code: "INT-OPS", name: "Operaciones Internas" }
                  ].map((project) => (
                    <div key={project.code} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="text-sm font-medium">{project.code}</span>
                        <p className="text-xs text-muted-foreground">{project.name}</p>
                      </div>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full">Añadir Proyecto</Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gestión de Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar Base de Datos Completa
              </Button>
              
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar Mis Datos Personales
              </Button>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="text-destructive">Zona de Peligro</Label>
                <Button variant="destructive" className="w-full">
                  Solicitar Eliminación de Cuenta
                </Button>
                <p className="text-xs text-muted-foreground">
                  Esta acción eliminará permanentemente todos tus datos personales
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Cambiar Contraseña
              </Button>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticación de Dos Factores</Label>
                  <p className="text-sm text-muted-foreground">
                    Añade una capa extra de seguridad
                  </p>
                </div>
                <Switch />
              </div>

              <div className="space-y-2">
                <Label>Sessiones Activas</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="text-sm font-medium">Navegador Web - Madrid</span>
                      <p className="text-xs text-muted-foreground">Activa ahora</p>
                    </div>
                    <Button variant="outline" size="sm">Cerrar</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;