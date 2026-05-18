const unicodeEscapePattern = /\\u([0-9a-fA-F]{4})/g;

export function decodeUnicodeEscapes(value: string) {
  if (!value.includes("\\u")) {
    return value;
  }

  return value.replace(unicodeEscapePattern, (_, code: string) => String.fromCharCode(Number.parseInt(code, 16)));
}

export function displayText(value: string | null | undefined, fallback = "-") {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = decodeUnicodeEscapes(value).trim();
  return normalized.length ? normalized : fallback;
}