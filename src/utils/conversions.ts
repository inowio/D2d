export interface ConversionOption {
  id: string;
  title: string;
  description: string;
  from: string;
  to: string;
  icon: string;
}

export const conversionOptions: ConversionOption[] = [
  {
    id: "binary-to-hex",
    title: "Binary to Hex",
    description: "Convert binary numbers to hexadecimal",
    from: "binary",
    to: "hex",
    icon: "HiArrowRight",
  },
  {
    id: "binary-to-gray",
    title: "Binary to Gray",
    description: "Convert binary numbers to Gray code",
    from: "binary",
    to: "gray",
    icon: "HiArrowRight",
  },
  {
    id: "gray-to-binary",
    title: "Gray to Binary",
    description: "Convert Gray code to binary numbers",
    from: "gray",
    to: "binary",
    icon: "HiArrowRight",
  },
  {
    id: "hex-to-binary",
    title: "Hex to Binary",
    description: "Convert hexadecimal to binary numbers",
    from: "hex",
    to: "binary",
    icon: "HiArrowRight",
  },
  {
    id: "hex-to-decimal",
    title: "Hex to Decimal",
    description: "Convert hexadecimal to decimal numbers",
    from: "hex",
    to: "decimal",
    icon: "HiArrowRight",
  },
  {
    id: "decimal-to-hex",
    title: "Decimal to Hex",
    description: "Convert decimal numbers to hexadecimal",
    from: "decimal",
    to: "hex",
    icon: "HiArrowRight",
  },
  {
    id: "decimal-to-binary",
    title: "Decimal to Binary",
    description: "Convert decimal numbers to binary",
    from: "decimal",
    to: "binary",
    icon: "HiArrowRight",
  },
  {
    id: "decimal-to-bcd",
    title: "Decimal to BCD",
    description: "Convert decimal numbers to BCD representation",
    from: "decimal",
    to: "bcd",
    icon: "HiArrowRight",
  },
  {
    id: "binary-to-decimal",
    title: "Binary to Decimal",
    description: "Convert binary numbers to decimal",
    from: "binary",
    to: "decimal",
    icon: "HiArrowRight",
  },
  {
    id: "bcd-to-decimal",
    title: "BCD to Decimal",
    description: "Convert BCD representation to decimal",
    from: "bcd",
    to: "decimal",
    icon: "HiArrowRight",
  },
  {
    id: "ascii-to-hex",
    title: "ASCII to Hex",
    description: "Convert ASCII text to hexadecimal",
    from: "ascii",
    to: "hex",
    icon: "HiArrowRight",
  },
  {
    id: "hex-to-ascii",
    title: "Hex to ASCII",
    description: "Convert hexadecimal to ASCII text",
    from: "hex",
    to: "ascii",
    icon: "HiArrowRight",
  },
  {
    id: "binary-to-ascii",
    title: "Binary to ASCII",
    description: "Convert binary to ASCII text",
    from: "binary",
    to: "ascii",
    icon: "HiArrowRight",
  },
  {
    id: "ascii-to-binary",
    title: "ASCII to Binary",
    description: "Convert ASCII text to binary",
    from: "ascii",
    to: "binary",
    icon: "HiArrowRight",
  },
  {
    id: "octal-to-binary",
    title: "Octal to Binary",
    description: "Convert octal numbers to binary",
    from: "octal",
    to: "binary",
    icon: "HiArrowRight",
  },
  {
    id: "binary-to-octal",
    title: "Binary to Octal",
    description: "Convert binary numbers to octal",
    from: "binary",
    to: "octal",
    icon: "HiArrowRight",
  },
  {
    id: "octal-to-decimal",
    title: "Octal to Decimal",
    description: "Convert octal numbers to decimal",
    from: "octal",
    to: "decimal",
    icon: "HiArrowRight",
  },
  {
    id: "decimal-to-octal",
    title: "Decimal to Octal",
    description: "Convert decimal numbers to octal",
    from: "decimal",
    to: "octal",
    icon: "HiArrowRight",
  },
  {
    id: "octal-to-hex",
    title: "Octal to Hex",
    description: "Convert octal numbers to hexadecimal",
    from: "octal",
    to: "hex",
    icon: "HiArrowRight",
  },
  {
    id: "hex-to-octal",
    title: "Hex to Octal",
    description: "Convert hexadecimal to octal",
    from: "hex",
    to: "octal",
    icon: "HiArrowRight",
  },
  // Advanced Numeric
  {
    id: "signed-to-unsigned",
    title: "Signed to Unsigned",
    description: "Convert signed integers to unsigned representation",
    from: "advanced-numeric",
    to: "unsigned",
    icon: "HiArrowRight",
  },
  {
    id: "unsigned-to-signed",
    title: "Unsigned to Signed",
    description: "Convert unsigned integers to signed representation",
    from: "advanced-numeric",
    to: "signed",
    icon: "HiArrowRight",
  },
  {
    id: "base-n-to-decimal",
    title: "Base-N to Decimal",
    description: "Convert from any base (2-36) to decimal",
    from: "advanced-numeric",
    to: "base-n-decimal",
    icon: "HiArrowRight",
  },
  {
    id: "decimal-to-base-n",
    title: "Decimal to Base-N",
    description: "Convert decimal to any base (2-36)",
    from: "advanced-numeric",
    to: "decimal-base-n",
    icon: "HiArrowRight",
  },
  {
    id: "float-to-ieee754",
    title: "Float to IEEE 754",
    description: "Convert floating-point to IEEE 754 binary/hex representation",
    from: "advanced-numeric",
    to: "ieee754",
    icon: "HiArrowRight",
  },
  {
    id: "ieee754-to-float",
    title: "IEEE 754 to Float",
    description: "Convert IEEE 754 binary/hex to floating-point",
    from: "advanced-numeric",
    to: "float",
    icon: "HiArrowRight",
  },
];

