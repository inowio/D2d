import { describe, it, expect } from "vitest";
import {
  asciiToBinary,
  asciiToHex,
  baseNToDecimal,
  bcdToDecimal,
  binaryToAscii,
  binaryToDecimal,
  binaryToGray,
  binaryToHex,
  binaryToOctal,
  convert,
  decimalToBaseN,
  decimalToBcd,
  decimalToBinary,
  decimalToHex,
  decimalToOctal,
  floatToIEEE754,
  grayToBinary,
  hexToAscii,
  hexToBinary,
  hexToDecimal,
  hexToOctal,
  ieee754ToFloat,
  octalToBinary,
  octalToDecimal,
  octalToHex,
  signedToUnsigned,
  unsignedToSigned,
} from "./conversions";

describe("Primitive conversion helpers", () => {
  describe("binaryToHex", () => {
    it("converts binary (with whitespace) to uppercase hex", () => {
      expect(binaryToHex("1010 1010")).toBe("AA");
    });

    it("returns empty string for empty or whitespace-only input", () => {
      expect(binaryToHex("")).toBe("");
      expect(binaryToHex("   ")).toBe("");
    });

    it("throws for non-binary characters", () => {
      expect(() => binaryToHex("102")).toThrow("Invalid binary input");
      expect(() => binaryToHex("abc")).toThrow("Invalid binary input");
    });
  });

  describe("hexToBinary", () => {
    it("handles prefixes, lowercase and whitespace", () => {
      expect(hexToBinary(" 0x2b ")).toBe("00101011");
      expect(hexToBinary("0X2B")).toBe("00101011");
    });

    it("handles hex without prefix", () => {
      expect(hexToBinary("FF")).toBe("11111111");
    });

    it("returns empty string for empty input", () => {
      expect(hexToBinary("")).toBe("");
    });

    it("rejects invalid hex", () => {
      expect(() => hexToBinary("G1")).toThrow("Invalid hex input");
    });
  });

  describe("hexToDecimal", () => {
    it("converts hex to decimal", () => {
      expect(hexToDecimal("FF")).toBe("255");
    });

    it("returns empty string for empty input", () => {
      expect(hexToDecimal("")).toBe("");
    });

    it("rejects invalid hex characters", () => {
      expect(() => hexToDecimal("G1")).toThrow("Invalid hex input");
    });
  });

  describe("decimalToHex", () => {
    it("converts decimal to hex", () => {
      expect(decimalToHex("255")).toBe("FF");
      expect(decimalToHex(" 255 ")).toBe("FF");
    });

    it("rejects invalid decimals", () => {
      expect(() => decimalToHex("2a")).toThrow("Invalid decimal input");
      expect(() => decimalToHex("-1")).toThrow("Invalid decimal input");
      expect(decimalToHex("")).toBe("");
    });
  });

  describe("decimalToBinary & binaryToDecimal", () => {
    it("round-trips decimal -> binary -> decimal", () => {
      const binary = decimalToBinary("42");
      expect(binary).toBe("101010");
      expect(binaryToDecimal(binary)).toBe("42");
    });

    it("decimalToBinary handles whitespace and empty string", () => {
      expect(decimalToBinary(" 10 ")).toBe("1010");
      expect(decimalToBinary("")).toBe("");
    });

    it("binaryToDecimal handles whitespace and empty string", () => {
      expect(binaryToDecimal("1010 1010")).toBe("170");
      expect(binaryToDecimal("")).toBe("");
      expect(binaryToDecimal("   ")).toBe("");
    });

    it("binaryToDecimal throws for invalid binary", () => {
      expect(() => binaryToDecimal("102")).toThrow("Invalid binary input");
    });
  });

  describe("Gray code", () => {
    it("converts binary to Gray and back", () => {
      const gray = binaryToGray("1011");
      expect(gray).toBe("1110");
      expect(grayToBinary(gray)).toBe("1011");
    });

    it("binaryToGray handles empty input and whitespace", () => {
      expect(binaryToGray("")).toBe("");
      expect(binaryToGray("  ")).toBe("");
      expect(binaryToGray("10 10")).toBe("1111");
    });

    it("grayToBinary handles empty input and whitespace", () => {
      expect(grayToBinary("")).toBe("");
      expect(grayToBinary("  ")).toBe("");
    });

    it("throws for invalid inputs", () => {
      expect(() => binaryToGray("12")).toThrow("Invalid binary input");
      expect(() => grayToBinary("12")).toThrow("Invalid Gray code input");
    });
  });

  describe("ASCII helpers", () => {
    it("converts ASCII to hex and back", () => {
      const hex = asciiToHex("Hi");
      expect(hex).toBe("48 69");
      expect(hexToAscii(hex)).toBe("Hi");
    });

    it("converts ASCII to binary and back", () => {
      const binary = asciiToBinary("Hi");
      expect(binary).toBe("01001000 01101001");
      expect(binaryToAscii(binary)).toBe("Hi");
    });

    it("hexToAscii handles odd length hex by padding", () => {
      expect(hexToAscii("F")).toBe("\u000f");
    });

    it("hexToAscii throws for invalid hex", () => {
      expect(() => hexToAscii("G1")).toThrow("Invalid hex input");
    });

    it("binaryToAscii throws for invalid binary or wrong length", () => {
      expect(() => binaryToAscii("01002")).toThrow("Invalid binary input");
      expect(() => binaryToAscii("1010")).toThrow("Binary string must have length multiple of 8");
    });

    it("all ASCII helpers handle empty strings", () => {
      expect(asciiToHex("")).toBe("");
      expect(hexToAscii("")).toBe("");
      expect(asciiToBinary("")).toBe("");
      expect(binaryToAscii("")).toBe("");
    });
  });

  describe("Octal conversions", () => {
    it("converts octal to binary and hex", () => {
      expect(octalToBinary("17")).toBe("001111");
      expect(octalToHex("17")).toBe("F");
    });

    it("converts binary to octal and decimal", () => {
      expect(binaryToOctal("1111")).toBe("17");
      expect(octalToDecimal("17")).toBe("15");
    });

    it("converts decimal and hex to octal", () => {
      expect(decimalToOctal("15")).toBe("17");
      expect(hexToOctal("FF")).toBe("377");
    });

    it("all octal helpers handle empty strings and whitespace", () => {
      expect(octalToBinary("")).toBe("");
      expect(octalToHex("")).toBe("");
      expect(binaryToOctal("")).toBe("");
      expect(octalToDecimal("")).toBe("");
      expect(decimalToOctal("")).toBe("");
      expect(hexToOctal("")).toBe("");

      expect(octalToBinary(" 17 ")).toBe("001111");
    });

    it("rejects invalid octal", () => {
      expect(() => octalToBinary("89")).toThrow("Invalid octal input");
      expect(() => octalToHex("8")).toThrow("Invalid octal input");
      expect(() => octalToDecimal("A")).toThrow("Invalid octal input");
    });
  });

  describe("BCD conversions", () => {
    it("converts decimal to BCD and back", () => {
      const bcd = decimalToBcd("59");
      expect(bcd).toBe("0101 1001");
      expect(bcdToDecimal(bcd)).toBe("59");
    });

    it("handles empty strings", () => {
      expect(decimalToBcd("")).toBe("");
      expect(bcdToDecimal("")).toBe("");
    });

    it("rejects malformed BCD", () => {
      expect(() => bcdToDecimal("01010")).toThrow("BCD input must have 4-bit groups");
      expect(() => bcdToDecimal("1010")).toThrow("Invalid BCD digit"); // 10 is invalid BCD digit
    });

    it("rejects invalid decimal for BCD", () => {
      expect(() => decimalToBcd("1a")).toThrow("Invalid decimal input");
    });
  });

  describe("Base-N conversions", () => {
    it("handles valid values", () => {
      expect(baseNToDecimal("1A", 16)).toBe("26");
      expect(decimalToBaseN("26", 16)).toBe("1A");
    });

    it("handles empty strings", () => {
      expect(baseNToDecimal("", 16)).toBe("");
      expect(decimalToBaseN("", 16)).toBe("");
    });

    it("rejects invalid characters", () => {
      expect(() => baseNToDecimal("1G", 16)).toThrow("Invalid character for base-16");
    });

    it("rejects base out of range", () => {
      expect(() => baseNToDecimal("1", 1)).toThrow("Base must be between 2 and 36");
      expect(() => baseNToDecimal("1", 37)).toThrow("Base must be between 2 and 36");
      expect(() => decimalToBaseN("1", 1)).toThrow("Base must be between 2 and 36");
      expect(() => decimalToBaseN("1", 37)).toThrow("Base must be between 2 and 36");
    });

    it("rejects negative decimals when converting to base-N", () => {
      expect(() => decimalToBaseN("-1", 10)).toThrow("Negative numbers not supported");
    });
  });

  describe("Signed/Unsigned helpers", () => {
    it("converts signed negative to unsigned", () => {
      expect(signedToUnsigned("-1", 8)).toBe("255");
    });

    it("converts unsigned max to signed negative", () => {
      expect(unsignedToSigned("255", 8)).toBe("-1");
    });

    it("enforces ranges", () => {
      expect(() => signedToUnsigned("200", 8)).toThrow("Value out of range for 8-bit signed integer");
      expect(() => unsignedToSigned("999", 8)).toThrow("Value out of range for 8-bit unsigned integer");
    });

    it("throws for invalid number input or handles empty", () => {
      expect(() => signedToUnsigned("abc", 8)).toThrow("Invalid number");
      expect(() => unsignedToSigned("abc", 8)).toThrow("Invalid number");
      expect(signedToUnsigned("", 8)).toBe("");
      expect(unsignedToSigned("", 8)).toBe("");
    });
  });

  describe("IEEE 754 helpers", () => {
    it("converts float to single precision representation", () => {
      const result = floatToIEEE754("3.5", "single");
      expect(result).toBe("Hex: 40600000\nBinary: 01000000011000000000000000000000");
    });

    it("converts float to double precision representation", () => {
      const result = floatToIEEE754("3.5", "double");
      expect(result).toBe(
        "Hex: 400C000000000000\nBinary: 0100000000001100000000000000000000000000000000000000000000000000"
      );
    });

    it("decodes IEEE 754 hex back to float", () => {
      const single = parseFloat(ieee754ToFloat("40600000", "single"));
      expect(single).toBeCloseTo(3.5, 5);

      const dbl = parseFloat(ieee754ToFloat("400C000000000000", "double"));
      expect(dbl).toBeCloseTo(3.5, 10);
    });

    it("validates input length", () => {
      expect(() => ieee754ToFloat("1234", "double")).toThrow("Expected 16 hex characters for double precision");
    });

    it("throws for invalid inputs or handles empty", () => {
      expect(() => floatToIEEE754("abc")).toThrow("Invalid float number");
      expect(() => ieee754ToFloat("G1234567", "single")).toThrow("Invalid hex input");
      expect(floatToIEEE754("")).toBe("");
      expect(ieee754ToFloat("")).toBe("");
    });
  });
});

