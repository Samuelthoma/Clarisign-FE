import "@/src/styles/globals.css";
import { PendingRegistarationTable } from "../components/tables/pending-registration-table";

export default function PendingRegistarationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pending Registrations</h1>

      <PendingRegistarationTable />
    </div>
  );
}
