export function normalizeExternalUrl(value: string): string | null {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmedValue);
  const candidate = hasScheme ? trimmedValue : `https://${trimmedValue}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}
