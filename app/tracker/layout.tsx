/**
 * app/tracker/layout.tsx
 * --------------------------
 * Wraps every page under /tracker (Data Tracker, Upload Document, Report)
 * with the shared cream background and theme.css variables.
 */
import "./theme.css";

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--mifi-bg)" }}>
      {children}
    </div>
  );
}