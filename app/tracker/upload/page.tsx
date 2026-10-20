/**
 * app/tracker/upload/page.tsx
 * --------------------------------
 * The "Upload Document" page — matches Images 5-7. All upload behavior
 * (states, API call, success/error modal) lives in UploadDropzone; this
 * page is just the shell (Sidebar/TopBar + heading) around it.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/tracker/Sidebar";
import { TopBar } from "@/components/tracker/TopBar";
import { UploadDropzone } from "@/components/tracker/UploadDropzone";

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
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <TopBar title="Upload Document" />

        <main className="px-8 py-6">
          <h2 className="text-2xl font-semibold">Upload Document</h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload your financial statements (CSV, XLS, PDF) to import data into your tracker.
          </p>

          <div className="mt-6">
            <UploadDropzone onUpload={handleUpload} isUploading={isUploading} />
          </div>

          {status && (
            <p
              className={`mt-4 text-sm ${status.startsWith("Upload successful") ? "text-green-600" : "text-red-600"}`}
            >
              {status}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