describe("convert() dispatcher", () => {
  type ConvertCase = {
    name: string;
    value: string;
    from: string;
    to: string;
    expected: string;
    config?: Parameters<typeof convert>[3];
  };

  const cases: ConvertCase[] = [
    { name: "binary to hex", value: "1010", from: "binary", to: "hex", expected: "A" },
    { name: "hex to binary", value: "A", from: "hex", to: "binary", expected: "1010" },
    { name: "hex to decimal", value: "A", from: "hex", to: "decimal", expected: "10" },
    { name: "decimal to hex", value: "15", from: "decimal", to: "hex", expected: "F" },
    { name: "decimal to binary", value: "10", from: "decimal", to: "binary", expected: "1010" },
    { name: "binary to decimal", value: "1010", from: "binary", to: "decimal", expected: "10" },
    { name: "binary to gray", value: "1011", from: "binary", to: "gray", expected: "1110" },
    { name: "gray to binary", value: "1110", from: "gray", to: "binary", expected: "1011" },
    { name: "ascii to hex", value: "Hi", from: "ascii", to: "hex", expected: "48 69" },
    { name: "hex to ascii", value: "4869", from: "hex", to: "ascii", expected: "Hi" },
    { name: "binary to ascii", value: "0100100001101001", from: "binary", to: "ascii", expected: "Hi" },
    { name: "ascii to binary", value: "Hi", from: "ascii", to: "binary", expected: "01001000 01101001" },
    { name: "octal to binary", value: "17", from: "octal", to: "binary", expected: "001111" },
    { name: "binary to octal", value: "1111", from: "binary", to: "octal", expected: "17" },
    { name: "octal to decimal", value: "17", from: "octal", to: "decimal", expected: "15" },
    { name: "decimal to octal", value: "15", from: "decimal", to: "octal", expected: "17" },
    { name: "octal to hex", value: "17", from: "octal", to: "hex", expected: "F" },
    { name: "hex to octal", value: "F", from: "hex", to: "octal", expected: "17" },
    { name: "decimal to BCD", value: "21", from: "decimal", to: "bcd", expected: "0010 0001" },
    { name: "BCD to decimal", value: "0010 0001", from: "bcd", to: "decimal", expected: "21" },
    {
      name: "signed to unsigned (16-bit)",
      value: "-10",
      from: "advanced-numeric",
      to: "unsigned",
      config: { bits: 16 },
      expected: (65536 - 10).toString(),
    },
    {
      name: "unsigned to signed (16-bit)",
      value: (65536 - 10).toString(),
      from: "advanced-numeric",
      to: "signed",
      config: { bits: 16 },
      expected: "-10",
    },
    {
      name: "base-n to decimal (base 8)",
      value: "17",
      from: "advanced-numeric",
      to: "base-n-decimal",
      config: { base: 8 },
      expected: "15",
    },
    {
      name: "decimal to base-n (base 8)",
      value: "15",
      from: "advanced-numeric",
      to: "decimal-base-n",
      config: { base: 8 },
      expected: "17",
    },
    {
      name: "float to IEEE754 (single)",
      value: "3.5",
      from: "advanced-numeric",
      to: "ieee754",
      config: { precision: "single" },
      expected: "Hex: 40600000\nBinary: 01000000011000000000000000000000",
    },
    {
      name: "IEEE754 to float (single)",
      value: "40600000",
      from: "advanced-numeric",
      to: "float",
      config: { precision: "single" },
      expected: "3.5",
    },
  ];

  it.each(cases)("converts %s", ({ value, from, to, config, expected }) => {
    expect(convert(value, from, to, config)).toBe(expected);
  });

  it("throws on unsupported conversions", () => {
    expect(() => convert("1", "foo", "bar")).toThrow("Unsupported conversion");
  });

  it("uses default config when none provided for advanced conversions", () => {
    // signed-to-unsigned defaults to 32-bit
    expect(convert("-1", "advanced-numeric", "unsigned")).toBe("4294967295");
    // unsigned-to-signed defaults to 32-bit
    expect(convert("4294967295", "advanced-numeric", "signed")).toBe("-1");
    // base-n-to-decimal defaults to base 16
    expect(convert("FF", "advanced-numeric", "base-n-decimal")).toBe("255");
    // decimal-to-base-n defaults to base 16
    expect(convert("255", "advanced-numeric", "decimal-base-n")).toBe("FF");
    // float-to-ieee754 defaults to single
    expect(convert("3.5", "advanced-numeric", "ieee754")).toContain("40600000");
    // ieee754-to-float defaults to single
    expect(convert("40600000", "advanced-numeric", "float")).toBe("3.5");
  });
});

