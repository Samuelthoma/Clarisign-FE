import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ActivityLogEntry,
  ActionTypeLabels,
  UserActionType,
  ActionStyleConfig,
} from "@/src/modules/document/types";

import { LogIn, User, FileText, Loader2 } from "lucide-react";
import {
  getActivityLogsApi,
  GetActivityLogsParams,
  getAuditFile,
} from "@/lib/api/AuditLogApi";
import { toast } from "sonner";

export default function ActivityLogTable() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchActivityLogs = async (page: number, action: string) => {
    setLoading(true);
    try {
      const params: GetActivityLogsParams = {
        page: page,
        size: 10,
        ...(action !== "ALL" && { actionType: action as UserActionType }),
      };

      const outputSchema = await getActivityLogsApi(params);

      setLogs(outputSchema.content);
      setTotalPages(outputSchema.totalPages);
      setCurrentPage(outputSchema.number);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs(currentPage, selectedAction);
  }, [currentPage, selectedAction]);

  const handleActionFilterChange = (value: string) => {
    setSelectedAction(value);
    setCurrentPage(0);
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const { url } = await getAuditFile();

      const link = document.createElement("a");
      link.href = url;
      const timestamp = format(new Date(), "yyyyMMdd_HHmm");
      link.setAttribute("download", `Activity_Log_${timestamp}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF", error);
      toast("Activity log exported successfully");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (isoString: string) => {
    return format(new Date(isoString), "MMM dd, yyyy • HH:mm");
  };

  return (
    <div className="w-full space-y-4 p-5 bg-white rounded-xl shadow-sm border border-slate-200/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Audit Trail
        </h2>

        <div className="flex items-center gap-3">
          <div className="w-48 sm:w-64">
            <Select
              value={selectedAction}
              onValueChange={handleActionFilterChange}
            >
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Actions</SelectItem>
                {Object.entries(ActionTypeLabels).map(([key, label]) => {
                  const actionKey = key as UserActionType;
                  const Icon = ActionStyleConfig[actionKey]?.icon || LogIn;
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-slate-500" />
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300 shadow-sm bg-blue-100 hover:bg-blue-200 hover:border-gray-400"
            onClick={handleDownloadPdf}
            disabled={isDownloading || loading || logs.length === 0}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
            ) : (
              <FileText className="w-4 h-4 text-slate-600" />
            )}
            <span className="hidden sm:inline-block">
              {isDownloading ? "Exporting..." : "Export PDF"}
            </span>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="text-right">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-slate-500"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    <span>Loading activity logs...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-slate-500"
                >
                  No activity logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log, index) => {
                const actionType = log.actionDetail as UserActionType;
                const styleConfig = ActionStyleConfig[actionType];
                const Icon = styleConfig?.icon || LogIn;
                const colorClass =
                  styleConfig?.colorClass || "bg-slate-100 text-slate-800";

                return (
                  <TableRow
                    key={`${log.timestamp}-${index}`}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-600 text-sm">
                      {formatDate(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <span className="text-slate-700 font-medium">
                          {log.userEmail}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${colorClass}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {ActionTypeLabels[actionType] || log.actionDetail}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-slate-500 text-sm font-mono">
                      {log.ipAddress}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 pt-2">
        <div className="text-sm font-medium text-slate-500">
          Page {currentPage + 1} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0 || loading}
            className="text-slate-600"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
            }
            disabled={currentPage >= totalPages - 1 || loading}
            className="text-slate-600"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
