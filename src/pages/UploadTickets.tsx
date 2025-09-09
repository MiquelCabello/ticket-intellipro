import { MainLayout } from "@/components/Layout/MainLayout";
import { UploadTicket } from "@/components/Expenses/UploadTicket";

const UploadTickets = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subir Tickets</h1>
          <p className="text-muted-foreground">
            Sube tus recibos y gastos para su procesamiento automático
          </p>
        </div>

        {/* Upload Component */}
        <UploadTicket />
      </div>
    </MainLayout>
  );
};

export default UploadTickets;