// ──────────────────────────────────────────────────────────
// Extended coverage tests
// ──────────────────────────────────────────────────────────

describe("Zero edge cases", () => {
  it("handles zero across all basic conversions", () => {
    expect(binaryToHex("0")).toBe("0");
    expect(hexToBinary("0")).toBe("0000");
    expect(hexToDecimal("0")).toBe("0");
    expect(decimalToHex("0")).toBe("0");
    expect(decimalToBinary("0")).toBe("0");
    expect(binaryToDecimal("0")).toBe("0");
    expect(binaryToOctal("0")).toBe("0");
    expect(octalToBinary("0")).toBe("000");
    expect(octalToDecimal("0")).toBe("0");
    expect(decimalToOctal("0")).toBe("0");
    expect(octalToHex("0")).toBe("0");
    expect(hexToOctal("0")).toBe("0");
  });

  it("handles zero for BCD", () => {
    expect(decimalToBcd("0")).toBe("0000");
    expect(bcdToDecimal("0000")).toBe("0");
  });

  it("handles zero for signed/unsigned at all bit widths", () => {
    for (const bits of [8, 16, 32, 64] as const) {
      expect(signedToUnsigned("0", bits)).toBe("0");
      expect(unsignedToSigned("0", bits)).toBe("0");
    }
  });

  it("handles zero for base-N at extremes", () => {
    expect(baseNToDecimal("0", 2)).toBe("0");
    expect(baseNToDecimal("0", 36)).toBe("0");
    expect(decimalToBaseN("0", 2)).toBe("0");
    expect(decimalToBaseN("0", 36)).toBe("0");
  });

  it("handles zero for IEEE 754", () => {
    const singleZero = floatToIEEE754("0", "single");
    expect(singleZero).toContain("Hex: 00000000");
    expect(ieee754ToFloat("00000000", "single")).toBe("0");
  });

  it("handles zero for Gray code", () => {
    expect(binaryToGray("0")).toBe("0");
    expect(grayToBinary("0")).toBe("0");
  });
});

