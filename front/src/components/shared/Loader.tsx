export function Loader({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <svg className="animate-spin" width="36" height="36" viewBox="0 0 24 24" fill="none" aria-label="Chargement">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#1B3FA6" strokeWidth="3" />
        <path className="opacity-80" fill="#1B3FA6" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span style={{ color: "#64748B", fontSize: "14px", fontWeight: 500 }}>{text}</span>
    </div>
  );
}
