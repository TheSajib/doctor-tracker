export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-serif text-4xl leading-none font-medium tracking-tight text-ink sm:text-[2.65rem]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export const panelClass =
  "rounded-[24px] border border-line bg-white shadow-[0_16px_40px_-32px_rgba(18,40,36,0.7)]";

export const tablePanelClass = `${panelClass} overflow-hidden`;