describe("Leading-zero padding", () => {
  describe("binaryToHex preserves width from input binary", () => {
    it("pads hex to match binary width", () => {
      expect(binaryToHex("00001010")).toBe("0A");
      expect(binaryToHex("00000000")).toBe("00");
      expect(binaryToHex("000000001")).toBe("001");
    });
  });

  describe("hexToBinary preserves width from input hex", () => {
    it("pads binary to match hex width", () => {
      expect(hexToBinary("0A")).toBe("00001010");
      expect(hexToBinary("00FF")).toBe("0000000011111111");
      expect(hexToBinary("0000")).toBe("0000000000000000");
    });
  });

  describe("octalToBinary preserves width from input octal", () => {
    it("pads binary to match octal width (3 bits per digit)", () => {
      expect(octalToBinary("07")).toBe("000111");
      expect(octalToBinary("010")).toBe("000001000");
      expect(octalToBinary("007")).toBe("000000111");
      expect(octalToBinary("1")).toBe("001");
      expect(octalToBinary("77")).toBe("111111");
    });
  });
});

describe("BigInt / large number paths", () => {
  it("handles numbers larger than 2^53 in binary/hex/decimal conversions", () => {
    const largeDec = "18446744073709551615"; // 2^64 - 1
    const largeHex = "FFFFFFFFFFFFFFFF";
    const largeBin = "1111111111111111111111111111111111111111111111111111111111111111";

    expect(hexToDecimal(largeHex)).toBe(largeDec);
    expect(decimalToHex(largeDec)).toBe(largeHex);
    expect(binaryToDecimal(largeBin)).toBe(largeDec);
    expect(decimalToBinary(largeDec)).toBe(largeBin);
    expect(binaryToHex(largeBin)).toBe(largeHex);
    expect(hexToBinary(largeHex)).toBe(largeBin);
  });

  describe("64-bit signed/unsigned", () => {
    it("converts -1 signed to max unsigned 64-bit", () => {
      expect(signedToUnsigned("-1", 64)).toBe("18446744073709551615");
    });

    it("converts max unsigned 64-bit to -1 signed", () => {
      expect(unsignedToSigned("18446744073709551615", 64)).toBe("-1");
    });

    it("converts min signed 64-bit to unsigned", () => {
      expect(signedToUnsigned("-9223372036854775808", 64)).toBe("9223372036854775808");
    });

    it("converts unsigned 2^63 to signed min", () => {
      expect(unsignedToSigned("9223372036854775808", 64)).toBe("-9223372036854775808");
    });

    it("passes through positive values unchanged", () => {
      expect(signedToUnsigned("42", 64)).toBe("42");
      expect(unsignedToSigned("42", 64)).toBe("42");
    });

    it("rejects out-of-range 64-bit values", () => {
      expect(() => signedToUnsigned("9223372036854775808", 64)).toThrow("Value out of range");
      expect(() => signedToUnsigned("-9223372036854775809", 64)).toThrow("Value out of range");
      expect(() => unsignedToSigned("18446744073709551616", 64)).toThrow("Value out of range");
      expect(() => unsignedToSigned("-1", 64)).toThrow("Value out of range");
    });
  });

  describe("base-N with large numbers", () => {
    it("handles large base-16 values accurately (beyond 2^53)", () => {
      expect(baseNToDecimal("FFFFFFFFFFFFFFFF", 16)).toBe("18446744073709551615");
    });

    it("handles large decimal-to-base-N accurately", () => {
      expect(decimalToBaseN("18446744073709551615", 16)).toBe("FFFFFFFFFFFFFFFF");
    });

    it("round-trips large values through base-N conversions", () => {
      const large = "999999999999999999999";
      const hex = decimalToBaseN(large, 16);
      expect(baseNToDecimal(hex, 16)).toBe(large);
    });
  });
});

