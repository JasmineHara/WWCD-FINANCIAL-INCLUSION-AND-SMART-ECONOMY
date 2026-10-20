interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <div
      className="flex items-center justify-between px-8 py-5 border-b"
      style={{ borderColor: "var(--mifi-border)" }}
    >
      <h1 className="text-xl font-bold" style={{ color: "var(--mifi-sidebar-text)" }}>
        {title}
      </h1>
    </div>
  );
}