/**
 * components/report/DownloadReportButton.tsx
 * -------------------------------------------------
 * The yellow "Download Full Report (PDF)" button. Triggers a browser
 * download by hitting GET /api/tracker/report/pdf?reportId=... and saving
 * the response as a Blob — matches the success/fail modals in Image 3.
 */
"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";

export function DownloadReportButton({ reportId }: { reportId: string }) {
  const [modal, setModal] = useState<"none" | "success" | "error">("none");

  async function handleDownload() {
    try {
      const res = await fetch(`/api/tracker/report/pdf?reportId=${reportId}`);
      if (!res.ok) throw new Error("download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "report.pdf";
      link.click();
      URL.revokeObjectURL(url);

      setModal("success");
    } catch {
      setModal("error");
    }
  }

  return (
    <>
      <button
        onClick={handleDownload}
        className="w-full rounded-full px-5 py-2 text-sm font-medium"
        style={{ backgroundColor: "var(--mifi-accent-secondary)", color: "var(--mifi-accent-secondary-text)" }}
      >
        Download Full Report (PDF)
      </button>

      {modal !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-80 rounded-md bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2">
              {modal === "success" ? <Check size={24} /> : <X size={24} />}
            </div>
            <p className="mb-4 text-sm">
              {modal === "success" ? "File has been downloaded successfully!" : "Fail to download file."}
            </p>
            <button
              className="w-full rounded-full px-5 py-2 text-sm font-medium"
              style={{ backgroundColor: "var(--mifi-table-subheader-bg)", color: "white" }}
              onClick={() => setModal("none")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
