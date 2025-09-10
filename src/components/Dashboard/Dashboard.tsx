import { KPICard } from "./KPICard";
import { ExpenseChart } from "./ExpenseChart";
import { CategoryChart } from "./CategoryChart";
import { RecentExpenses } from "./RecentExpenses";
import { DashboardFilters } from "./DashboardFilters";
import { useState, useEffect } from "react";
import { 
  Euro, 
  Clock, 
  TrendingUp, 
  Users,
  Calendar,
  ShoppingCart 
} from "lucide-react";

export const Dashboard = () => {
  // KPI data will be loaded from database
  const [kpiData, setKpiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // This will be implemented to load real data from Supabase
        // For now, using fallback data until backend integration is complete
        const fallbackData = {
          totalExpenses: {
            value: "€0,00",
            subtitle: "Total este año",
            trend: { value: 0, label: "vs año anterior", isPositive: true }
          },
          pendingExpenses: {
            value: "€0,00",
            subtitle: "0 gastos pendientes",
            trend: { value: 0, label: "vs mes anterior", isPositive: false }
          },
          topCategory: {
            value: "Sin datos",
            subtitle: "€0,00 (0%)",
            trend: { value: 0, label: "vs mes anterior", isPositive: true }
          },
          dailyAverage: {
            value: "€0,00",
            subtitle: "Promedio diario",
            trend: { value: 0, label: "últimos 30 días", isPositive: true }
          }
        };
        
        setKpiData(fallbackData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Cargando datos del dashboard...
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!kpiData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Error al cargar los datos del dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen ejecutivo de gastos empresariales
          </p>
        </div>
        <DashboardFilters />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Gastos Totales"
          value={kpiData.totalExpenses.value}
          subtitle={kpiData.totalExpenses.subtitle}
          icon={Euro}
          trend={kpiData.totalExpenses.trend}
          variant="primary"
        />
        <KPICard
          title="Pendientes de Aprobación"
          value={kpiData.pendingExpenses.value}
          subtitle={kpiData.pendingExpenses.subtitle}
          icon={Clock}
          trend={kpiData.pendingExpenses.trend}
          variant="warning"
        />
        <KPICard
          title="Categoría Principal"
          value={kpiData.topCategory.value}
          subtitle={kpiData.topCategory.subtitle}
          icon={TrendingUp}
          trend={kpiData.topCategory.trend}
          variant="success"
        />
        <KPICard
          title="Promedio Diario"
          value={kpiData.dailyAverage.value}
          subtitle={kpiData.dailyAverage.subtitle}
          icon={Calendar}
          trend={kpiData.dailyAverage.trend}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseChart />
        <CategoryChart />
      </div>

      {/* Recent Expenses */}
      <RecentExpenses />
    </div>
  );
};