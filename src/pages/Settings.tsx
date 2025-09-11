import { MainLayout } from "@/components/Layout/MainLayout";
import { GeneralPreferences } from "@/components/Settings/GeneralPreferences";
import { OrganizationSettings } from "@/components/Settings/OrganizationSettings";
import { CategoriesManagement } from "@/components/Settings/CategoriesManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Database, Shield, Download, LogOut, Smartphone } from "lucide-react";

const Settings = () => {
  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      // TODO: Implement logout functionality
      console.log('Logout functionality to be implemented');
    }
  };

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
          {/* General Preferences */}
          <GeneralPreferences />

          {/* Organization Settings */}
          <OrganizationSettings />

          {/* Categories Management */}
          <CategoriesManagement />

          {/* Project Codes */}
          <Card>
            <CardHeader>
              <CardTitle>Códigos de Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6 text-muted-foreground">
                <p>Gestión de códigos de proyecto</p>
                <Button className="mt-2" disabled>
                  Próximamente
                </Button>
              </div>
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
              <Button className="w-full" variant="outline" disabled>
                <Download className="w-4 h-4 mr-2" />
                Exportar Base de Datos Completa
                <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
              </Button>
              
              <Button className="w-full" variant="outline" disabled>
                <Download className="w-4 h-4 mr-2" />
                Exportar Mis Datos Personales
                <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
              </Button>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-destructive">Zona de Peligro</h4>
                <Button variant="destructive" className="w-full" disabled>
                  Solicitar Eliminación de Cuenta
                  <span className="ml-auto text-xs">Próximamente</span>
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
              <Button className="w-full" variant="outline" disabled>
                Cambiar Contraseña
                <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
              </Button>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Autenticación de Dos Factores</h4>
                  <p className="text-xs text-muted-foreground">
                    Añade una capa extra de seguridad
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  <Smartphone className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Sessiones Activas</h4>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <span className="text-sm font-medium">Navegador Web - Madrid</span>
                    <p className="text-xs text-muted-foreground">Activa ahora</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Cerrar
                  </Button>
                </div>
              </div>

              <Separator />

              <Button
                className="w-full"
                variant="destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;