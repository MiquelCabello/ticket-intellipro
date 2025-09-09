import { Menu, Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex h-16 items-center px-4 lg:px-8">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="flex-1 max-w-md mr-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar gastos, comercios..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Spacer to push actions to the right */}
        <div className="flex-1"></div>

        {/* Actions - positioned at the far right */}
        <div className="flex items-center space-x-3 ml-auto">
          <Button size="sm" className="hidden sm:flex" asChild>
            <Link to="/upload">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Gasto
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              3
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  );
};