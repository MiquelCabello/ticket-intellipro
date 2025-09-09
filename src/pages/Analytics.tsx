import { MainLayout } from "@/components/Layout/MainLayout";
import { ExpenseChart } from "@/components/Dashboard/ExpenseChart";
import { CategoryChart } from "@/components/Dashboard/CategoryChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardFilters } from "@/components/Dashboard/DashboardFilters";
import { BarChart3, TrendingUp, Users, Building } from "lucide-react";

const Analytics = () => {
  const topVendors = [
    { name: "Hotel Marriott", amount: 2450.00, transactions: 12 },
    { name: "Taxi Barcelona", amount: 890.50, transactions: 34 },
    { name: "Restaurante El Celler", amount: 675.30, transactions: 8 },
    { name: "Office Depot", amount: 432.20, transactions: 15 },
    { name: "Shell Estación", amount: 298.75, transactions: 22 }
  ];

  const employeeStats = [
    { name: "Ana García", department: "Ventas", totalExpenses: 3450.80, thisMonth: 450.30 },
    { name: "Carlos López", department: "Marketing", totalExpenses: 2890.50, thisMonth: 890.20 },
    { name: "María Fernández", department: "Operaciones", totalExpenses: 2156.75, thisMonth: 320.45 },
    { name: "David Ruiz", department: "IT", totalExpenses: 1876.20, thisMonth: 180.00 },
    { name: "Laura Pérez", department: "RRHH", totalExpenses: 1234.90, thisMonth: 234.50 }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Análisis y Visualizaciones</h1>
            <p className="text-muted-foreground">
              Análisis detallado de gastos empresariales
            </p>
          </div>
          <DashboardFilters />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ExpenseChart />
          <CategoryChart />
        </div>

        {/* Top Vendors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Top Comercios por Gasto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topVendors.map((vendor, index) => (
                <div key={vendor.name} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {index + 1}. {vendor.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {vendor.transactions} transacciones
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{vendor.amount.toFixed(2)}€</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee Leaderboard */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Ranking de Empleados por Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employeeStats.map((employee, index) => (
                <div key={employee.name} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {index + 1}. {employee.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {employee.department}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">{employee.totalExpenses.toFixed(2)}€</p>
                    <p className="text-xs text-muted-foreground">
                      Este mes: {employee.thisMonth.toFixed(2)}€
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Analytics;