function normalizeHex(hex: string): string {
  // Remove all whitespace first
  let cleaned = hex.replace(/\s/g, "");

  // Remove 0x or 0X prefixes (case insensitive)
  cleaned = cleaned.replace(/0x/gi, "");

  // Validate remaining characters are valid hex
  if (!/^[0-9A-Fa-f]*$/.test(cleaned)) {
    throw new Error("Invalid hex input");
  }

  return cleaned;
}

function parseBigInt(value: string, base: 2 | 8 | 10 | 16): bigint {
  switch (base) {
    case 2:
      return BigInt(`0b${value}`);
    case 8:
      return BigInt(`0o${value}`);
    case 10:
      return BigInt(value);
    case 16:
      return BigInt(`0x${value}`);
    default:
      throw new Error("Unsupported base");
  }
}

export function binaryToHex(binary: string): string {
  if (!/^[01\s]*$/.test(binary)) throw new Error("Invalid binary input");
  const cleanBinary = binary.replace(/\s/g, "");
  if (cleanBinary === "") return "";
  const value = parseBigInt(cleanBinary, 2);
  return value.toString(16).toUpperCase().padStart(Math.ceil(cleanBinary.length / 4), "0");
}

export function hexToBinary(hex: string): string {
  const cleanHex = normalizeHex(hex);
  if (cleanHex === "") return "";
  const value = parseBigInt(cleanHex, 16);
  const binary = value.toString(2);
  return binary.padStart(cleanHex.length * 4, "0");
}

export function hexToDecimal(hex: string): string {
  const cleanHex = normalizeHex(hex);
  if (cleanHex === "") return "";
  const value = parseBigInt(cleanHex, 16);
  return value.toString(10);
}

export function decimalToHex(decimal: string): string {
  const cleanDecimal = decimal.trim();
  if (cleanDecimal === "") return "";
  if (!/^\d+$/.test(cleanDecimal)) throw new Error("Invalid decimal input");
  const num = parseBigInt(cleanDecimal, 10);
  return num.toString(16).toUpperCase();
}

export function decimalToBinary(decimal: string): string {
  const cleanDecimal = decimal.trim();
  if (cleanDecimal === "") return "";
  if (!/^\d+$/.test(cleanDecimal)) throw new Error("Invalid decimal input");
  const num = parseBigInt(cleanDecimal, 10);
  return num.toString(2);
}

export function binaryToDecimal(binary: string): string {
  if (!/^[01\s]*$/.test(binary)) throw new Error("Invalid binary input");
  const cleanBinary = binary.replace(/\s/g, "");
  if (cleanBinary === "") return "";
  const value = parseBigInt(cleanBinary, 2);
  return value.toString(10);
}

