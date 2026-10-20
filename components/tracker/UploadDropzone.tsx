"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface UploadDropzoneProps {
  onUpload: (files: File[]) => Promise<void>;
  isUploading?: boolean;
}

export function UploadDropzone({ onUpload, isUploading = false }: UploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    setError(null);
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "text/csv"];
    const validFiles = files.filter((file) => validTypes.includes(file.type));

    if (validFiles.length === 0) {
      setError("Please upload a PDF, Image (PNG/JPEG), or CSV file.");
      return;
    }

    setSelectedFiles(validFiles);
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;
    await onUpload(selectedFiles);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          dragActive
            ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
            : "bg-white dark:bg-zinc-900"
        }`}
        style={{ borderColor: dragActive ? "var(--mifi-accent-primary)" : "var(--mifi-border)" }}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.csv"
          onChange={handleChange}
          className="hidden"
        />

        <div className="rounded-full p-4 mb-3" style={{ backgroundColor: "var(--mifi-bg)" }}>
          <UploadCloud className="w-8 h-8" style={{ color: "var(--mifi-accent-primary)" }} />
        </div>

        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Drag & drop your statements or receipts
        </h3>
        <p className="text-xs text-gray-500 mt-1">Supports PDF, PNG, JPG, or CSV up to 10MB</p>

        <label
          htmlFor="file-upload"
          className="mt-4 cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition hover:brightness-95"
          style={{
            backgroundColor: "var(--mifi-accent-primary)",
            color: "var(--mifi-accent-primary-text)",
          }}
        >
          Browse Files
        </label>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-4 rounded-xl border p-4 bg-white dark:bg-zinc-900" style={{ borderColor: "var(--mifi-border)" }}>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Selected File(s):
          </h4>
          <div className="space-y-2">
            {selectedFiles.map((file, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1 border-b last:border-0" style={{ borderColor: "var(--mifi-border)" }}>
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-4 h-4 shrink-0 text-gray-500" />
                  <span className="truncate">{file.name}</span>
                </div>
                <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUploading}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition hover:brightness-95 disabled:opacity-50"
            style={{
              backgroundColor: "var(--mifi-accent-primary)",
              color: "var(--mifi-accent-primary-text)",
            }}
          >
            {isUploading ? (
              "Processing Document..."
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Upload and Analyze
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}