export function formatCurrency(value?: number | null): string {
  if (value == null) return "$0";
  return `$${value.toLocaleString()}`;
}

export function formatDate(date?: string | Date | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getInitial(name?: string): string {
  return name?.charAt(0).toUpperCase() || 'U';
}
