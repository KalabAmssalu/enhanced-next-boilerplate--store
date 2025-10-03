// Crypto utilities
export async function generateHash(
  text: string,
  algorithm: string = "SHA-256"
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateRandomBytes(
  length: number = 32
): Promise<Uint8Array> {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
}

export function generateRandomId(length: number = 16): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

export function base64Encode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

export function base64Decode(str: string): string {
  return decodeURIComponent(escape(atob(str)));
}

export function hexEncode(str: string): string {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return result;
}

export function hexDecode(hex: string): string {
  let result = "";
  for (let i = 0; i < hex.length; i += 2) {
    result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return result;
}

export function simpleHash(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function obfuscateString(str: string, key: number = 42): string {
  return str
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) ^ key))
    .join("");
}

export function deobfuscateString(str: string, key: number = 42): string {
  return obfuscateString(str, key); // XOR is symmetric
}
