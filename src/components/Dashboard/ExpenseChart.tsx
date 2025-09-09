import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

// Mock data - in real app this would come from API
const chartData = [
  { month: "Ene", approved: 2400, pending: 400 },
  { month: "Feb", approved: 1398, pending: 300 },
  { month: "Mar", approved: 3200, pending: 600 },
  { month: "Abr", approved: 2780, pending: 450 },
  { month: "May", approved: 1890, pending: 350 },
  { month: "Jun", approved: 2390, pending: 500 },
  { month: "Jul", approved: 3490, pending: 650 },
  { month: "Ago", approved: 2100, pending: 380 },
  { month: "Sep", approved: 2800, pending: 520 },
  { month: "Oct", approved: 3100, pending: 420 },
  { month: "Nov", approved: 2650, pending: 480 },
  { month: "Dic", approved: 3400, pending: 720 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: €${entry.value.toLocaleString("es-ES")}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ExpenseChart = () => {
  return (
    <Card className="expense-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Evolución Temporal de Gastos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Gastos aprobados y pendientes por mes
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="approvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--status-approved))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--status-approved))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--status-pending))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--status-pending))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs text-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                className="text-xs text-muted-foreground"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `€${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="approved"
                stackId="1"
                stroke="hsl(var(--status-approved))"
                fill="url(#approvedGradient)"
                strokeWidth={2}
                name="Aprobados"
              />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="1"
                stroke="hsl(var(--status-pending))"
                fill="url(#pendingGradient)"
                strokeWidth={2}
                name="Pendientes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};