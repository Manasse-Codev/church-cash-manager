interface PageTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageTitle({ title, subtitle, action }: PageTitleProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            color: "#0D1F5C",
            fontSize: "clamp(1.4rem, 3vw, 1.75rem)",
            lineHeight: "1.2",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: "#64748B", fontSize: "13px", marginTop: "4px" }}>{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
