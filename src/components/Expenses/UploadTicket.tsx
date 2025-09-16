import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, FileText, X, CheckCircle, Eye, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDecimal, DecimalValue, toDecimal } from "@/utils/decimal";
import { formatWithCurrency, isValidCurrencyCode, CurrencyCode } from "@/utils/currency";
import { logger } from "@/utils/log";
import { generateSecureToken } from "@/utils/security";

interface ExtractedData {
  vendor: string;
  expense_date: string;
  amount_gross: DecimalValue;  // Use decimal type
  tax_vat: DecimalValue;
  amount_net: DecimalValue;
  currency: string;
  category_suggestion: string;
  payment_method_guess: 'CARD' | 'CASH' | 'TRANSFER' | 'OTHER';
  project_code_guess: string | null;
  document_type: 'TICKET' | 'FACTURA';
  notes: string | null;
}

interface UploadProgress {
  stage: 'uploading' | 'processing' | 'validating' | 'complete';
  progress: number;
  message: string;
}

export const UploadTicket = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectCodes, setProjectCodes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // For demo purposes, create mock user data if no auth
        if (!user) {
          const mockUser = {
            id: 'demo-user',
            organization_id: 'demo-org',
            name: 'Demo User',
            email: 'demo@example.com'
          };
          setCurrentUser(mockUser);
          
          // Set demo categories
          setCategories([
            { id: 'cat-1', name: 'Comidas', organization_id: 'demo-org' },
            { id: 'cat-2', name: 'Transporte', organization_id: 'demo-org' },
            { id: 'cat-3', name: 'Alojamiento', organization_id: 'demo-org' }
          ]);
          
          // Set demo project codes
          setProjectCodes([
            { id: 'proj-1', name: 'Proyecto A', code: 'PROJ-A', organization_id: 'demo-org' },
            { id: 'proj-2', name: 'Proyecto B', code: 'PROJ-B', organization_id: 'demo-org' }
          ]);
          return;
        }

        const { data: userData } = await supabase
          .from('users')
          .select('*, organization:organizations(*)')
          .eq('id', user.id)
          .single();

        setCurrentUser(userData);

        if (userData?.organization_id) {
          // Load project codes
          const { data: projectCodesData } = await supabase
            .from('project_codes')
            .select('*')
            .eq('organization_id', userData.organization_id)
            .eq('status', 'ACTIVE');

          // Load categories
          const { data: categoriesData } = await supabase
            .from('categories')
            .select('*')
            .eq('organization_id', userData.organization_id);

          setProjectCodes(projectCodesData || []);
          setCategories(categoriesData || []);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Tipo de archivo no válido. Solo se permiten JPG, PNG y PDF.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo 10MB.');
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

    // Reset previous analysis
    setExtractedData(null);
    setUploadProgress(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleAnalyzeWithAI = async () => {
    if (!selectedFile || !currentUser) return;

    const requestId = generateSecureToken(16);
    
    setIsAnalyzing(true);
    setUploadProgress({ stage: 'uploading', progress: 0, message: 'Subiendo archivo...' });

    try {
      logger.info('ticket_analysis_started', { 
        requestId,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        userId: currentUser.id
      });

      // Step 1: Upload file
      setUploadProgress({ stage: 'uploading', progress: 33, message: 'Subiendo archivo...' });
      
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Step 2: Process with AI
      setUploadProgress({ stage: 'processing', progress: 66, message: 'Procesando con IA...' });

      const { data: { session } } = await supabase.auth.getSession();
      const response = await supabase.functions.invoke('ai-extract-expense', {
        body: formData,
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Idempotency-Key': requestId  // Add idempotency key
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Error en el análisis');
      }

      // Step 3: Validate results
      setUploadProgress({ stage: 'validating', progress: 90, message: 'Validando información...' });

      const extracted = response.data?.data;
      if (extracted) {
        // Validate and parse currency
        if (!isValidCurrencyCode(extracted.currency)) {
          logger.error('invalid_currency_extracted', { 
            requestId, 
            currency: extracted.currency,
            fileName: selectedFile.name 
          });
          throw new Error(`Moneda no válida: ${extracted.currency}`);
        }

        // Parse amounts using decimal utilities
        const processedData: ExtractedData = {
          ...extracted,
          amount_gross: parseFloat(extracted.amount_gross.toString()),
          tax_vat: parseFloat(extracted.tax_vat.toString()),
          amount_net: parseFloat(extracted.amount_net.toString()),
        };

        setExtractedData(processedData);
        setUploadProgress({ stage: 'complete', progress: 100, message: 'Análisis completado' });
        
        logger.info('ticket_analysis_completed', { 
          requestId,
          vendor: processedData.vendor,
          amount: processedData.amount_gross.toString(),
          currency: processedData.currency,
          category: processedData.category_suggestion
        });
        
        toast.success('Ticket analizado correctamente');
      } else {
        throw new Error('No se pudo extraer información del ticket');
      }

    } catch (error) {
      logger.error('ticket_analysis_failed', { 
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
        fileName: selectedFile.name,
        userId: currentUser.id
      });
      console.error('Error analyzing ticket:', error);
      toast.error(`Error al analizar el ticket: ${error.message}`);
      setUploadProgress(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitExpense = async () => {
    if (!extractedData || !selectedFile) return;

    const requestId = generateSecureToken(16);
    setIsSubmitting(true);
    
    try {
      logger.info('expense_submission_started', { 
        requestId,
        vendor: extractedData.vendor,
        amount: extractedData.amount_gross.toString(),
        currency: extractedData.currency,
        userId: currentUser?.id || 'demo'
      });

      // Demo mode: just show success without saving to database
      if (!currentUser) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast("Gasto procesado (Demo)", {
          description: `${extractedData.vendor}: €${extractedData.amount_gross.toFixed(2)}`,
        });

        // Reset form
        setSelectedFile(null);
        setExtractedData(null);
        setUploadProgress(null);
        setIsSubmitting(false);
        return;
      }

      // Find category ID
      const category = categories.find(c => c.name === extractedData.category_suggestion);
      const projectCode = projectCodes.find(p => p.code === extractedData.project_code_guess);

      // Calculate hash for deduplication
      const hashInput = `${selectedFile.name}-${extractedData.vendor}-${extractedData.expense_date}-${extractedData.amount_gross.toString()}`;
      const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(hashInput));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash_dedupe = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Create expense record with proper decimal values
      const expenseData = {
        organization_id: currentUser.organization_id,
        employee_id: currentUser.id,
        project_code_id: projectCode?.id || null,
        category_id: category?.id || categories[0]?.id,
        vendor: extractedData.vendor,
        expense_date: extractedData.expense_date,
        amount_net: toDecimal(extractedData.amount_net),
        tax_vat: toDecimal(extractedData.tax_vat),
        amount_gross: toDecimal(extractedData.amount_gross),
        currency: extractedData.currency,
        payment_method: extractedData.payment_method_guess as 'CARD' | 'CASH' | 'TRANSFER' | 'OTHER',
        status: 'PENDING' as const,
        notes: extractedData.notes,
        source: 'AI_EXTRACTED' as const,
        document_type: extractedData.document_type as 'TICKET' | 'FACTURA',
        hash_dedupe
      };

      const { data: expense, error } = await supabase
        .from('expenses')
        .insert(expenseData)
        .select()
        .single();

      if (error) throw error;

      logger.info('expense_submission_completed', { 
        requestId,
        expenseId: expense.id,
        amount: extractedData.amount_gross.toString(),
        currency: extractedData.currency,
        vendor: extractedData.vendor
      });

      toast.success('Gasto registrado correctamente');
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setExtractedData(null);
      setUploadProgress(null);

    } catch (error) {
      logger.error('expense_submission_failed', { 
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
        vendor: extractedData.vendor,
        amount: extractedData.amount_gross.toString(),
        userId: currentUser.id
      });
      console.error('Error submitting expense:', error);
      toast.error('Error al registrar el gasto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedData(null);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subir Ticket</h1>
        <p className="text-muted-foreground">
          Sube tus recibos y gastos para su procesamiento automático
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedFile ? (
              <div>
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Arrastra tu ticket aquí</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    o haz clic para seleccionar archivo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formatos soportados: JPG, PNG, PDF (máx. 10MB)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*,application/pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar archivo
                  </Button>

                  <input 
                    ref={cameraInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    capture="environment"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Tomar foto
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFile} aria-label="Eliminar archivo seleccionado">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {previewUrl && (
                  <div className="border rounded-lg overflow-hidden">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {uploadProgress && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{uploadProgress.message}</span>
                      <span className="text-sm text-muted-foreground">{uploadProgress.progress}%</span>
                    </div>
                    <Progress value={uploadProgress.progress} />
                  </div>
                )}

                {!extractedData && !isAnalyzing && (
                  <Button 
                    onClick={handleAnalyzeWithAI}
                    className="w-full"
                    disabled={isAnalyzing}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analizar con IA
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expense Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Gasto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!extractedData ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee">Empleado</Label>
                  <Input 
                    id="employee"
                    value={currentUser?.name || ''} 
                    disabled 
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="project_code">Código de Proyecto</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar proyecto..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projectCodes.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.code} - {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea 
                    id="notes"
                    placeholder="Notas opcionales sobre el gasto..."
                    rows={3}
                  />
                </div>

                <p className="text-sm text-muted-foreground text-center py-8">
                  Selecciona y analiza un ticket para ver la información extraída
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Comercio</Label>
                    <p className="font-medium">{extractedData.vendor}</p>
                  </div>
                  <div>
                    <Label>Fecha</Label>
                    <p className="font-medium">{extractedData.expense_date}</p>
                  </div>
                  <div>
                    <Label>Empleado</Label>
                    <p className="font-medium">{currentUser?.name}</p>
                  </div>
                  <div>
                    <Label>Importe Total</Label>
                    <p className="font-medium">
                      {formatWithCurrency(parseFloat(String(extractedData.amount_gross)), extractedData.currency as CurrencyCode)}
                    </p>
                  </div>
                  <div>
                    <Label>Categoría</Label>
                    <Badge variant="secondary">{extractedData.category_suggestion}</Badge>
                  </div>
                  <div>
                    <Label>Tipo de Documento</Label>
                    <Badge variant={extractedData.document_type === 'FACTURA' ? 'default' : 'outline'}>
                      {extractedData.document_type}
                    </Badge>
                  </div>
                </div>

                {extractedData.notes && (
                  <div>
                    <Label>Notas</Label>
                    <p className="text-sm text-muted-foreground">{extractedData.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSubmitExpense}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Registrando...' : 'Registrar Gasto'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearFile}
                    className="flex-1"
                  >
                    Subir otro ticket
                  </Button>
                </div>

                <Button 
                  variant="link" 
                  className="w-full"
                  onClick={() => window.location.href = '/expenses'}
                >
                  Ver todos los gastos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};