describe("Boundary values for signed/unsigned", () => {
  it("handles 8-bit boundaries", () => {
    expect(signedToUnsigned("-128", 8)).toBe("128");
    expect(signedToUnsigned("127", 8)).toBe("127");
    expect(unsignedToSigned("255", 8)).toBe("-1");
    expect(unsignedToSigned("128", 8)).toBe("-128");
    expect(unsignedToSigned("127", 8)).toBe("127");
  });

  it("handles 16-bit boundaries", () => {
    expect(signedToUnsigned("-32768", 16)).toBe("32768");
    expect(signedToUnsigned("32767", 16)).toBe("32767");
    expect(unsignedToSigned("65535", 16)).toBe("-1");
    expect(unsignedToSigned("32768", 16)).toBe("-32768");
  });

  it("handles 32-bit boundaries", () => {
    expect(signedToUnsigned("-2147483648", 32)).toBe("2147483648");
    expect(signedToUnsigned("2147483647", 32)).toBe("2147483647");
    expect(unsignedToSigned("4294967295", 32)).toBe("-1");
    expect(unsignedToSigned("2147483648", 32)).toBe("-2147483648");
  });

  it("rejects values just outside range for each bit width", () => {
    expect(() => signedToUnsigned("128", 8)).toThrow("Value out of range");
    expect(() => signedToUnsigned("-129", 8)).toThrow("Value out of range");
    expect(() => unsignedToSigned("256", 8)).toThrow("Value out of range");
    expect(() => signedToUnsigned("32768", 16)).toThrow("Value out of range");
    expect(() => unsignedToSigned("65536", 16)).toThrow("Value out of range");
    expect(() => signedToUnsigned("2147483648", 32)).toThrow("Value out of range");
    expect(() => unsignedToSigned("4294967296", 32)).toThrow("Value out of range");
  });
});

