// URL utilities
export function buildUrl(
  base: string,
  params: Record<string, any> = {}
): string {
  const url = new URL(base);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export function parseUrl(url: string): {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
} {
  const urlObj = new URL(url);
  return {
    protocol: urlObj.protocol,
    hostname: urlObj.hostname,
    port: urlObj.port,
    pathname: urlObj.pathname,
    search: urlObj.search,
    hash: urlObj.hash,
  };
}

export function getQueryParams(
  url: string = window.location.href
): Record<string, string> {
  const urlObj = new URL(url);
  const params: Record<string, string> = {};

  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

export function setQueryParam(url: string, key: string, value: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.set(key, value);
  return urlObj.toString();
}

export function removeQueryParam(url: string, key: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.delete(key);
  return urlObj.toString();
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

export function isRelativeUrl(url: string): boolean {
  return !isAbsoluteUrl(url) && !url.startsWith("//");
}

export function normalizeUrl(url: string, base?: string): string {
  if (isAbsoluteUrl(url)) {
    return url;
  }

  if (base) {
    return new URL(url, base).toString();
  }

  return new URL(url, window.location.origin).toString();
}

export function getDomain(url: string): string {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

export function getPath(url: string): string {
  const urlObj = new URL(url);
  return urlObj.pathname;
}
