import { useState } from "react";
import { CalendarDays, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

export const DashboardFilters = () => {
  const [dateRange, setDateRange] = useState("thisYear");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const activeFiltersCount = [dateRange, category, status].filter(
    (filter) => filter !== "all" && filter !== "thisYear"
  ).length;

  return (
    <div className="flex items-center space-x-2">
      {/* Date Range */}
      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="w-[140px]">
          <CalendarDays className="w-4 h-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="thisYear">Este año</SelectItem>
          <SelectItem value="lastYear">Año anterior</SelectItem>
          <SelectItem value="thisMonth">Este mes</SelectItem>
          <SelectItem value="lastMonth">Mes anterior</SelectItem>
          <SelectItem value="last90">Últimos 90 días</SelectItem>
          <SelectItem value="custom">Personalizado</SelectItem>
        </SelectContent>
      </Select>

      {/* Category Filter */}
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="travel">Viajes</SelectItem>
          <SelectItem value="meals">Dietas</SelectItem>
          <SelectItem value="transport">Transporte</SelectItem>
          <SelectItem value="accommodation">Alojamiento</SelectItem>
          <SelectItem value="materials">Material</SelectItem>
          <SelectItem value="software">Software</SelectItem>
          <SelectItem value="others">Otros</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pending">Pendientes</SelectItem>
          <SelectItem value="approved">Aprobados</SelectItem>
          <SelectItem value="rejected">Rechazados</SelectItem>
        </SelectContent>
      </Select>

      {/* Active Filters Indicator */}
      {activeFiltersCount > 0 && (
        <Badge variant="secondary" className="ml-2">
          <Filter className="w-3 h-3 mr-1" />
          {activeFiltersCount}
        </Badge>
      )}
    </div>
  );
};