describe("Base-N edge cases", () => {
  it("works with base-2 (binary)", () => {
    expect(baseNToDecimal("1010", 2)).toBe("10");
    expect(decimalToBaseN("10", 2)).toBe("1010");
  });

  it("works with base-36", () => {
    expect(baseNToDecimal("Z", 36)).toBe("35");
    expect(decimalToBaseN("35", 36)).toBe("Z");
    expect(baseNToDecimal("ZZ", 36)).toBe("1295");
    expect(decimalToBaseN("1295", 36)).toBe("ZZ");
  });

  it("rejects invalid characters for specific bases", () => {
    expect(() => baseNToDecimal("2", 2)).toThrow("Invalid character for base-2");
    expect(() => baseNToDecimal("A", 10)).toThrow("Invalid character for base-10");
    expect(() => baseNToDecimal("G", 16)).toThrow("Invalid character for base-16");
  });

  it("handles case insensitivity", () => {
    expect(baseNToDecimal("ff", 16)).toBe("255");
    expect(baseNToDecimal("zz", 36)).toBe("1295");
  });

  it("rejects non-numeric input for decimalToBaseN", () => {
    expect(() => decimalToBaseN("abc", 16)).toThrow("Invalid decimal number");
    expect(() => decimalToBaseN("12.5", 10)).toThrow("Invalid decimal number");
  });
});