export function asciiToHex(ascii: string): string {
  return ascii
    .split("")
    .map((char) => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"))
    .join(" ");
}

export function hexToAscii(hex: string): string {
  let cleanHex = normalizeHex(hex);
  if (cleanHex === "") return "";
  // Auto-pad odd-length hex strings with leading zero
  if (cleanHex.length % 2 !== 0) {
    cleanHex = "0" + cleanHex;
  }
  let result = "";
  for (let i = 0; i < cleanHex.length; i += 2) {
    const byte = parseInt(cleanHex.slice(i, i + 2), 16);
    if (isNaN(byte)) throw new Error("Invalid hex value");
    result += String.fromCharCode(byte);
  }
  return result;
}

export function binaryToAscii(binary: string): string {
  if (!/^[01\s]*$/.test(binary)) throw new Error("Invalid binary input");
  const cleanBinary = binary.replace(/\s/g, "");
  if (cleanBinary === "") return "";
  if (cleanBinary.length % 8 !== 0) throw new Error("Binary string must have length multiple of 8");
  let result = "";
  for (let i = 0; i < cleanBinary.length; i += 8) {
    const byte = parseInt(cleanBinary.slice(i, i + 8), 2);
    if (isNaN(byte)) throw new Error("Invalid binary value");
    result += String.fromCharCode(byte);
  }
  return result;
}

export function asciiToBinary(ascii: string): string {
  return ascii
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

export function binaryToGray(binary: string): string {
  if (!/^[01\s]*$/.test(binary)) throw new Error("Invalid binary input");
  const cleanBinary = binary.replace(/\s/g, "");
  if (cleanBinary === "") return "";
  let result = cleanBinary.charAt(0);
  for (let i = 1; i < cleanBinary.length; i++) {
    const prev = cleanBinary.charAt(i - 1);
    const current = cleanBinary.charAt(i);
    result += prev === current ? "0" : "1";
  }
  return result;
}

export function grayToBinary(gray: string): string {
  if (!/^[01\s]*$/.test(gray)) throw new Error("Invalid Gray code input");
  const cleanGray = gray.replace(/\s/g, "");
  if (cleanGray === "") return "";
  let result = cleanGray.charAt(0);
  for (let i = 1; i < cleanGray.length; i++) {
    const previousBinaryBit = result.charAt(i - 1);
    const grayBit = cleanGray.charAt(i);
    result += previousBinaryBit === grayBit ? "0" : "1";
  }
  return result;
}

export function octalToBinary(octal: string): string {
  if (!/^[0-7\s]*$/.test(octal)) throw new Error("Invalid octal input");
  const cleanOctal = octal.replace(/\s/g, "");
  if (cleanOctal === "") return "";
  const value = parseBigInt(cleanOctal, 8);
  return value.toString(2).padStart(cleanOctal.length * 3, "0");
}

export function binaryToOctal(binary: string): string {
  if (!/^[01\s]*$/.test(binary)) throw new Error("Invalid binary input");
  const cleanBinary = binary.replace(/\s/g, "");
  if (cleanBinary === "") return "";
  const value = parseBigInt(cleanBinary, 2);
  return value.toString(8);
}

export function octalToDecimal(octal: string): string {
  if (!/^[0-7\s]*$/.test(octal)) throw new Error("Invalid octal input");
  const cleanOctal = octal.replace(/\s/g, "");
  if (cleanOctal === "") return "";
  const value = parseBigInt(cleanOctal, 8);
  return value.toString(10);
}

export function decimalToOctal(decimal: string): string {
  const cleanDecimal = decimal.trim();
  if (cleanDecimal === "") return "";
  if (!/^\d+$/.test(cleanDecimal)) throw new Error("Invalid decimal input");
  const num = parseBigInt(cleanDecimal, 10);
  return num.toString(8);
}

export function octalToHex(octal: string): string {
  if (!/^[0-7\s]*$/.test(octal)) throw new Error("Invalid octal input");
  const cleanOctal = octal.replace(/\s/g, "");
  if (cleanOctal === "") return "";
  const value = parseBigInt(cleanOctal, 8);
  return value.toString(16).toUpperCase();
}

export function hexToOctal(hex: string): string {
  const cleanHex = normalizeHex(hex);
  if (cleanHex === "") return "";
  const value = parseBigInt(cleanHex, 16);
  return value.toString(8);
}

export function decimalToBcd(decimal: string): string {
  const cleanDecimal = decimal.trim();
  if (cleanDecimal === "") return "";
  if (!/^\d+$/.test(cleanDecimal)) throw new Error("Invalid decimal input");
  return cleanDecimal
    .split("")
    .map((digit) => parseInt(digit, 10).toString(2).padStart(4, "0"))
    .join(" ");
}

export function bcdToDecimal(bcd: string): string {
  if (!/^[01\s]*$/.test(bcd)) throw new Error("Invalid BCD input");
  const cleanBcd = bcd.replace(/\s/g, "");
  if (cleanBcd === "") return "";
  if (cleanBcd.length % 4 !== 0) throw new Error("BCD input must have 4-bit groups");
  let digits = "";
  for (let i = 0; i < cleanBcd.length; i += 4) {
    const nibble = cleanBcd.slice(i, i + 4);
    const value = parseInt(nibble, 2);
    if (isNaN(value) || value > 9) throw new Error("Invalid BCD digit");
    digits += value.toString(10);
  }
  const normalized = digits.replace(/^0+(?=\d)/, "");
  return normalized === "" ? "0" : normalized;
}

// Advanced Numeric Functions
// Signed/Unsigned Conversions (8, 16, 32, 64 bit)
export function signedToUnsigned(value: string, bits: number): string {
  const cleanValue = value.trim();
  if (cleanValue === "") return "";
  let num: bigint;
  try {
    num = BigInt(cleanValue);
  } catch {
    throw new Error("Invalid number");
  }
  const max = 1n << BigInt(bits);
  const half = max / 2n;
  if (num < -half || num >= half) {
    throw new Error(`Value out of range for ${bits}-bit signed integer`);
  }
  const unsigned = num < 0n ? num + max : num;
  return unsigned.toString(10);
}

export function unsignedToSigned(value: string, bits: number): string {
  const cleanValue = value.trim();
  if (cleanValue === "") return "";
  let num: bigint;
  try {
    num = BigInt(cleanValue);
  } catch {
    throw new Error("Invalid number");
  }
  const max = 1n << BigInt(bits);
  const half = max / 2n;
  if (num < 0n || num >= max) {
    throw new Error(`Value out of range for ${bits}-bit unsigned integer (0 to ${(max - 1n).toString()})`);
  }
  const signed = num >= half ? num - max : num;
  return signed.toString(10);
}

// Base-N Conversions (supports bases 2-36)
export function baseNToDecimal(value: string, base: number): string {
  if (base < 2 || base > 36) throw new Error("Base must be between 2 and 36");
  const cleanValue = value.replace(/\s/g, "").toUpperCase();
  if (cleanValue === "") return "";
  const validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, base);
  const regex = new RegExp(`^[${validChars}]+$`);
  if (!regex.test(cleanValue)) {
    throw new Error(`Invalid character for base-${base}`);
  }
  const bigBase = BigInt(base);
  let result = 0n;
  for (const ch of cleanValue) {
    result = result * bigBase + BigInt(parseInt(ch, 36));
  }
  return result.toString(10);
}

export function decimalToBaseN(decimal: string, base: number): string {
  if (base < 2 || base > 36) throw new Error("Base must be between 2 and 36");
  const cleanDecimal = decimal.trim();
  if (cleanDecimal === "") return "";
  if (/^-/.test(cleanDecimal)) throw new Error("Negative numbers not supported");
  if (!/^\d+$/.test(cleanDecimal)) throw new Error("Invalid decimal number");
  let num: bigint;
  try {
    num = BigInt(cleanDecimal);
  } catch {
    throw new Error("Invalid decimal number");
  }
  if (num < 0n) throw new Error("Negative numbers not supported");
  if (num === 0n) return "0";
  const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const bigBase = BigInt(base);
  let result = "";
  let remaining = num;
  while (remaining > 0n) {
    result = digits[Number(remaining % bigBase)] + result;
    remaining = remaining / bigBase;
  }
  return result;
}

// IEEE 754 Float Conversions
export function floatToIEEE754(value: string, precision: "single" | "double" = "single"): string {
  const cleanValue = value.trim();
  if (cleanValue === "") return "";
  const num = parseFloat(cleanValue);
  if (isNaN(num)) throw new Error("Invalid float number");

  const buffer = new ArrayBuffer(precision === "single" ? 4 : 8);
  const view = new DataView(buffer);

  if (precision === "single") {
    view.setFloat32(0, num, false);
  } else {
    view.setFloat64(0, num, false);
  }

  let hex = "";
  for (let i = 0; i < (precision === "single" ? 4 : 8); i++) {
    hex += view.getUint8(i).toString(16).padStart(2, "0").toUpperCase();
  }

  let binary = "";
  for (let i = 0; i < (precision === "single" ? 4 : 8); i++) {
    binary += view.getUint8(i).toString(2).padStart(8, "0");
  }

  return `Hex: ${hex}\nBinary: ${binary}`;
}

export function ieee754ToFloat(hex: string, precision: "single" | "double" = "single"): string {
  const cleanHex = hex.replace(/\s/g, "").replace(/0x/gi, "");
  if (cleanHex === "") return "";
  const expectedLen = precision === "single" ? 8 : 16;
  if (cleanHex.length !== expectedLen) {
    throw new Error(`Expected ${expectedLen} hex characters for ${precision} precision`);
  }
  if (!/^[0-9A-Fa-f]+$/.test(cleanHex)) throw new Error("Invalid hex input");

  const buffer = new ArrayBuffer(precision === "single" ? 4 : 8);
  const view = new DataView(buffer);

  for (let i = 0; i < (precision === "single" ? 4 : 8); i++) {
    const byte = parseInt(cleanHex.slice(i * 2, i * 2 + 2), 16);
    view.setUint8(i, byte);
  }

  const result = precision === "single" ? view.getFloat32(0, false) : view.getFloat64(0, false);
  return result.toString();
}

interface AdvancedConversionConfig {
  bits?: 8 | 16 | 32 | 64;
  base?: number;
  precision?: "single" | "double";
}

export function convert(value: string, from: string, to: string, config?: AdvancedConversionConfig): string {
  const key = `${from}-to-${to}`;
  switch (key) {
    case "binary-to-hex":
      return binaryToHex(value);
    case "hex-to-binary":
      return hexToBinary(value);
    case "hex-to-decimal":
      return hexToDecimal(value);
    case "decimal-to-hex":
      return decimalToHex(value);
    case "decimal-to-binary":
      return decimalToBinary(value);
    case "binary-to-decimal":
      return binaryToDecimal(value);
    case "binary-to-gray":
      return binaryToGray(value);
    case "gray-to-binary":
      return grayToBinary(value);
    case "ascii-to-hex":
      return asciiToHex(value);
    case "hex-to-ascii":
      return hexToAscii(value);
    case "binary-to-ascii":
      return binaryToAscii(value);
    case "ascii-to-binary":
      return asciiToBinary(value);
    case "octal-to-binary":
      return octalToBinary(value);
    case "binary-to-octal":
      return binaryToOctal(value);
    case "octal-to-decimal":
      return octalToDecimal(value);
    case "decimal-to-octal":
      return decimalToOctal(value);
    case "octal-to-hex":
      return octalToHex(value);
    case "hex-to-octal":
      return hexToOctal(value);
    case "decimal-to-bcd":
      return decimalToBcd(value);
    case "bcd-to-decimal":
      return bcdToDecimal(value);
    // Advanced Numeric conversions
    case "advanced-numeric-to-unsigned": {
      const bits = config?.bits ?? 32;
      return signedToUnsigned(value, bits);
    }
    case "advanced-numeric-to-signed": {
      const bits = config?.bits ?? 32;
      return unsignedToSigned(value, bits);
    }
    case "advanced-numeric-to-base-n-decimal": {
      const base = config?.base ?? 16;
      return baseNToDecimal(value, base);
    }
    case "advanced-numeric-to-decimal-base-n": {
      const base = config?.base ?? 16;
      return decimalToBaseN(value, base);
    }
    case "advanced-numeric-to-ieee754": {
      const precision = config?.precision ?? "single";
      return floatToIEEE754(value, precision);
    }
    case "advanced-numeric-to-float": {
      const precision = config?.precision ?? "single";
      return ieee754ToFloat(value, precision);
    }
    default:
      throw new Error("Unsupported conversion");
  }
}
