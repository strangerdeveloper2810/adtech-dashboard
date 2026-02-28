export function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getInitial(name?: string): string {
  return name?.charAt(0).toUpperCase() || 'U';
}
