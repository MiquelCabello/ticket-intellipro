import { KPICard } from "./KPICard";
import { ExpenseChart } from "./ExpenseChart";
import { CategoryChart } from "./CategoryChart";
import { RecentExpenses } from "./RecentExpenses";
import { DashboardFilters } from "./DashboardFilters";
import { 
  Euro, 
  Clock, 
  TrendingUp, 
  Users,
  Calendar,
  ShoppingCart 
} from "lucide-react";

// Mock data - in real app this would come from API
const kpiData = {
  totalExpenses: {
    value: "€12.450,80",
    subtitle: "Total este año",
    trend: { value: 15.2, label: "vs año anterior", isPositive: true }
  },
  pendingExpenses: {
    value: "€2.340,60",
    subtitle: "15 gastos pendientes",
    trend: { value: -8.1, label: "vs mes anterior", isPositive: false }
  },
  topCategory: {
    value: "Viajes",
    subtitle: "€4.320,50 (34.7%)",
    trend: { value: 22.5, label: "vs mes anterior", isPositive: true }
  },
  dailyAverage: {
    value: "€142,30",
    subtitle: "Promedio diario",
    trend: { value: 5.8, label: "últimos 30 días", isPositive: true }
  }
};

export const Dashboard = () => {
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