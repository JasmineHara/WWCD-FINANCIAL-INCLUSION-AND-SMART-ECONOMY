/**
 * app/api/tracker/report/pdf/route.ts
 * ---------------------------------------
 * GET /api/tracker/report/pdf?reportId=<uuid>
 * Streams back a PDF file of the report, triggering a browser download.
 * This is what the "Download Full Report (PDF)" button on the Report page
 * calls (see components/report/DownloadReportButton.tsx).
 *
 * Uses "pdf-lib" (lightweight, pure-JS, works fine in a Next.js route
 * handler with no headless-browser dependency).
 *
 * Install:
 *   npm install pdf-lib
 */
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReportData } from "@/types/tracker";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const reportId = req.nextUrl.searchParams.get("reportId");
  if (!reportId) {
    return NextResponse.json({ error: "reportId is required" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: report, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (error || !report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const pdfBytes = await buildReportPdf(report as ReportData);

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="tracker_report_${reportId}.pdf"`,
    },
  });
}

async function buildReportPdf(_report: ReportData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const page = doc.addPage([595, 842]);
  const left = 50;
  let y = 800;

  const drawLine = (text: string) => {
    page.drawText(text, {
      x: left,
      y,
      size: 12,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 18;
  };

  drawLine("MIFI Financial Report");
  drawLine("This is a placeholder PDF export for the local tracker build.");
  drawLine("The report data will be connected to Supabase once the schema is available.");

  return doc.save();
}
