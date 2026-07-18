import {
  LogIn,
  LogOut,
  Upload,
  UserPlus,
  UserMinus,
  Save,
  Send,
  PenTool,
  XCircle,
  CheckCircle2,
  Eye,
  Download,
  ClipboardList,
} from "lucide-react";

export type FieldType = "SIGNATURE";

export type SignatureMode = "DRAWN" | "TYPED";

export type SignatureStatus = "ACTIVE" | "PENDING" | "REJECTED" | "REVOKED";

export interface DraftField {
  id: string;
  type: FieldType;
  mode: SignatureMode;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  status: SignatureStatus;
  signerId?: string;
}

export type SignerStatus =
  | "DRAFT"
  | "INVITED"
  | "WAITING"
  | "SIGNED"
  | "REJECTED";

export type Signer = {
  id: string;
  name: string;
  email: string;
  order: number;
  status: SignerStatus;
  color: string;
  isOwner?: boolean;
};

export type UserActionType =
  | "LOGIN"
  // | "LOGOUT"
  | "UPLOAD_DOCUMENT"
  | "ADD_COLLABORATOR"
  | "REMOVE_COLLABORATOR"
  | "SAVE_LAYOUT_DRAFT"
  | "PUBLISH_DOCUMENT"
  | "SIGN_DOCUMENT"
  | "REJECT_DOCUMENT"
  | "FINALIZE_DOCUMENT"
  | "VIEW_DOCUMENT"
  | "DOWNLOAD_DOCUMENT"
  | "DOWNLOAD_AUDIT_LOG";

export const ActionTypeLabels: Record<UserActionType, string> = {
  LOGIN: "Login",
  // LOGOUT: "Logout",
  UPLOAD_DOCUMENT: "Upload Document",
  ADD_COLLABORATOR: "Add Collaborator",
  REMOVE_COLLABORATOR: "Remove Collaborator",
  SAVE_LAYOUT_DRAFT: "Save Layout Draft",
  PUBLISH_DOCUMENT: "Publish Document",
  SIGN_DOCUMENT: "Sign Document",
  REJECT_DOCUMENT: "Reject Document",
  FINALIZE_DOCUMENT: "Finalize Document",
  VIEW_DOCUMENT: "View Document",
  DOWNLOAD_DOCUMENT: "Download Document",
  DOWNLOAD_AUDIT_LOG: "Download Audit Log",
};

export const ActionStyleConfig: Record<
  UserActionType,
  { icon: React.ElementType; colorClass: string }
> = {
  LOGIN: {
    icon: LogIn,
    colorClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  // LOGOUT: {
  //   icon: LogOut,
  //   colorClass: "bg-slate-100 text-slate-800 border-slate-200",
  // },
  UPLOAD_DOCUMENT: {
    icon: Upload,
    colorClass: "bg-blue-100 text-blue-800 border-blue-200",
  },
  ADD_COLLABORATOR: {
    icon: UserPlus,
    colorClass: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  REMOVE_COLLABORATOR: {
    icon: UserMinus,
    colorClass: "bg-rose-100 text-rose-800 border-rose-200",
  },
  SAVE_LAYOUT_DRAFT: {
    icon: Save,
    colorClass: "bg-amber-100 text-amber-800 border-amber-200",
  },
  PUBLISH_DOCUMENT: {
    icon: Send,
    colorClass: "bg-violet-100 text-violet-800 border-violet-200",
  },
  SIGN_DOCUMENT: {
    icon: PenTool,
    colorClass: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  REJECT_DOCUMENT: {
    icon: XCircle,
    colorClass: "bg-red-100 text-red-800 border-red-200",
  },
  FINALIZE_DOCUMENT: {
    icon: CheckCircle2,
    colorClass: "bg-green-100 text-green-800 border-green-200",
  },
  VIEW_DOCUMENT: {
    icon: Eye,
    colorClass: "bg-sky-100 text-sky-800 border-sky-200",
  },
  DOWNLOAD_DOCUMENT: {
    icon: Download,
    colorClass: "bg-slate-100 text-slate-800 border-slate-200",
  },
  DOWNLOAD_AUDIT_LOG: {
    icon: ClipboardList,
    colorClass: "bg-purple-100 text-purple-800 border-purple-200",
  },
};

export interface ActivityLogEntry {
  timestamp: string;
  userEmail: string;
  ipAddress: string;
  actionDetail: UserActionType;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  offset: number;
}

export interface ActivityLogResponse {
  errorSchema: {
    code: string;
    message: string;
  };
  outputSchema: {
    content: ActivityLogEntry[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    empty: boolean;
  };
}
