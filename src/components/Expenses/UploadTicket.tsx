import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ExtractedData {
  vendor: string;
  expense_date: string;
  amount_gross: number;
  amount_net: number;
  tax_vat: number;
  currency: string;
  category_suggestion: string;
  payment_method_guess: string;
  project_code_guess: string | null;
  notes: string | null;
}

export const UploadTicket = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (file: File) => {
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de archivo no válido",
        description: "Solo se permiten archivos JPG, PNG o PDF",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "Archivo demasiado grande",
        description: "El tamaño máximo permitido es 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    toast({
      title: "Archivo cargado",
      description: `${file.name} listo para analizar`,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const simulateAIAnalysis = async (): Promise<ExtractedData> => {
    // Simulate API call delay and progress
    for (let progress = 0; progress <= 100; progress += 10) {
      setAnalysisProgress(progress);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Mock extracted data - in real app this would come from Gemini API
    return {
      vendor: "Restaurante La Tasca",
      expense_date: "2024-01-15",
      amount_gross: 45.80,
      amount_net: 37.85,
      tax_vat: 7.95,
      currency: "EUR",
      category_suggestion: "Dietas",
      payment_method_guess: "CARD",
      project_code_guess: "PRJ-001",
      notes: "Comida de trabajo con cliente"
    };
  };

  const handleAnalyzeWithAI = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      const data = await simulateAIAnalysis();
      setExtractedData(data);
      
      toast({
        title: "¡Análisis completado!",
        description: "Los datos han sido extraídos del ticket. Revisa y confirma.",
      });
    } catch (error) {
      toast({
        title: "Error en el análisis",
        description: "No se pudieron extraer los datos. Completa manualmente.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "¡Gasto registrado!",
      description: "El gasto ha sido enviado para aprobación.",
    });

    // Reset form
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedData(null);
    setIsSubmitting(false);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Subir Ticket</h1>
        <p className="text-muted-foreground">
          Captura o sube tu ticket y deja que la IA extraiga los datos automáticamente
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* File Upload Section */}
        <Card className="expense-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>1. Subir Ticket</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedFile ? (
              <>
                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Arrastra tu ticket aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG o PDF (máx. 10MB)
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Seleccionar Archivo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCameraCapture}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Tomar Foto
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </>
            ) : (
              <>
                {/* File Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium truncate">
                        {selectedFile.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {previewUrl && (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-border"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">
                      {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                    </Badge>
                    <Badge variant="secondary">
                      {selectedFile.type.split('/')[1].toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* AI Analysis */}
                {!extractedData && (
                  <div className="space-y-4">
                    {isAnalyzing && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                          <span className="text-sm">Analizando con IA...</span>
                        </div>
                        <Progress value={analysisProgress} />
                      </div>
                    )}

                    <Button
                      onClick={handleAnalyzeWithAI}
                      disabled={isAnalyzing}
                      className="w-full"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isAnalyzing ? "Analizando..." : "Analizar con IA"}
                    </Button>
                  </div>
                )}

                {extractedData && (
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-status-approved" />
                      <span className="text-sm font-medium text-status-approved">
                        Datos extraídos correctamente
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Revisa los datos en el formulario y haz las correcciones necesarias
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Expense Form */}
        <Card className="expense-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>2. Datos del Gasto</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Comercio</Label>
                  <Input
                    id="vendor"
                    placeholder="Nombre del comercio"
                    defaultValue={extractedData?.vendor || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    defaultValue={extractedData?.expense_date || ""}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="amount_net">Importe Neto</Label>
                  <Input
                    id="amount_net"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    defaultValue={extractedData?.amount_net || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_vat">IVA</Label>
                  <Input
                    id="tax_vat"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    defaultValue={extractedData?.tax_vat || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount_gross">Total</Label>
                  <Input
                    id="amount_gross"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    defaultValue={extractedData?.amount_gross || ""}
                    required
                    className="font-semibold"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select defaultValue={extractedData?.category_suggestion || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Viajes</SelectItem>
                      <SelectItem value="meals">Dietas</SelectItem>
                      <SelectItem value="transport">Transporte</SelectItem>
                      <SelectItem value="accommodation">Alojamiento</SelectItem>
                      <SelectItem value="materials">Material</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="others">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_method">Método de Pago</Label>
                  <Select defaultValue={extractedData?.payment_method_guess || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CARD">Tarjeta</SelectItem>
                      <SelectItem value="CASH">Efectivo</SelectItem>
                      <SelectItem value="TRANSFER">Transferencia</SelectItem>
                      <SelectItem value="OTHER">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Código de Proyecto (Opcional)</Label>
                <Select defaultValue={extractedData?.project_code_guess || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proyecto" />  
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRJ-001">PRJ-001 - Desarrollo Web</SelectItem>
                    <SelectItem value="PRJ-CLIENTE-A">PRJ-CLIENTE-A - Cliente A</SelectItem>
                    <SelectItem value="INT-OPS">INT-OPS - Operaciones Internas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas (Opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Descripción adicional del gasto..."
                  defaultValue={extractedData?.notes || ""}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  type="submit"
                  disabled={!selectedFile || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Guardando..." : "Registrar Gasto"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Reset form and start over
                    clearFile();
                  }}
                >
                  Limpiar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};