describe("IEEE 754 special values", () => {
  it("handles negative numbers", () => {
    const result = floatToIEEE754("-3.5", "single");
    expect(result).toContain("Hex: C0600000");
    expect(parseFloat(ieee754ToFloat("C0600000", "single"))).toBeCloseTo(-3.5, 5);
  });

  it("handles very small numbers", () => {
    const result = floatToIEEE754("0.1", "single");
    expect(result).toMatch(/Hex: [0-9A-F]{8}/);
    expect(result).toMatch(/Binary: [01]{32}/);
  });

  it("handles Infinity", () => {
    const result = floatToIEEE754("Infinity", "single");
    expect(result).toContain("Hex: 7F800000");
    expect(ieee754ToFloat("7F800000", "single")).toBe("Infinity");
  });

  it("handles negative Infinity", () => {
    const result = floatToIEEE754("-Infinity", "single");
    expect(result).toContain("Hex: FF800000");
    expect(ieee754ToFloat("FF800000", "single")).toBe("-Infinity");
  });

  it("handles negative zero", () => {
    const result = floatToIEEE754("-0", "single");
    expect(result).toContain("Hex: 80000000");
  });

  it("validates single precision requires 8 hex chars", () => {
    expect(() => ieee754ToFloat("1234567", "single")).toThrow("Expected 8 hex characters");
    expect(() => ieee754ToFloat("123456789", "single")).toThrow("Expected 8 hex characters");
  });

  it("validates double precision requires 16 hex chars", () => {
    expect(() => ieee754ToFloat("12345678", "double")).toThrow("Expected 16 hex characters");
  });

  it("round-trips various floats in double precision", () => {
    const values = ["1.0", "-1.0", "3.14159", "0.001", "1000000.5"];
    for (const val of values) {
      const encoded = floatToIEEE754(val, "double");
      const hexMatch = encoded.match(/Hex:\s*([0-9A-F]+)/i);
      expect(hexMatch).not.toBeNull();
      const decoded = parseFloat(ieee754ToFloat(hexMatch![1], "double"));
      expect(decoded).toBeCloseTo(parseFloat(val), 10);
    }
  });
});

