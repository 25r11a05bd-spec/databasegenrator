export function formatConnectionString(
  template: string,
  password?: string
): string {
  if (!password) return template;
  return template.replaceAll('[YOUR-PASSWORD]', password);
}

export function sanitizeIdentifier(identifier: string): string {
  return identifier.replace(/[^a-zA-Z0-9_]/g, '');
}

export function formatDatePretty(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  } catch {
    return 'Recent';
  }
}
