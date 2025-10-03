// Cryptographic utilities
export function generateHash(
  input: string,
  algorithm: string = "SHA-256"
): Promise<string> {
  if (typeof window === "undefined") {
    // Node.js environment
    const crypto = require("crypto");
    return Promise.resolve(
      crypto.createHash(algorithm).update(input).digest("hex")
    );
  }

  // Browser environment
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  return crypto.subtle.digest(algorithm, data).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  });
}

export function generateRandomBytes(length: number): Uint8Array {
  if (typeof window === "undefined") {
    // Node.js environment
    const crypto = require("crypto");
    return crypto.randomBytes(length);
  }

  // Browser environment
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
}

export function generateRandomId(length: number = 16): string {
  const bytes = generateRandomBytes(length);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

export function generateUUID(): string {
  if (typeof window !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function base64Encode(input: string): string {
  if (typeof window === "undefined") {
    // Node.js environment
    return Buffer.from(input, "utf8").toString("base64");
  }

  // Browser environment
  return btoa(input);
}

export function base64Decode(input: string): string {
  if (typeof window === "undefined") {
    // Node.js environment
    return Buffer.from(input, "base64").toString("utf8");
  }

  // Browser environment
  return atob(input);
}

export function hexEncode(input: string): string {
  return Array.from(input, (char) =>
    char.charCodeAt(0).toString(16).padStart(2, "0")
  ).join("");
}

export function hexDecode(input: string): string {
  return (
    input
      .match(/.{2}/g)
      ?.map((hex) => String.fromCharCode(parseInt(hex, 16)))
      .join("") || ""
  );
}

export function simpleHash(input: string): string {
  let hash = 0;
  if (input.length === 0) return hash.toString();

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(16);
}

export function obfuscateString(input: string, key: number = 42): string {
  return input
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) ^ key))
    .join("");
}

export function deobfuscateString(input: string, key: number = 42): string {
  return obfuscateString(input, key); // XOR is symmetric
}


