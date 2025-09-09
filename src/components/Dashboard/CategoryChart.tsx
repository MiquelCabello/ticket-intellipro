import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";

// Mock data - in real app this would come from API
const categoryData = [
  { name: "Viajes", value: 4320.50, percentage: 34.7 },
  { name: "Dietas", value: 2850.30, percentage: 22.9 },
  { name: "Transporte", value: 1980.75, percentage: 15.9 },
  { name: "Alojamiento", value: 1650.40, percentage: 13.2 },
  { name: "Material", value: 980.25, percentage: 7.9 },
  { name: "Software", value: 525.60, percentage: 4.2 },
  { name: "Otros", value: 142.80, percentage: 1.1 },
];

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary-glow))",
  "hsl(var(--secondary-dark))",
  "hsl(var(--accent-warning))",
  "hsl(var(--status-approved))",
  "hsl(var(--status-pending))",
  "hsl(var(--muted-foreground))",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          €{data.value.toLocaleString("es-ES", { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </p>
        <p className="text-sm font-medium" style={{ color: payload[0].fill }}>
          {data.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percentage > 5 ? (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${percentage}%`}
    </text>
  ) : null;
};

export const CategoryChart = () => {
  return (
    <Card className="expense-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Gastos por Categoría
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribución del gasto total
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};