export interface ConversionExplanation {
  from: string;
  to: string;
  fromBase: number;
  toBase: number;
  fromDigits: string;
  toDigits: string;
  explanation: string;
  steps: string[];
  table?: { from: string; to: string }[];
  example: {
    input: string;
    output: string;
    steps: string[];
  };
}

export const conversionExplanations: Record<string, ConversionExplanation> = {
  "binary-to-hex": {
    from: "Binary",
    to: "Hexadecimal",
    fromBase: 2,
    toBase: 16,
    fromDigits: "0, 1",
    toDigits: "0-9, A-F",
    explanation: "Convert every 4 binary digits (starting from the least significant bit) into one hexadecimal digit.",
    steps: [
      "Group binary digits into sets of 4 from right to left",
      "Pad with leading zeros if needed to make complete groups",
      "Convert each 4-bit group to its hex equivalent"
    ],
    table: [
      { from: "0000", to: "0" }, { from: "0001", to: "1" },
      { from: "0010", to: "2" }, { from: "0011", to: "3" },
      { from: "0100", to: "4" }, { from: "0101", to: "5" },
      { from: "0110", to: "6" }, { from: "0111", to: "7" },
      { from: "1000", to: "8" }, { from: "1001", to: "9" },
      { from: "1010", to: "A" }, { from: "1011", to: "B" },
      { from: "1100", to: "C" }, { from: "1101", to: "D" },
      { from: "1110", to: "E" }, { from: "1111", to: "F" }
    ],
    example: {
      input: "1101100",
      output: "6C",
      steps: [
        "Pad to: 0110 1100",
        "0110 = 6, 1100 = C"
      ]
    }
  },
  "binary-to-gray": {
    from: "Binary",
    to: "Gray Code",
    fromBase: 2,
    toBase: 2,
    fromDigits: "0, 1",
    toDigits: "0, 1 (Gray)",
    explanation: "Gray code preserves adjacency by flipping only one bit; derive it by XOR'ing each binary bit with the bit before it.",
    steps: [
      "Keep the most significant bit unchanged",
      "For each remaining position, XOR the current binary bit with the previous binary bit",
      "Collect the results to form the Gray code"
    ],
    example: {
      input: "1101",
      output: "1011",
      steps: [
        "MSB stays 1",
        "Second bit: 1⊕1 = 0",
        "Third bit: 0⊕1 = 1",
        "Fourth bit: 1⊕0 = 1"
      ]
    }
  },
  "gray-to-binary": {
    from: "Gray Code",
    to: "Binary",
    fromBase: 2,
    toBase: 2,
    fromDigits: "0, 1 (Gray)",
    toDigits: "0, 1",
    explanation: "Recover the binary value by cumulatively XOR'ing Gray bits with the previous binary result.",
    steps: [
      "Keep the most significant bit unchanged",
      "For each following bit, XOR the Gray bit with the previously decoded binary bit",
      "Repeat until all bits are decoded"
    ],
    example: {
      input: "1011",
      output: "1101",
      steps: [
        "MSB stays 1",
        "Next: 0⊕1 = 1",
        "Next: 1⊕1 = 0",
        "Next: 1⊕0 = 1"
      ]
    }
  },
  "hex-to-binary": {
    from: "Hexadecimal",
    to: "Binary",
    fromBase: 16,
    toBase: 2,
    fromDigits: "0-9, A-F",
    toDigits: "0, 1",
    explanation: "Convert each hexadecimal digit to its 4-bit binary equivalent.",
    steps: [
      "Take each hex digit individually",
      "Convert each digit to its 4-bit binary representation",
      "Combine all binary groups"
    ],
    example: {
      input: "6C",
      output: "01101100",
      steps: [
        "6 = 0110",
        "C = 1100",
        "Result: 01101100"
      ]
    }
  },
  "binary-to-decimal": {
    from: "Binary",
    to: "Decimal",
    fromBase: 2,
    toBase: 10,
    fromDigits: "0, 1",
    toDigits: "0-9",
    explanation: "Multiply each binary digit by 2 raised to its position power (starting from 0 on the right).",
    steps: [
      "Write powers of 2 under each digit (right to left: 2^0, 2^1, 2^2...)",
      "Multiply each digit by its power of 2",
      "Sum all the results"
    ],
    example: {
      input: "1101",
      output: "13",
      steps: [
        "1×2^3 + 1×2^2 + 0×2^1 + 1×2^0",
        "= 8 + 4 + 0 + 1 = 13"
      ]
    }
  },
  "decimal-to-binary": {
    from: "Decimal",
    to: "Binary",
    fromBase: 10,
    toBase: 2,
    fromDigits: "0-9",
    toDigits: "0, 1",
    explanation: "Repeatedly divide by 2 and record remainders (read remainders from bottom to top).",
    steps: [
      "Divide the number by 2",
      "Record the remainder (0 or 1)",
      "Repeat with the quotient until it becomes 0",
      "Read remainders from bottom to top"
    ],
    example: {
      input: "13",
      output: "1101",
      steps: [
        "13 ÷ 2 = 6 remainder 1",
        "6 ÷ 2 = 3 remainder 0",
        "3 ÷ 2 = 1 remainder 1",
        "1 ÷ 2 = 0 remainder 1",
        "Read up: 1101"
      ]
    }
  },
  "hex-to-decimal": {
    from: "Hexadecimal",
    to: "Decimal",
    fromBase: 16,
    toBase: 10,
    fromDigits: "0-9, A-F",
    toDigits: "0-9",
    explanation: "Multiply each hex digit by 16 raised to its position power (A=10, B=11, etc.).",
    steps: [
      "Convert hex letters to decimal values (A=10, B=11, etc.)",
      "Multiply each digit by 16^position (right to left)",
      "Sum all the results"
    ],
    example: {
      input: "62C",
      output: "1580",
      steps: [
        "6×16^2 + 2×16^1 + 12×16^0",
        "= 1536 + 32 + 12 = 1580"
      ]
    }
  },
  "decimal-to-hex": {
    from: "Decimal",
    to: "Hexadecimal",
    fromBase: 10,
    toBase: 16,
    fromDigits: "0-9",
    toDigits: "0-9, A-F",
    explanation: "Repeatedly divide by 16 and record remainders (10=A, 11=B, etc.).",
    steps: [
      "Divide the number by 16",
      "Record the remainder (0-15, where 10=A, 11=B, etc.)",
      "Repeat with the quotient until it becomes 0",
      "Read remainders from bottom to top"
    ],
    example: {
      input: "1580",
      output: "62C",
      steps: [
        "1580 ÷ 16 = 98 remainder 12 (C)",
        "98 ÷ 16 = 6 remainder 2",
        "6 ÷ 16 = 0 remainder 6",
        "Read up: 62C"
      ]
    }
  },
  "binary-to-octal": {
    from: "Binary",
    to: "Octal",
    fromBase: 2,
    toBase: 8,
    fromDigits: "0, 1",
    toDigits: "0-7",
    explanation: "Convert every 3 binary digits into one octal digit.",
    steps: [
      "Group binary digits into sets of 3 from right to left",
      "Pad with leading zeros if needed",
      "Convert each 3-bit group to its octal equivalent"
    ],
    example: {
      input: "1101100",
      output: "154",
      steps: [
        "Pad to: 001 101 100",
        "001=1, 101=5, 100=4"
      ]
    }
  },
  "octal-to-binary": {
    from: "Octal",
    to: "Binary",
    fromBase: 8,
    toBase: 2,
    fromDigits: "0-7",
    toDigits: "0, 1",
    explanation: "Convert each octal digit to its 3-bit binary equivalent.",
    steps: [
      "Take each octal digit individually",
      "Convert to 3-bit binary",
      "Combine all binary groups"
    ],
    example: {
      input: "154",
      output: "001101100",
      steps: [
        "1 = 001, 5 = 101, 4 = 100",
        "Result: 001101100"
      ]
    }
  },
  "octal-to-decimal": {
    from: "Octal",
    to: "Decimal",
    fromBase: 8,
    toBase: 10,
    fromDigits: "0-7",
    toDigits: "0-9",
    explanation: "Multiply each octal digit by 8 raised to its position power.",
    steps: [
      "Multiply each digit by 8^position (right to left)",
      "Sum all the results"
    ],
    example: {
      input: "154",
      output: "108",
      steps: [
        "1×8^2 + 5×8^1 + 4×8^0",
        "= 64 + 40 + 4 = 108"
      ]
    }
  },
  "decimal-to-octal": {
    from: "Decimal",
    to: "Octal",
    fromBase: 10,
    toBase: 8,
    fromDigits: "0-9",
    toDigits: "0-7",
    explanation: "Repeatedly divide by 8 and record remainders.",
    steps: [
      "Divide by 8, record remainder",
      "Repeat with quotient until 0",
      "Read remainders from bottom to top"
    ],
    example: {
      input: "108",
      output: "154",
      steps: [
        "108 ÷ 8 = 13 remainder 4",
        "13 ÷ 8 = 1 remainder 5",
        "1 ÷ 8 = 0 remainder 1",
        "Read up: 154"
      ]
    }
  },
  "hex-to-octal": {
    from: "Hexadecimal",
    to: "Octal",
    fromBase: 16,
    toBase: 8,
    fromDigits: "0-9, A-F",
    toDigits: "0-7",
    explanation: "Convert hex to binary first, then group binary into sets of 3 for octal.",
    steps: [
      "Convert each hex digit to 4-bit binary",
      "Group binary into sets of 3 from right",
      "Convert each 3-bit group to octal"
    ],
    example: {
      input: "6C",
      output: "154",
      steps: [
        "6C = 0110 1100",
        "Group: 001 101 100",
        "= 1 5 4 = 154"
      ]
    }
  },
  "octal-to-hex": {
    from: "Octal",
    to: "Hexadecimal",
    fromBase: 8,
    toBase: 16,
    fromDigits: "0-7",
    toDigits: "0-9, A-F",
    explanation: "Convert octal to binary first, then group binary into sets of 4 for hex.",
    steps: [
      "Convert each octal digit to 3-bit binary",
      "Group binary into sets of 4 from right",
      "Convert each 4-bit group to hex"
    ],
    example: {
      input: "154",
      output: "6C",
      steps: [
        "154 = 001 101 100",
        "Group: 0110 1100",
        "= 6 C = 6C"
      ]
    }
  },
  "ascii-to-hex": {
    from: "ASCII",
    to: "Hexadecimal",
    fromBase: 0,
    toBase: 16,
    fromDigits: "Text characters",
    toDigits: "0-9, A-F",
    explanation: "Convert each ASCII character to its decimal code, then to 2-digit hex.",
    steps: [
      "Find ASCII decimal value for each character",
      "Convert decimal to 2-digit hex",
      "Separate with spaces"
    ],
    example: {
      input: "Hi",
      output: "48 69",
      steps: [
        "'H' = 72 decimal = 48 hex",
        "'i' = 105 decimal = 69 hex"
      ]
    }
  },
  "hex-to-ascii": {
    from: "Hexadecimal",
    to: "ASCII",
    fromBase: 16,
    toBase: 0,
    fromDigits: "0-9, A-F",
    toDigits: "Text characters",
    explanation: "Convert each 2-digit hex value to its ASCII character.",
    steps: [
      "Split hex string into 2-digit pairs",
      "Convert each pair from hex to decimal",
      "Convert decimal to ASCII character"
    ],
    example: {
      input: "48 69",
      output: "Hi",
      steps: [
        "48 hex = 72 decimal = 'H'",
        "69 hex = 105 decimal = 'i'"
      ]
    }
  },
  "ascii-to-binary": {
    from: "ASCII",
    to: "Binary",
    fromBase: 0,
    toBase: 2,
    fromDigits: "Text characters",
    toDigits: "0, 1",
    explanation: "Convert each ASCII character to its decimal code, then to 8-bit binary.",
    steps: [
      "Find ASCII decimal value for each character",
      "Convert decimal to 8-bit binary",
      "Separate with spaces"
    ],
    example: {
      input: "Hi",
      output: "01001000 01101001",
      steps: [
        "'H' = 72 = 01001000",
        "'i' = 105 = 01101001"
      ]
    }
  },
  "binary-to-ascii": {
    from: "Binary",
    to: "ASCII",
    fromBase: 2,
    toBase: 0,
    fromDigits: "0, 1",
    toDigits: "Text characters",
    explanation: "Convert each 8-bit binary group to its ASCII character.",
    steps: [
      "Group binary into 8-bit bytes",
      "Convert each byte from binary to decimal",
      "Convert decimal to ASCII character"
    ],
    example: {
      input: "01001000 01101001",
      output: "Hi",
      steps: [
        "01001000 = 72 = 'H'",
        "01101001 = 105 = 'i'"
      ]
    }
  }
  ,
  "decimal-to-bcd": {
    from: "Decimal",
    to: "BCD",
    fromBase: 10,
    toBase: 2,
    fromDigits: "0-9",
    toDigits: "0000-1001 (4-bit groups)",
    explanation: "Represent each decimal digit independently using a 4-bit binary nibble (Binary-Coded Decimal).",
    steps: [
      "Split the decimal number into individual digits",
      "Convert each digit to a 4-bit binary value (0→0000 ... 9→1001)",
      "Separate nibbles with spaces for readability"
    ],
    example: {
      input: "18",
      output: "0001 1000",
      steps: [
        "Split into digits 1 and 8",
        "1 = 0001, 8 = 1000",
        "Result: 0001 1000"
      ]
    }
  },
  "bcd-to-decimal": {
    from: "BCD",
    to: "Decimal",
    fromBase: 2,
    toBase: 10,
    fromDigits: "0000-1001 (4-bit groups)",
    toDigits: "0-9",
    explanation: "Group bits into nibbles, convert each nibble back to its decimal digit, and concatenate the digits.",
    steps: [
      "Remove whitespace and ensure the bit-string length is a multiple of 4",
      "Convert each 4-bit nibble to decimal (must be 0-9)",
      "Concatenate digits and trim leading zeros"
    ],
    example: {
      input: "0001 1000",
      output: "18",
      steps: [
        "Groups: 0001 and 1000",
        "0001 = 1, 1000 = 8",
        "Result: 18"
      ]
    }
  }
};
