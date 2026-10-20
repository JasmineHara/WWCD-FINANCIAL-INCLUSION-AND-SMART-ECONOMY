type TopBarProps = {
  title: string;
};

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="border-b bg-white px-8 py-4">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
