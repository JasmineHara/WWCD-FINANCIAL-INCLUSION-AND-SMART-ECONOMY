/**
 * components/tracker/UploadDropzone.tsx
 * -----------------------------------------
 * Implements the "Choose a file" dropzone + states shown across Images 5-7:
 *   - empty state ("Choose a file. CSV, XLS, PDF (Max size: 25MB)")
 *   - error modal ("Fail to download file.")
 *   - success state (file name, size, "Complete", Remove button, "Go To Data Tracker >")
 *
 * All upload logic (POST to /api/tracker/upload) lives here so the page
 * component stays thin. 🎨 FRONTEND — colors via --mifi-accent-primary /
 * --mifi-border; the modal markup below is intentionally plain so it's
 * easy to swap for a design-system Dialog component.
 */
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X } from "lucide-react";
import type { UploadResponse } from "@/types/tracker";

type UiState = "idle" | "uploading" | "success" | "error";

const ACCEPTED = ".csv,.xls,.xlsx,.pdf";

export function UploadDropzone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UiState>("idle");
  const [fileInfo, setFileInfo] = useState<{ name: string; sizeMb: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleFile(file: File) {
    setState("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/tracker/upload", { method: "POST", body: formData });
      const data: UploadResponse = await res.json();

      if (!data.success) {
        setErrorMessage(data.error ?? "Fail to download file.");
        setState("error");
        return;
      }

      setFileInfo({ name: file.name, sizeMb: (file.size / (1024 * 1024)).toFixed(1) });
      setState("success");
      router.refresh();
    } catch {
      setErrorMessage("Fail to download file.");
      setState("error");
    }
  }

  return (
    <div className="mt-6 max-w-2xl">
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-16 text-center"
        style={{ borderColor: "var(--mifi-accent-primary)", backgroundColor: "#f6eef0" }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        <UploadCloud size={28} className="mb-3 opacity-70" />
        <p className="text-sm">{state === "uploading" ? "Uploading…" : "Choose a file."}</p>
        <p className="mt-1 text-xs" style={{ color: "var(--mifi-accent-primary)" }}>
          CSV, XLS, PDF (Max size: 25MB)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {state === "success" && fileInfo && (
        <>
          <div
            className="mt-4 flex items-center justify-between rounded-md px-5 py-4"
            style={{ border: "1px solid var(--mifi-border)" }}
          >
            <div>
              <p className="text-sm font-medium">{fileInfo.name}</p>
              <p className="text-xs text-gray-500">{fileInfo.sizeMb} MB – Complete</p>
            </div>
            <button
              className="text-sm font-medium"
              style={{ color: "var(--mifi-accent-primary)" }}
              onClick={() => {
                setFileInfo(null);
                setState("idle");
              }}
            >
              Remove
            </button>
          </div>

          <button
            className="mt-4 w-full rounded-full px-5 py-3 text-sm font-medium"
            style={{ backgroundColor: "var(--mifi-accent-primary)", color: "var(--mifi-accent-primary-text)" }}
            onClick={() => router.push("/tracker")}
          >
            Go To Data Tracker &gt;
          </button>
        </>
      )}

      {state === "error" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-80 rounded-md bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2">
              <X size={24} />
            </div>
            <p className="mb-4 text-sm">{errorMessage}</p>
            <button
              className="w-full rounded-full px-5 py-2 text-sm font-medium"
              style={{ backgroundColor: "var(--mifi-table-subheader-bg)", color: "white" }}
              onClick={() => setState("idle")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