describe("Round-trip consistency", () => {
  it("decimal ↔ hex round-trips", () => {
    const values = ["0", "1", "255", "65535", "1000000"];
    for (const dec of values) {
      expect(hexToDecimal(decimalToHex(dec))).toBe(dec);
    }
  });

  it("decimal ↔ binary round-trips", () => {
    const values = ["0", "1", "42", "255", "1024"];
    for (const dec of values) {
      expect(binaryToDecimal(decimalToBinary(dec))).toBe(dec);
    }
  });

  it("decimal ↔ octal round-trips", () => {
    const values = ["0", "1", "7", "8", "255", "65535"];
    for (const dec of values) {
      expect(octalToDecimal(decimalToOctal(dec))).toBe(dec);
    }
  });

  it("ascii ↔ hex round-trips", () => {
    const values = ["A", "Hello", "!@#", " "];
    for (const ascii of values) {
      expect(hexToAscii(asciiToHex(ascii))).toBe(ascii);
    }
  });

  it("ascii ↔ binary round-trips", () => {
    const values = ["A", "Hi", "test"];
    for (const ascii of values) {
      expect(binaryToAscii(asciiToBinary(ascii))).toBe(ascii);
    }
  });

  it("Gray code round-trips", () => {
    const values = ["0", "1", "1011", "11111111", "10101010"];
    for (const bin of values) {
      expect(grayToBinary(binaryToGray(bin))).toBe(bin);
    }
  });

  it("BCD round-trips", () => {
    const values = ["0", "1", "9", "59", "123", "999"];
    for (const dec of values) {
      expect(bcdToDecimal(decimalToBcd(dec))).toBe(dec);
    }
  });

  it("signed ↔ unsigned round-trips for all bit widths", () => {
    for (const bits of [8, 16, 32, 64] as const) {
      expect(unsignedToSigned(signedToUnsigned("-1", bits), bits)).toBe("-1");
      expect(signedToUnsigned(unsignedToSigned("0", bits), bits)).toBe("0");
    }
  });

  it("base-N round-trips for various bases", () => {
    for (const base of [2, 8, 10, 16, 36]) {
      const encoded = decimalToBaseN("12345", base);
      expect(baseNToDecimal(encoded, base)).toBe("12345");
    }
  });
});

describe("Gray code additional cases", () => {
  it("handles single bit", () => {
    expect(binaryToGray("0")).toBe("0");
    expect(binaryToGray("1")).toBe("1");
    expect(grayToBinary("0")).toBe("0");
    expect(grayToBinary("1")).toBe("1");
  });

  it("handles all-zeros and all-ones", () => {
    expect(binaryToGray("0000")).toBe("0000");
    expect(binaryToGray("1111")).toBe("1000");
    expect(grayToBinary("0000")).toBe("0000");
    expect(grayToBinary("1000")).toBe("1111");
  });

  it("handles known 4-bit Gray code sequence", () => {
    expect(binaryToGray("0000")).toBe("0000");
    expect(binaryToGray("0001")).toBe("0001");
    expect(binaryToGray("0010")).toBe("0011");
    expect(binaryToGray("0011")).toBe("0010");
    expect(binaryToGray("0100")).toBe("0110");
    expect(binaryToGray("0101")).toBe("0111");
    expect(binaryToGray("0110")).toBe("0101");
    expect(binaryToGray("0111")).toBe("0100");
  });
});

describe("BCD additional cases", () => {
  it("handles single digit", () => {
    expect(decimalToBcd("5")).toBe("0101");
    expect(bcdToDecimal("0101")).toBe("5");
  });

  it("handles multi-digit with leading zeros in BCD", () => {
    expect(decimalToBcd("100")).toBe("0001 0000 0000");
    expect(bcdToDecimal("0001 0000 0000")).toBe("100");
  });

  it("handles BCD with leading zero nibbles", () => {
    expect(bcdToDecimal("00000101")).toBe("5");
  });

  it("rejects non-binary characters in BCD", () => {
    expect(() => bcdToDecimal("012A")).toThrow("Invalid BCD input");
  });
});

describe("ASCII edge cases", () => {
  it("handles null byte (0x00)", () => {
    expect(hexToAscii("00")).toBe("\0");
    expect(asciiToHex("\0")).toBe("00");
  });

  it("handles DEL (0x7F) and high bytes", () => {
    expect(hexToAscii("7F")).toBe("\x7F");
    expect(hexToAscii("FF")).toBe("\xFF");
  });

  it("handles multi-byte hex strings with spaces", () => {
    expect(hexToAscii("48 65 6C 6C 6F")).toBe("Hello");
  });

  it("asciiToHex handles special characters", () => {
    expect(asciiToHex("\n")).toBe("0A");
    expect(asciiToHex("\t")).toBe("09");
    expect(asciiToHex(" ")).toBe("20");
  });
});
