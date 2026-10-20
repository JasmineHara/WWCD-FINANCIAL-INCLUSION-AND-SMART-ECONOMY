"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/tracker/TopBar";
import { UploadDropzone } from "@/components/tracker/UploadDropzone";
import { ArrowLeft } from "lucide-react";

export default function UploadDocumentPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setIsUploading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/tracker/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Upload failed.");
      }

      setStatus("Upload successful. Redirecting to tracker...");
      setTimeout(() => router.push("/tracker"), 800);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full min-h-screen pb-12">
      <TopBar title="Upload Document" />

      <main className="px-8 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Back navigation */}
        <div>
          <button
            type="button"
            onClick={() => router.push("/tracker")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Data Tracker
          </button>
        </div>

        <div 
          className="rounded-3xl bg-surface border p-8 space-y-6 shadow-sm"
          style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
        >
          <div className="border-b pb-4" style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload New Financial Statement</h2>
            <p className="text-xs text-gray-500 mt-1">
              Upload your financial statements (CSV, XLS, PDF) to automatically import entries and analyze cash flow via AI.
            </p>
          </div>

          <div>
            <UploadDropzone onUpload={handleUpload} isUploading={isUploading} />
          </div>

          {status && (
            <div className={`p-3 rounded-xl text-xs font-medium ${
              status.startsWith("Upload successful") 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                : "bg-red-50 text-red-600 border border-red-200"
            }`}>
              {status}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}