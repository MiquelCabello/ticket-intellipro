import { MainLayout } from "@/components/Layout/MainLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Download, UserPlus, Users, TrendingUp, Euro, Calculator } from "lucide-react";

// Mock data
const mockEmployees = [
  {
    id: "1",
    name: "Ana García",
    email: "ana.garcia@empresa.com",
    department: "Ventas",
    region: "Madrid", 
    role: "EMPLOYEE",
    status: "ACTIVE",
    expenseCount: 24,
    totalExpenses: 3450.80,
    thisMonth: 450.30
  },
  {
    id: "2",
    name: "Carlos López", 
    email: "carlos.lopez@empresa.com",
    department: "Marketing",
    region: "Barcelona",
    role: "EMPLOYEE", 
    status: "ACTIVE",
    expenseCount: 18,
    totalExpenses: 2890.50,
    thisMonth: 890.20
  },
  {
    id: "3",
    name: "María Fernández",
    email: "maria.fernandez@empresa.com", 
    department: "Operaciones",
    region: "Valencia",
    role: "ADMIN",
    status: "ACTIVE",
    expenseCount: 15,
    totalExpenses: 2156.75,
    thisMonth: 320.45
  },
  {
    id: "4",
    name: "David Ruiz",
    email: "david.ruiz@empresa.com",
    department: "IT",
    region: "Madrid",
    role: "EMPLOYEE",
    status: "INACTIVE", 
    expenseCount: 12,
    totalExpenses: 1876.20,
    thisMonth: 0.00
  }
];

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = mockEmployees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEmployees = mockEmployees.length;
  const totalExpenseCount = mockEmployees.reduce((sum, emp) => sum + emp.expenseCount, 0);
  const totalExpenseAmount = mockEmployees.reduce((sum, emp) => sum + emp.totalExpenses, 0);
  const averagePerEmployee = totalExpenseAmount / totalEmployees;

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE" ? 
      <Badge variant="default" className="bg-green-600">Activo</Badge> : 
      <Badge variant="secondary">Inactivo</Badge>;
  };

  const getRoleBadge = (role: string) => {
    return role === "ADMIN" ? 
      <Badge variant="default">Admin</Badge> : 
      <Badge variant="outline">Empleado</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Empleados</h1>
            <p className="text-muted-foreground">
              Gestión de empleados y análisis de gastos
            </p>
          </div>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Empleado
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                empleados registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos Registrados</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExpenseCount}</div>
              <p className="text-xs text-muted-foreground">
                gastos totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gasto Total</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExpenseAmount.toFixed(2)}€</div>
              <p className="text-xs text-muted-foreground">
                importe total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio por Empleado</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averagePerEmployee.toFixed(2)}€</div>
              <p className="text-xs text-muted-foreground">
                gasto promedio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar empleado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Región</TableHead>
                <TableHead className="text-right">Gastos (#)</TableHead>
                <TableHead className="text-right">Total (€)</TableHead>
                <TableHead className="text-right">Este Mes (€)</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">{employee.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{getRoleBadge(employee.role)}</TableCell>
                  <TableCell>{employee.region}</TableCell>
                  <TableCell className="text-right">{employee.expenseCount}</TableCell>
                  <TableCell className="text-right">{employee.totalExpenses.toFixed(2)}€</TableCell>
                  <TableCell className="text-right">{employee.thisMonth.toFixed(2)}€</TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Results info */}
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredEmployees.length} de {mockEmployees.length} empleados
        </div>
      </div>
    </MainLayout>
  );
};

export default Employees;