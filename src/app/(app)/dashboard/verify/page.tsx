"use client";

import { useRef, useState } from "react";
import {
  FileCheck,
  ShieldCheck,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { verifyDocument } from "@/lib/api/DocumentApi";

interface VerificationResponse {
  document: string;
  signatureCount: number;
  signatures: SignatureResult[];
}

interface SignatureResult {
  status: {
    overall: string;
    integrity: boolean;
    trusted: boolean;
    coversEntireDocument: boolean;
  };

  signer: {
    subject: Record<string, string>;
    issuer: Record<string, string>;
    serialNumber: string;
    validFrom: string;
    validUntil: string;
    fingerprintSHA256: string;
  };

  signature: {
    fieldName?: string;
    digestAlgorithm: string;
    signatureAlgorithm: string;
    signingTime?: string;
  };

  validation: {
    summary: string;
  };
}

export default function VerifyPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>(
    {},
  );

  const toggleCard = (index: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleVerify = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      const data = await verifyDocument(file);

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VALID":
        return (
          <Badge className="gap-1">
            <CheckCircle2 className="w-3 h-3" />
            VALID
          </Badge>
        );

      case "VALID_BUT_UNTRUSTED":
        return (
          <Badge variant="default" className="gap-1">
            <AlertCircle className="w-3 h-3" />
            UNTRUSTED
          </Badge>
        );

      default:
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" />
            INVALID
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      <header className="pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            PDF Signature Verification
          </h1>
          <p className="text-slate-500 mt-1.5 text-lg font-medium">
            Verify digital signatures and certificate integrity.
          </p>
        </div>
      </header>
      <div className="max-w-5xl mx-auto space-y-6 my-8">
        <Card className="rounded-xl shadow-sm border-0">
          <CardContent className="p-6 space-y-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-3xl p-10 cursor-pointer transition hover:bg-muted/40"
            >
              <div className="flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                  <Upload className="w-8 h-8" />
                </div>

                <div>
                  <p className="font-semibold text-lg">Upload Signed PDF</p>

                  <p className="text-sm text-muted-foreground mt-1">
                    Click to browse or drag & drop your document.
                  </p>
                </div>

                {file && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-sm font-medium">
                    <FileCheck className="w-4 h-4" />
                    {file.name}
                  </div>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleSelectFile}
            />

            <Button
              disabled={!file || loading}
              onClick={handleVerify}
              className="w-full h-12 rounded-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying Signature...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Verify PDF Signature
                </>
              )}
            </Button>

            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <Card className="rounded-xl shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Verification Result
                    </h2>

                    <p className="text-muted-foreground font-mono text-sm mt-1">
                      {result.document}
                    </p>
                  </div>

                  <Badge variant="outline" className="text-sm px-4 py-2">
                    {result.signatureCount} Signature(s)
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {result.signatures.map((signature, index) => (
              <Card key={index} className="rounded-xl shadow-sm border-0">
                <CardContent className="p-6 space-y-6">
                  <button
                    onClick={() => toggleCard(index)}
                    className="w-full flex items-center justify-between gap-4 text-left"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">
                        Signature #{index + 1}
                      </h3>

                      <p className="text-sm font-mono text-muted-foreground mt-1">
                        {signature.signature.fieldName || "Unnamed Signature"}
                      </p>
                    </div>

                    {getStatusBadge(signature.status.overall)}

                    <div>
                      {expandedCards[index] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  <Separator />

                  {expandedCards[index] && (
                    <>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-bold">
                              Signer Common Name
                            </p>

                            <p className="font-medium font-mono mt-1 break-all text-muted-foreground">
                              {signature.signer.subject?.common_name ||
                                "Unknown"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              Organization
                            </p>

                            <p className="font-medium font-mono mt-1 text-muted-foreground">
                              {signature.signer.subject?.organization_name ||
                                "N/A"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              Organizational Unit
                            </p>

                            <p className="font-medium font-mono mt-1 text-muted-foreground">
                              {signature.signer.subject
                                ?.organizational_unit_name || "N/A"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              Issuer
                            </p>

                            <p className="font-medium font-mono mt-1 break-all text-muted-foreground">
                              {signature.signer.issuer?.common_name ||
                                "Unknown"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              Signing Time
                            </p>

                            <p className="font-medium font-mono mt-1 text-muted-foreground">
                              {signature.signature.signingTime || "N/A"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              Certificate Valid From
                            </p>

                            <p className="font-medium font-mono mt-1 text-muted-foreground">
                              {signature.signer.validFrom}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              Certificate Valid Until
                            </p>

                            <p className="font-medium font-mono mt-1 text-muted-foreground">
                              {signature.signer.validUntil}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-bold">
                              Field Name
                            </p>

                            <p className="font-medium font-mono mt-1 break-all text-muted-foreground">
                              {signature.signature.fieldName || "N/A"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              Digest Algorithm
                            </p>

                            <p className="font-medium font-mono mt-1 uppercase text-muted-foreground">
                              {signature.signature.digestAlgorithm}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              Signature Algorithm
                            </p>

                            <p className="font-medium font-mono mt-1 uppercase break-all text-muted-foreground">
                              {signature.signature.signatureAlgorithm}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              Serial Number
                            </p>

                            <p className="font-medium font-mono mt-1 whitespace-pre-wrap wrap-break-word leading-relaxed text-muted-foreground">
                              {signature.signer.serialNumber}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              SHA256 Fingerprint
                            </p>

                            <p className="font-medium font-mono mt-1 whitespace-pre-wrap wrap-break-word leading-relaxed text-muted-foreground">
                              {signature.signer.fingerprintSHA256.match(/.{1,32}/g)?.join("\n")}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              Integrity
                            </p>

                            <p className="font-medium font-mono mt-1 text-muted-foreground">
                              {signature.status.integrity ? "Valid" : "Invalid"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              Trusted
                            </p>

                            <p className="font-medium font-mono mt-1 text-muted-foreground">
                              {signature.status.trusted
                                ? "Trusted"
                                : "Untrusted"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              Covers Entire Document
                            </p>

                            <p className="font-medium font-mono mt-1 text-muted-foreground">
                              {signature.status.coversEntireDocument
                                ? "Yes"
                                : "No"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <p className="text-sm font-bold">
                          Validation Summary
                        </p>

                        <div className="rounded-2xl font-mono bg-muted text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-muted-foreground">
                          {signature.validation.summary}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
