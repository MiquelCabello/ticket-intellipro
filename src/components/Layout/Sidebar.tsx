import { 
  LayoutDashboard, 
  Receipt, 
  Upload, 
  BarChart3, 
  Users, 
  Settings,
  FileText,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Gastos", href: "/expenses", icon: Receipt },
  { name: "Subir Ticket", href: "/upload-tickets", icon: Upload },
  { name: "Análisis", href: "/analytics", icon: BarChart3 },
  { name: "Empleados", href: "/employees", icon: Users, adminOnly: true },
  { name: "Configuración", href: "/settings", icon: Settings },
];

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();
  // Mock user role - in real app this would come from auth context
  const userRole = "ADMIN"; // or "EMPLOYEE"

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col bg-card border-r border-border">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Receipt className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">ExpenseFlow</h1>
                <p className="text-xs text-muted-foreground">Gestión de Gastos</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              // Hide admin-only items for employees
              if (item.adminOnly && userRole !== "ADMIN") {
                return null;
              }

              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-secondary-foreground"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Juan Director</p>
                <p className="text-xs text-muted-foreground truncate">
                  {userRole === "ADMIN" ? "Director Financiero" : "Empleado"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Click outside to close on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};