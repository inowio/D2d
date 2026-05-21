import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiClipboardCopy, HiCheck } from "react-icons/hi";
import { copyToClipboard } from "../utils/clipboard";

interface FieldState {
  value: string;
  error: string;
}

interface AllFields {
  binary: FieldState;
  hex: FieldState;
  decimal: FieldState;
  octal: FieldState;
  ascii: FieldState;
}

const initialFields: AllFields = {
  binary: { value: "", error: "" },
  hex: { value: "", error: "" },
  decimal: { value: "", error: "" },
  octal: { value: "", error: "" },
  ascii: { value: "", error: "" },
};

export default function AllInOneConverter(): React.ReactElement {
  const navigate = useNavigate();
  const [fields, setFields] = useState<AllFields>(initialFields);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const parseBinary = (value: string): number | number[] | bigint | null => {
    const trimmed = value.trim();
    const parts = trimmed.split(/\s+/);

    // Single value - support arbitrary large binary via BigInt
    if (parts.length === 1) {
      if (!/^[01]+$/.test(parts[0])) return null;
      // For small binary (up to 8 bits), return as number for ASCII compatibility
      if (parts[0].length <= 8) {
        const num = parseInt(parts[0], 2);
        if (!isNaN(num) && num >= 0 && num <= 255) {
          return num;
        }
      }
      // For larger binary, use BigInt
      try {
        return BigInt(`0b${parts[0]}`);
      } catch {
        return null;
      }
    }

    // Multiple space-separated values - treat as byte array (each max 8 bits)
    const bytes: number[] = [];
    for (const part of parts) {
      if (!/^[01]{1,8}$/.test(part)) return null;
      const num = parseInt(part, 2);
      if (isNaN(num)) return null;
      bytes.push(num);
    }
    return bytes;
  };

  const parseHex = (value: string): number | number[] | bigint | null => {
    const trimmed = value.trim();
    // Remove all 0x prefixes
    const cleanedTrimmed = trimmed.replace(/0x/gi, "");
    const parts = cleanedTrimmed.split(/\s+/);

    // Single value
    if (parts.length === 1) {
      if (!/^[0-9A-Fa-f]+$/.test(parts[0])) return null;
      // For small hex (1-2 chars), return as number for ASCII compatibility
      if (parts[0].length <= 2) {
        const num = parseInt(parts[0], 16);
        if (!isNaN(num) && num >= 0 && num <= 255) {
          return num;
        }
      }
      // For even-length hex > 2 chars, split into byte pairs
      if (parts[0].length % 2 === 0) {
        const bytes: number[] = [];
        for (let i = 0; i < parts[0].length; i += 2) {
          bytes.push(parseInt(parts[0].substring(i, i + 2), 16));
        }
        return bytes;
      }
      // For odd-length larger hex, use BigInt
      try {
        return BigInt(`0x${parts[0]}`);
      } catch {
        return null;
      }
    }

    // Multiple space-separated values - treat as byte array (each max 2 hex chars)
    const bytes: number[] = [];
    for (const part of parts) {
      if (!/^[0-9A-Fa-f]{1,2}$/.test(part)) return null;
      const num = parseInt(part, 16);
      if (isNaN(num)) return null;
      bytes.push(num);
    }
    return bytes;
  };

  const parseDecimal = (value: string): number | number[] | bigint | null => {
    const trimmed = value.trim();
    const parts = trimmed.split(/\s+/);

    // Single value - support arbitrary large integers via BigInt
    if (parts.length === 1) {
      if (!/^\d+$/.test(parts[0])) return null;
      const num = parseInt(parts[0], 10);
      // For small numbers, return as number for ASCII compatibility
      if (!isNaN(num) && num >= 0 && num <= 255) {
        return num;
      }
      // For larger numbers, use BigInt
      try {
        return BigInt(parts[0]);
      } catch {
        return null;
      }
    }

    // Multiple space-separated values - treat as byte array (0-255 each)
    const bytes: number[] = [];
    for (const part of parts) {
      if (!/^\d{1,3}$/.test(part)) return null;
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 0 || num > 255) return null;
      bytes.push(num);
    }
    return bytes;
  };

  const parseOctal = (value: string): number | number[] | null => {
    const parts = value.trim().split(/\s+/);
    const bytes: number[] = [];
    for (const part of parts) {
      if (!/^[0-7]{1,3}$/.test(part)) return null;
      const num = parseInt(part, 8);
      if (isNaN(num) || num > 255) return null;
      bytes.push(num);
    }
    return bytes.length === 1 ? bytes[0] : bytes;
  };

  const parseAscii = (value: string): number[] | null => {
    if (!value) return null;
    const bytes: number[] = [];
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      if (code > 255) return null;
      bytes.push(code);
    }
    return bytes;
  };

  const numberToAscii = (num: number): string | null => {
    if (num < 0 || num > 255) return null;
    return String.fromCharCode(num);
  };

  const updateAllFields = (source: keyof AllFields, value: string) => {
    setFields((prev) => {
      const newFields: AllFields = { ...prev };

      if (!value.trim()) {
        return initialFields;
      }

      let numValue: number | number[] | bigint | null = null;
      let isValid = true;

      switch (source) {
        case "binary":
          numValue = parseBinary(value);
          if (numValue === null && value) {
            newFields.binary = { value, error: "Invalid binary (use 0-1)" };
            isValid = false;
          }
          break;
        case "hex":
          numValue = parseHex(value);
          if (numValue === null && value) {
            newFields.hex = { value, error: "Invalid hex (use 0-9, A-F)" };
            isValid = false;
          }
          break;
        case "decimal":
          numValue = parseDecimal(value);
          if (numValue === null && value) {
            newFields.decimal = { value, error: "Invalid decimal" };
            isValid = false;
          }
          break;
        case "octal":
          numValue = parseOctal(value);
          if (numValue === null && value) {
            newFields.octal = { value, error: "Invalid octal (use 0-7)" };
            isValid = false;
          }
          break;
        case "ascii":
          numValue = parseAscii(value);
          break;
      }

      if (!isValid || numValue === null) {
        (Object.keys(newFields) as (keyof AllFields)[]).forEach((key) => {
          if (key !== source) {
            newFields[key] = { value: "", error: "" };
          }
        });
        return newFields;
      }

      if (numValue !== null) {
        if (Array.isArray(numValue)) {
          // Multi-byte ASCII input - update numeric fields with space-separated values
          const bytes = numValue;
          if (source !== "binary") {
            newFields.binary = { value: bytes.map((b) => b.toString(2).padStart(8, "0")).join(" "), error: "" };
          } else {
            newFields.binary = { value, error: "" };
          }
          if (source !== "hex") {
            newFields.hex = { value: bytes.map((b) => b.toString(16).toUpperCase().padStart(2, "0")).join(" "), error: "" };
          } else {
            newFields.hex = { value, error: "" };
          }
          if (source !== "decimal") {
            newFields.decimal = { value: bytes.map((b) => b.toString(10)).join(" "), error: "" };
          } else {
            newFields.decimal = { value, error: "" };
          }
          if (source !== "octal") {
            newFields.octal = { value: bytes.map((b) => b.toString(8)).join(" "), error: "" };
          } else {
            newFields.octal = { value, error: "" };
          }
          if (source !== "ascii") {
            newFields.ascii = { value: bytes.map((b) => String.fromCharCode(b)).join(""), error: "" };
          } else {
            newFields.ascii = { value, error: "" };
          }
        } else if (typeof numValue === "bigint") {
          // BigInt value - for large numbers
          const bigNum = numValue;
          if (source !== "binary") {
            newFields.binary = { value: bigNum.toString(2), error: "" };
          } else {
            newFields.binary = { value, error: "" };
          }
          if (source !== "hex") {
            newFields.hex = { value: bigNum.toString(16).toUpperCase(), error: "" };
          } else {
            newFields.hex = { value, error: "" };
          }
          if (source !== "decimal") {
            newFields.decimal = { value: bigNum.toString(10), error: "" };
          } else {
            newFields.decimal = { value, error: "" };
          }
          if (source !== "octal") {
            newFields.octal = { value: bigNum.toString(8), error: "" };
          } else {
            newFields.octal = { value, error: "" };
          }
          // BigInt values > 255 cannot be represented as single ASCII char
          newFields.ascii = { value: "", error: "" };
        } else {
          // Single numeric value (number)
          const singleNum = numValue;
          if (source !== "binary") {
            newFields.binary = { value: singleNum.toString(2), error: "" };
          } else {
            newFields.binary = { value, error: "" };
          }
          if (source !== "hex") {
            newFields.hex = { value: singleNum.toString(16).toUpperCase(), error: "" };
          } else {
            newFields.hex = { value, error: "" };
          }
          if (source !== "decimal") {
            newFields.decimal = { value: singleNum.toString(10), error: "" };
          } else {
            newFields.decimal = { value, error: "" };
          }
          if (source !== "octal") {
            newFields.octal = { value: singleNum.toString(8), error: "" };
          } else {
            newFields.octal = { value, error: "" };
          }
          if (source !== "ascii") {
            const ascii = numberToAscii(singleNum);
            newFields.ascii = { value: ascii || "", error: "" };
          } else {
            newFields.ascii = { value, error: "" };
          }
        }
      }

      return newFields;
    });
  };

  const handleChange = (field: keyof AllFields, value: string) => {
    updateAllFields(field, value);
  };

  const handleCopy = async (field: keyof AllFields): Promise<void> => {
    const value = fields[field].value;
    if (!value) return;
    const success = await copyToClipboard(value);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } else {
      setFields((prev) => ({
        ...prev,
        [field]: { ...prev[field], error: "Failed to copy" },
      }));
    }
  };

  const handleClear = (): void => {
    setFields(initialFields);
  };

  const hasAnyValue = Object.values(fields).some((f) => f.value);

  const totalBytes = (() => {
    const hexValue = fields.hex.value.trim();
    if (!hexValue) return 0;
    const parts = hexValue.split(/\s+/);
    if (parts.length > 1) return parts.length;
    return Math.ceil(parts[0].length / 2);
  })();

  const fieldConfig = [
    { key: "ascii" as const, label: "ASCII", placeholder: "Character or text" },
    { key: "hex" as const, label: "Hexadecimal", placeholder: "AA or 0xAA" },
    { key: "decimal" as const, label: "Decimal", placeholder: "170" },
    { key: "binary" as const, label: "Binary", placeholder: "10101010" },
    { key: "octal" as const, label: "Octal", placeholder: "252" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <HiArrowLeft className="w-5 h-5" />
        <span>Back to converter list</span>
      </button>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Multi-Format Converter
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Edit any field to convert between all formats simultaneously
            </p>
          </div>
          {hasAnyValue && (
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {fieldConfig.map(({ key, label, placeholder }) => {
          const field = fields[key];
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                <div className="flex items-center gap-2">
                  {field.error && (
                    <span className="text-xs text-red-500">{field.error}</span>
                  )}
                  {field.value && (
                    <button
                      onClick={() => handleCopy(key)}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title={`Copy ${label}`}
                    >
                      {copiedField === key ? (
                        <HiCheck className="w-3 h-3 text-green-500" />
                      ) : (
                        <HiClipboardCopy className="w-3 h-3" />
                      )}
                      Copy
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={field.value}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border font-mono text-sm transition-colors ${field.error
                  ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  }`}
              />
            </div>
          );
        })}

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Total Bytes
          </label>
          <div className="w-full px-4 py-3 rounded-lg border font-mono text-sm border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-white cursor-default">
            {totalBytes} {totalBytes === 1 ? "byte" : "bytes"}
          </div>
        </div>
      </div>
    </div>
  );
}
