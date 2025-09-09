import { MainLayout } from "@/components/Layout/MainLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Eye, CheckCircle, XCircle, Filter } from "lucide-react";

// Mock data
const mockExpenses = [
  {
    id: "1",
    date: "2024-01-15",
    employee: "Ana García",
    project: "PRJ-001",
    vendor: "Taxi Barcelona",
    category: "Transporte",
    method: "Tarjeta",
    status: "PENDING",
    netAmount: 25.50,
    vat: 5.36,
    total: 30.86,
    hasReceipt: true
  },
  {
    id: "2", 
    date: "2024-01-14",
    employee: "Carlos López",
    project: "PRJ-CLIENTE-A",
    vendor: "Hotel Marriott",
    category: "Alojamiento",
    method: "Tarjeta",
    status: "APPROVED",
    netAmount: 120.00,
    vat: 25.20,
    total: 145.20,
    hasReceipt: true
  },
  {
    id: "3",
    date: "2024-01-13",
    employee: "María Fernández",
    project: "INT-OPS",
    vendor: "Restaurante El Celler",
    category: "Dietas",
    method: "Efectivo",
    status: "REJECTED",
    netAmount: 45.00,
    vat: 9.45,
    total: 54.45,
    hasReceipt: false
  }
];

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pendiente</Badge>;
      case "APPROVED":
        return <Badge variant="default" className="bg-green-600">Aprobado</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rechazado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredExpenses = mockExpenses.filter(expense => {
    const matchesSearch = expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gastos</h1>
          <p className="text-muted-foreground">
            Gestiona todos los gastos empresariales
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-1 gap-4 flex-col sm:flex-row">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por comercio o empleado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="APPROVED">Aprobado</SelectItem>
                <SelectItem value="REJECTED">Rechazado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Transporte">Transporte</SelectItem>
                <SelectItem value="Alojamiento">Alojamiento</SelectItem>
                <SelectItem value="Dietas">Dietas</SelectItem>
                <SelectItem value="Material">Material</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Otros">Otros</SelectItem>
              </SelectContent>
            </Select>
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
                <TableHead>Fecha</TableHead>
                <TableHead>Empleado</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Comercio</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Neto</TableHead>
                <TableHead className="text-right">IVA</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Ticket</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.employee}</TableCell>
                  <TableCell>{expense.project}</TableCell>
                  <TableCell>{expense.vendor}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.method}</TableCell>
                  <TableCell>{getStatusBadge(expense.status)}</TableCell>
                  <TableCell className="text-right">{expense.netAmount.toFixed(2)}€</TableCell>
                  <TableCell className="text-right">{expense.vat.toFixed(2)}€</TableCell>
                  <TableCell className="text-right font-medium">{expense.total.toFixed(2)}€</TableCell>
                  <TableCell>
                    {expense.hasReceipt ? (
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">Sin ticket</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {expense.status === "PENDING" && (
                        <>
                          <Button variant="outline" size="sm" className="text-green-600">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination info */}
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredExpenses.length} de {mockExpenses.length} gastos
        </div>
      </div>
    </MainLayout>
  );
};

export default Expenses;