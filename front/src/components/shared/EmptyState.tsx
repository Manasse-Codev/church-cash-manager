import type { LucideIcon } from "lucide-react";
import { FileX } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon = FileX, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "#EEF3FF" }}
      >
        <Icon size={28} style={{ color: "#1B3FA6" }} />
      </div>
      <p style={{ fontWeight: 700, color: "#0D1F5C", fontSize: "16px" }}>{title}</p>
      {description && (
        <p style={{ color: "#64748B", fontSize: "14px", maxWidth: "280px" }}>{description}</p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="btn-primary mt-2"
          style={{ fontSize: "14px", padding: "0.5rem 1.25rem" }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
