import {
  CheckCircle2,
  Clock,
  XCircle,
  FileEdit,
  CircleDot,
} from "lucide-react";

export const StatusBadge = ({ status }: any) => {
  const normalizedStatus = status?.toLowerCase() || "";

  let config = {
    classes: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    Icon: CircleDot,
  };

  switch (normalizedStatus) {
    case "finalized":
      config = {
        classes: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        Icon: CheckCircle2,
      };
      break;
    case "pending":
      config = {
        classes: "bg-amber-50 text-amber-700 ring-amber-600/20",
        Icon: Clock,
      };
      break;
    case "revoked":
      config = {
        classes: "bg-rose-50 text-rose-700 ring-rose-600/20",
        Icon: XCircle,
      };
      break;
    case "draft":
      config = {
        classes: "bg-slate-100 text-slate-700 ring-slate-500/20",
        Icon: FileEdit,
      };
      break;
  }

  const { classes, Icon } = config;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-bold ring-1 ring-inset uppercase tracking-wider ${classes}`}
    >
      <Icon size={12} strokeWidth={2.5} />
      {status}
    </span>
  );
};
