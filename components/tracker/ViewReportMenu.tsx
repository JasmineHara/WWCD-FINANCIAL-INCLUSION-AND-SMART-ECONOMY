type ViewReportMenuProps = {
  onSelectPeriod: (period: "daily" | "weekly" | "monthly") => void;
  isGenerating: boolean;
};

export function ViewReportMenu({ onSelectPeriod, isGenerating }: ViewReportMenuProps) {
  return (
    <select
      aria-label="View report period"
      className="rounded-full border bg-white px-4 py-2 text-sm"
      defaultValue="weekly"
      onChange={(event) => onSelectPeriod(event.target.value as "daily" | "weekly" | "monthly")}
      disabled={isGenerating}
    >
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
    </select>
  );
}
