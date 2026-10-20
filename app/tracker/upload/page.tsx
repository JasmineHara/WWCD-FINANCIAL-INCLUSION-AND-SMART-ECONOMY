/**
 * app/tracker/upload/page.tsx
 * --------------------------------
 * The "Upload Document" page — matches Images 5-7. All upload behavior
 * (states, API call, success/error modal) lives in UploadDropzone; this
 * page is just the shell (Sidebar/TopBar + heading) around it.
 */
import { Sidebar } from "@/components/tracker/Sidebar";
import { TopBar } from "@/components/tracker/TopBar";
import { UploadDropzone } from "@/components/tracker/UploadDropzone";

export default function UploadDocumentPage() {
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

          <UploadDropzone />
        </main>
      </div>
    </div>
  );
}
