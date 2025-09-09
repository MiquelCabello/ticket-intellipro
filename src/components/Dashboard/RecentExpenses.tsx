import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - in real app this would come from API
const recentExpenses = [
  {
    id: "1",
    vendor: "Hotel Madrid Centro",
    employee: { name: "Ana García", initials: "AG" },
    date: "2024-01-15",
    amount: 245.80,
    status: "APPROVED",
    category: "Alojamiento",
    hasReceipt: true
  },
  {
    id: "2", 
    vendor: "Taxi BCN",
    employee: { name: "Carlos López", initials: "CL" },
    date: "2024-01-14",
    amount: 35.50,
    status: "PENDING",
    category: "Transporte",
    hasReceipt: true
  },
  {
    id: "3",
    vendor: "Restaurante El Patio",
    employee: { name: "María Rodríguez", initials: "MR" },
    date: "2024-01-14",
    amount: 78.40,
    status: "PENDING",
    category: "Dietas",
    hasReceipt: true
  },
  {
    id: "4",
    vendor: "Office Supplies Pro",
    employee: { name: "Juan Director", initials: "JD" },
    date: "2024-01-13",
    amount: 156.90,
    status: "APPROVED",
    category: "Material",
    hasReceipt: true
  },
  {
    id: "5",
    vendor: "Software License Corp",
    employee: { name: "Luis Martín", initials: "LM" },
    date: "2024-01-12",
    amount: 299.00,
    status: "REJECTED",
    category: "Software",
    hasReceipt: false
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return <Badge className="status-badge-approved">Aprobado</Badge>;
    case "PENDING":
      return <Badge className="status-badge-pending">Pendiente</Badge>;
    case "REJECTED":
      return <Badge className="status-badge-rejected">Rechazado</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const RecentExpenses = () => {
  return (
    <Card className="expense-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">
            Gastos Recientes
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Últimos 10 gastos registrados
          </p>
        </div>
        <Button variant="outline" size="sm">
          Ver todos
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentExpenses.map((expense) => (
            <div 
              key={expense.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-primary-light text-primary">
                    {expense.employee.initials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {expense.vendor}
                    </p>
                    {expense.hasReceipt && (
                      <FileText className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{expense.employee.name}</span>
                    <span>•</span>
                    <span>{new Date(expense.date).toLocaleDateString("es-ES")}</span>
                    <span>•</span>
                    <span>{expense.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    €{expense.amount.toLocaleString("es-ES", { 
                      minimumFractionDigits: 2 
                    })}
                  </p>
                </div>
                {getStatusBadge(expense.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};