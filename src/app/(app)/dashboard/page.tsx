"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadDocumentApi } from "@/lib/api/DocumentApi";
import "@/src/styles/globals.css"

export default function DashboardPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF allowed");
      return;
    }

    try {
      setLoading(true);

      const res = await uploadDocumentApi(file);

      router.push(`/document/${res.id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div
        className="border-2 border-dashed rounded-xl p-10 w-96 text-center cursor-pointer hover:bg-gray-50 transition"
        onClick={() => inputRef.current?.click()}
      >
        {loading ? (
          <p>Uploading...</p>
        ) : (
          <>
            <p className="text-lg font-medium">
              Click to Upload Document
            </p>
            <p className="text-sm text-gray-500">
              PDF only
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
}
