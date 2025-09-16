import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExtractedExpenseData {
  vendor: string;
  expense_date: string;
  amount_gross: number;
  tax_vat: number;
  amount_net: number;
  currency: string;
  category_suggestion: string;
  payment_method_guess: string;
  project_code_guess: string | null;
  document_type: 'TICKET' | 'FACTURA';
  notes: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!geminiApiKey) {
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const authHeader = req.headers.get('authorization');

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Try to verify user authentication, but allow demo mode
    let user = null;
    let userData = null;
    
    if (authHeader && authHeader !== 'Bearer null' && authHeader !== 'Bearer undefined') {
      const { data: authData, error: authError } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      
      if (!authError && authData.user) {
        user = authData.user;
        
        // Get user's organization
        const { data: userOrgData } = await supabase
          .from('users')
          .select('organization_id')
          .eq('id', user.id)
          .single();
          
        userData = userOrgData;
      }
    }

    console.log('Auth status:', user ? 'Authenticated' : 'Demo mode');

    console.log('Processing file:', file.name, 'Size:', file.size);

    // Convert file to base64 for Gemini
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            vendor: { type: "string" },
            expense_date: { type: "string", format: "date" },
            amount_gross: { type: "number" },
            tax_vat: { type: "number" },
            amount_net: { type: "number" },
            currency: { type: "string" },
            category_suggestion: { 
              type: "string",
              enum: ["Transporte", "Viajes", "Dietas", "Material", "Software", "Alojamiento", "Otros"]
            },
            payment_method_guess: {
              type: "string", 
              enum: ["CARD", "CASH", "TRANSFER", "OTHER"]
            },
            project_code_guess: { type: "string" },
            document_type: {
              type: "string",
              enum: ["TICKET", "FACTURA"]
            },
            notes: { type: "string" }
          },
          required: ["vendor", "expense_date", "amount_gross", "tax_vat", "amount_net", "currency", "category_suggestion", "payment_method_guess", "document_type"]
        }
      }
    });

    const prompt = `
    Analiza este recibo/factura y extrae la información siguiendo estas reglas:

    1. TIPO DE DOCUMENTO:
       - TICKET: Recibo simple, generalmente sin NIF/CIF detallado del emisor
       - FACTURA: Documento fiscal formal con NIF/CIF del emisor, desglose de IVA claro

    2. CAMPOS OBLIGATORIOS:
       - vendor: Nombre del comercio/empresa (normalizado, sin caracteres especiales)
       - expense_date: Fecha en formato YYYY-MM-DD
       - amount_gross: Importe total final
       - tax_vat: IVA (0 si no está desglosado claramente)
       - amount_net: Base imponible (amount_gross - tax_vat)
       - currency: "EUR" por defecto
       - category_suggestion: Una de las categorías válidas
       - payment_method_guess: Método de pago más probable
       - document_type: TICKET o FACTURA según las reglas anteriores

    3. VALIDACIONES:
       - amount_gross = amount_net + tax_vat (con precisión de 2 decimales)
       - Si no hay IVA desglosado claramente, tax_vat = 0
       - Fechas válidas y coherentes

    Extrae la información de este documento:
    `;

    let retries = 0;
    let extractedData: ExtractedExpenseData | null = null;

    while (retries < 3 && !extractedData) {
      try {
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: file.type
            }
          }
        ]);

        const response = await result.response;
        const text = response.text();
        console.log('Raw Gemini response:', text);

        const parsed = JSON.parse(text);
        
        // Validate and normalize the response
        extractedData = {
          vendor: parsed.vendor?.trim() || 'Comercio desconocido',
          expense_date: parsed.expense_date || new Date().toISOString().split('T')[0],
          amount_gross: Number(parsed.amount_gross) || 0,
          tax_vat: Number(parsed.tax_vat) || 0,
          amount_net: Number(parsed.amount_net) || 0,
          currency: parsed.currency || 'EUR',
          category_suggestion: parsed.category_suggestion || 'Otros',
          payment_method_guess: parsed.payment_method_guess || 'CARD',
          project_code_guess: parsed.project_code_guess || null,
          document_type: parsed.document_type || 'TICKET',
          notes: parsed.notes || null
        };

        // Validate amount coherence
        const expectedGross = Math.round((extractedData.amount_net + extractedData.tax_vat) * 100) / 100;
        if (Math.abs(extractedData.amount_gross - expectedGross) > 0.01) {
          extractedData.amount_gross = expectedGross;
        }

        break;
      } catch (error) {
        console.error(`Attempt ${retries + 1} failed:`, error);
        retries++;
        if (retries >= 3) {
          return new Response(JSON.stringify({ 
            error: 'Failed to extract data after multiple attempts',
            details: error.message 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
    }

    if (!extractedData) {
      return new Response(JSON.stringify({ error: 'Failed to extract expense data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Successfully extracted data:', extractedData);

    return new Response(JSON.stringify({
      success: true,
      data: extractedData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in ai-extract-expense function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);