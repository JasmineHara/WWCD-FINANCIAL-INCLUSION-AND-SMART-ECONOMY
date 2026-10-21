/**
 * components/report/DownloadReportButton.tsx
 * -------------------------------------------------
 * The yellow "Download Full Report (PDF)" button. Triggers a browser
 * download by hitting GET /api/tracker/report/pdf?reportId=... and saving
 * the response as a Blob — matches the success/fail modals in Image 3.
 */
"use client";

import { Download } from "lucide-react";
import type { RefObject } from "react";

type Props = {
  reportId?: string;
  title?: string;
  contentRef?: RefObject<HTMLDivElement | null>;
};

export function DownloadReportButton({ reportId, title, contentRef }: Props) {
  const handleDownload = () => {
    const exportOnlyReportBox = () => {
      if (!contentRef?.current) {
        window.print();
        return;
      }

      const clone = contentRef.current.cloneNode(true) as HTMLElement;
      clone.style.width = "100%";
      clone.style.maxWidth = "100%";
      clone.style.margin = "0";
      clone.style.padding = "0";
      clone.style.boxShadow = "none";
      clone.style.border = "0";

      const printWindow = window.open("", "_blank", "width=1200,height=900");
      if (!printWindow) {
        window.print();
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>${title ?? "My Business Report"}</title>
            <style>
              @page { size: A4; margin: 12mm; }
              body {
                font-family: Arial, sans-serif;
                background: white;
                color: #111827;
                padding: 0;
                margin: 0;
              }
              * { box-sizing: border-box; }
              table { width: 100%; border-collapse: collapse; }
              th, td {
                border: 1px solid #e5e7eb;
                padding: 10px 12px;
                text-align: left;
              }
              th { background: #f3f4f6; }
              ul { padding-left: 18px; }
              li { margin-bottom: 8px; }
            </style>
          </head>
          <body>
            ${clone.outerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 300);
    };

    exportOnlyReportBox();
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="flex items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
    >
      <Download className="h-4 w-4" />
      Download full report (PDF)
    </button>
  );
}
