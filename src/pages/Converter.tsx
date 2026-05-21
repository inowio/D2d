import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiArrowLeft, HiClipboardCopy, HiCheck, HiExclamationCircle, HiX } from "react-icons/hi";
import { IoSwapVertical } from "react-icons/io5";
import { conversionOptions, convert } from "../utils/conversions";
import { conversionExplanations, ConversionExplanation } from "../utils/conversionExplanations";
import { copyToClipboard } from "../utils/clipboard";

const getPrecisionBits = (precision: "single" | "double"): number => (precision === "single" ? 32 : 64);

const parseIeeeResult = (result: string): { hex: string; binary: string } => {
  const hexMatch = result.match(/Hex:\s*([0-9A-F]+)/i);
  const binaryMatch = result.match(/Binary:\s*([01]+)/i);
  return {
    hex: hexMatch ? hexMatch[1].toUpperCase() : "",
    binary: binaryMatch ? binaryMatch[1] : "",
  };
};

const hexToBinaryString = (hex: string, precision: "single" | "double"): string => {
  if (!hex) return "";
  const bits = getPrecisionBits(precision);
  const normalized = hex.replace(/\s/g, "").replace(/^0x/i, "").toUpperCase();
  if (!/^[0-9A-F]*$/.test(normalized)) return "";
  const paddedHex = normalized.padStart(bits / 4, "0").slice(-bits / 4);
  return paddedHex
    .split("")
    .map((char) => parseInt(char, 16).toString(2).padStart(4, "0"))
    .join("");
};

const binaryToHexString = (binary: string, precision: "single" | "double"): string => {
  if (!binary) return "";
  const bits = getPrecisionBits(precision);
  const normalized = binary.replace(/\s/g, "").replace(/[^01]/g, "");
  if (!normalized) return "";
  const padded = normalized.padStart(bits, "0").slice(-bits);
  const hex = BigInt("0b" + padded).toString(16).toUpperCase();
  return hex.padStart(bits / 4, "0");
};

const advancedSwapPairs: Record<string, string> = {
  "signed-to-unsigned": "unsigned-to-signed",
  "unsigned-to-signed": "signed-to-unsigned",
  "base-n-to-decimal": "decimal-to-base-n",
  "decimal-to-base-n": "base-n-to-decimal",
  "float-to-ieee754": "ieee754-to-float",
  "ieee754-to-float": "float-to-ieee754",
};

export default function Converter(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [inputCopied, setInputCopied] = useState(false);
  const [advancedBits, setAdvancedBits] = useState<8 | 16 | 32 | 64>(32);
  const [advancedBase, setAdvancedBase] = useState(16);
  const [advancedPrecision, setAdvancedPrecision] = useState<"single" | "double">("single");
  const swapOutputRef = useRef<string | null>(null);
  const swapAdvancedConfigRef = useRef<{ bits?: 8 | 16 | 32 | 64; base?: number; precision?: "single" | "double" } | null>(null);
  const swapIeeeFieldsRef = useRef<{ hex?: string; binary?: string } | null>(null);
  const [ieeeHexInput, setIeeeHexInput] = useState("");
  const [ieeeBinaryInput, setIeeeBinaryInput] = useState("");
  const [ieeeHexOutput, setIeeeHexOutput] = useState("");
  const [ieeeBinaryOutput, setIeeeBinaryOutput] = useState("");

  const option = conversionOptions.find((opt) => opt.id === id);

  useEffect(() => {
    if (!option) {
      navigate("/");
      return;
    }
    window.scrollTo(0, 0);
    if (swapOutputRef.current) {
      setInput(swapOutputRef.current);
      swapOutputRef.current = null;
    } else {
      setInput("");
    }
    setOutput("");
    setError("");

    if (swapAdvancedConfigRef.current) {
      const { bits, base, precision } = swapAdvancedConfigRef.current;
      setAdvancedBits(bits ?? 32);
      setAdvancedBase(base ?? 16);
      setAdvancedPrecision(precision ?? "single");
      swapAdvancedConfigRef.current = null;
    } else {
      setAdvancedBits(32);
      setAdvancedBase(16);
      setAdvancedPrecision("single");
    }

    if (swapIeeeFieldsRef.current && option?.id === "ieee754-to-float") {
      const { hex, binary } = swapIeeeFieldsRef.current;
      const cleanHex = hex ?? "";
      setIeeeHexInput(cleanHex);
      setIeeeBinaryInput(binary ?? (cleanHex ? hexToBinaryString(cleanHex, advancedPrecision) : ""));
      setInput(cleanHex);
    } else {
      setIeeeHexInput("");
      setIeeeBinaryInput("");
      if (option?.id === "ieee754-to-float") {
        setInput("");
      }
    }
    setIeeeHexOutput("");
    setIeeeBinaryOutput("");
    swapIeeeFieldsRef.current = null;
  }, [id, option, navigate, advancedPrecision]);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      setIeeeHexOutput("");
      setIeeeBinaryOutput("");
      return;
    }

    try {
      let result: string;
      const advancedConfig = option?.from === "advanced-numeric"
        ? { bits: advancedBits, base: advancedBase, precision: advancedPrecision }
        : undefined;
      result = convert(input, option?.from || "", option?.to || "", advancedConfig);
      setOutput(result);
      setError("");
      if (option?.id === "float-to-ieee754") {
        const { hex, binary } = parseIeeeResult(result);
        setIeeeHexOutput(hex);
        setIeeeBinaryOutput(binary || hexToBinaryString(hex, advancedPrecision));
      } else {
        setIeeeHexOutput("");
        setIeeeBinaryOutput("");
      }
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Conversion error");
      if (option?.id === "float-to-ieee754") {
        setIeeeHexOutput("");
        setIeeeBinaryOutput("");
      }
    }
  }, [input, option, advancedBits, advancedBase, advancedPrecision]);

  const handleCopy = async (value?: string): Promise<void> => {
    const target = value ?? output;
    if (!target) return;
    const success = await copyToClipboard(target);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setError("Failed to copy to clipboard");
    }
  };

  const handleCopyInput = async (): Promise<void> => {
    if (!input) return;
    const success = await copyToClipboard(input);
    if (success) {
      setInputCopied(true);
      setTimeout(() => setInputCopied(false), 2000);
    } else {
      setError("Failed to copy to clipboard");
    }
  };

  const handleClear = (): void => {
    setInput("");
    setOutput("");
    setError("");
    setIeeeHexInput("");
    setIeeeBinaryInput("");
    setIeeeHexOutput("");
    setIeeeBinaryOutput("");
  };

  const handleIeeeHexChange = (value: string): void => {
    const sanitized = value.replace(/[^0-9a-fA-F\s]/g, "").toUpperCase();
    setIeeeHexInput(sanitized);
    setIeeeBinaryInput(hexToBinaryString(sanitized, advancedPrecision));
    setInput(sanitized);
  };

  const handleIeeeBinaryChange = (value: string): void => {
    const sanitized = value.replace(/[^01\s]/g, "");
    setIeeeBinaryInput(sanitized);
    const hex = binaryToHexString(sanitized, advancedPrecision);
    setIeeeHexInput(hex);
    setInput(hex);
  };

  const reverseOptionId = useMemo(() => {
    if (!option) return null;

    const directReverse = conversionOptions.find(
      (opt) => opt.from === option.to && opt.to === option.from
    );
    if (directReverse) {
      return directReverse.id;
    }

    if (option.from === "advanced-numeric") {
      return advancedSwapPairs[option.id] ?? null;
    }

    return null;
  }, [option]);

  const handleSwap = (): void => {
    if (!option || !reverseOptionId) return;
    swapOutputRef.current = output;
    if (option?.id === "float-to-ieee754") {
      swapIeeeFieldsRef.current = {
        hex: ieeeHexOutput,
        binary: ieeeBinaryOutput,
      };
    } else if (option?.id === "ieee754-to-float") {
      swapIeeeFieldsRef.current = {
        hex: ieeeHexInput,
        binary: ieeeBinaryInput,
      };
    } else {
      swapIeeeFieldsRef.current = null;
    }
    if (option?.from === "advanced-numeric") {
      swapAdvancedConfigRef.current = {
        bits: advancedBits,
        base: advancedBase,
        precision: advancedPrecision,
      };
    } else {
      swapAdvancedConfigRef.current = null;
    }
    navigate(`/convert/${reverseOptionId}`, { replace: true });
  };

  const explanation = conversionExplanations[id || ""] as ConversionExplanation | undefined;

  const canSwap = Boolean(reverseOptionId);

  const isAdvancedNumeric = option?.from === "advanced-numeric";
  const needsBitSelection = option?.id === "signed-to-unsigned" || option?.id === "unsigned-to-signed";
  const needsBaseSelection = option?.id === "base-n-to-decimal" || option?.id === "decimal-to-base-n";
  const needsPrecisionSelection = option?.id === "float-to-ieee754" || option?.id === "ieee754-to-float";

  const handleBaseInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const parsed = Number(event.target.value);
    if (Number.isNaN(parsed)) {
      setAdvancedBase(2);
      return;
    }
    const clamped = Math.min(36, Math.max(2, Math.round(parsed)));
    setAdvancedBase(clamped);
  };

  const fallbackExample = useMemo(() => {
    if (!option) return null;

    const defaultSamplesByFrom: Record<string, string> = {
      binary: "10101010",
      hex: "AA",
      decimal: "170",
      octal: "252",
      ascii: "Hi",
    };

    const sampleOverrides: Record<string, string> = {
      "binary-to-hex": "1101100",
      "hex-to-binary": "6C",
      "hex-to-decimal": "6C",
      "decimal-to-hex": "108",
      "decimal-to-binary": "108",
      "binary-to-decimal": "1101100",
      "ascii-to-hex": "Hi",
      "hex-to-ascii": "48 69",
      "binary-to-ascii": "01001000 01101001",
      "ascii-to-binary": "Hi",
      "octal-to-binary": "154",
      "binary-to-octal": "1101100",
      "octal-to-decimal": "154",
      "decimal-to-octal": "108",
      "octal-to-hex": "154",
      "hex-to-octal": "6C",
    };

    const sampleInput = sampleOverrides[option.id] ?? defaultSamplesByFrom[option.from] ?? "";
    if (!sampleInput) return null;

    try {
      const sampleOutput = convert(sampleInput, option.from, option.to);
      return { input: sampleInput, output: sampleOutput };
    } catch {
      return null;
    }
  }, [option]);

  if (!option) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 mb-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <HiExclamationCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Conversion Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            The conversion type you're looking for doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <HiArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const formatLabel = (value: string): string =>
    value
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const getInputLabel = (): string => {
    if (!option) return "Input";
    if (option.from === "advanced-numeric") {
      const advancedLabels: Record<string, string> = {
        "signed-to-unsigned": "Signed",
        "unsigned-to-signed": "Unsigned",
        "base-n-to-decimal": "Base-N",
        "decimal-to-base-n": "Decimal",
        "float-to-ieee754": "Float",
        "ieee754-to-float": "IEEE 754",
      };
      return advancedLabels[option.id] ?? "Number Systems";
    }
    return formatLabel(option.from);
  };

  const getPlaceholder = (): string => {
    switch (option.from) {
      case "binary":
        return "Enter binary (e.g., 101010)";
      case "hex":
        return "Enter hex (e.g., 1A3F)";
      case "decimal":
        return "Enter decimal number";
      case "gray":
        return "Enter Gray code (e.g., 1011)";
      case "bcd":
        return "Enter BCD groups (e.g., 0001 1000)";
      case "ascii":
        return "Enter ASCII text";
      case "octal":
        return "Enter octal (e.g., 377)";
      case "advanced-numeric":
        return option.id.includes("ieee754") || option.id.includes("float") 
          ? "Enter float (e.g., 3.14159)"
          : "Enter number";
      default:
        return "Enter value...";
    }
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {option.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{option.description}</p>
      </div>


      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
          <HiExclamationCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {copied && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
          <HiCheck className="w-5 h-5" />
          <span>Copied to clipboard!</span>
        </div>
      )}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              Input ({getInputLabel()})
            </label>
            <div className="flex items-center gap-2">
              {input && (
                <button
                  onClick={handleCopyInput}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Copy input"
                >
                  {inputCopied ? (
                    <HiCheck className="w-3 h-3 text-green-500" />
                  ) : (
                    <HiClipboardCopy className="w-3 h-3" />
                  )}
                  Copy
                </button>
              )}
              {(input || output) && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Clear all"
                >
                  <HiX className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>
          {option?.id === "ieee754-to-float" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Hex</label>
                <textarea
                  value={ieeeHexInput}
                  onChange={(e) => handleIeeeHexChange(e.target.value)}
                  placeholder="Enter hex (e.g., 40A33333)"
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-mono"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Binary</label>
                <textarea
                  value={ieeeBinaryInput}
                  onChange={(e) => handleIeeeBinaryChange(e.target.value)}
                  placeholder="Enter binary"
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-mono"
                />
              </div>
            </div>
          ) : (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={getPlaceholder()}
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-mono"
            />
          )}
          {isAdvancedNumeric && (
            <div className="mt-3 grid gap-3 md:grid-cols-1">
              {needsBitSelection && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Bit Width</label>
                  <select
                    value={advancedBits}
                    onChange={(e) => setAdvancedBits(Number(e.target.value) as 8 | 16 | 32 | 64)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    {[8, 16, 32, 64].map((bits) => (
                      <option key={bits} value={bits}>{bits}-bit</option>
                    ))}
                  </select>
                </div>
              )}
              {needsBaseSelection && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Base (2-36)</label>
                  <input
                    type="number"
                    min={2}
                    max={36}
                    step={1}
                    value={advancedBase}
                    onChange={handleBaseInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>
              )}
              {needsPrecisionSelection && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Precision</label>
                  <select
                    value={advancedPrecision}
                    onChange={(e) => setAdvancedPrecision(e.target.value as "single" | "double")}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="single">32-bit (Single)</option>
                    <option value="double">64-bit (Double)</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {canSwap && (
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="px-4 py-1 inline-flex items-center gap-2 rounded-full transition-colors bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer"
              title="Swap conversion direction"
            >
              <IoSwapVertical className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Swap
            </button>
          </div>
        )}

        <div>
          {option?.id === "float-to-ieee754" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hex</label>
                <textarea
                  value={ieeeHexOutput}
                  readOnly
                  placeholder="Hex result"
                  rows={6}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none font-mono"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Binary</label>
                <textarea
                  value={ieeeBinaryOutput}
                  readOnly
                  placeholder="Binary result"
                  rows={6}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                Output ({option.to})
              </label>
              <textarea
                value={output}
                readOnly
                placeholder="Result will appear here..."
                rows={6}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none font-mono"
              />
              {output && (
                <button
                  onClick={() => handleCopy()}
                  className="absolute right-3 top-3 p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <HiCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <HiClipboardCopy className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {explanation ? (
        <div className="mt-8 space-y-6">
          <div className="p-6 rounded-lg bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900/30">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">?</span>
              How to Convert {explanation.from} to {explanation.to}
            </h3>

            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">{explanation.from} (Base-{explanation.fromBase})</h4>
                  <p className="mb-2">Digits: <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">{explanation.fromDigits}</code></p>
                </div>
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <h4 className="font-semibold text-indigo-700 dark:text-indigo-400 mb-2">{explanation.to} (Base-{explanation.toBase})</h4>
                  <p className="mb-2">Digits: <code className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 rounded">{explanation.toDigits}</code></p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/70 dark:bg-gray-800/70">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Conversion Method</h4>
                <p className="mb-3">{explanation.explanation}</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  {explanation.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              {explanation.table && (
                <div className="p-4 rounded-lg bg-white/70 dark:bg-gray-800/70 overflow-x-auto">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{explanation.from} to {explanation.to} Table</h4>
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="py-2 px-3 text-blue-700 dark:text-blue-400">{explanation.from}</th>
                        <th className="py-2 px-3 text-indigo-700 dark:text-indigo-400">{explanation.to}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {explanation.table.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1 px-3 font-mono">{row.from}</td>
                          <td className="py-1 px-3 font-mono font-semibold">{row.to}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
                <h4 className="font-semibold text-green-800 dark:text-green-400 mb-3">Example: Convert {explanation.example.input} from {explanation.from} to {explanation.to}</h4>
                <div className="space-y-2 font-mono text-sm">
                  {explanation.example.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold">{i + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                  <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/40 rounded text-green-900 dark:text-green-300 font-bold">
                    Result: {explanation.example.input} = {explanation.example.output}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        fallbackExample && (
          <div className="mt-8 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Example</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium capitalize">{option.from}:</span>{" "}
                <span className="font-mono">{fallbackExample.input}</span>
              </p>
              <p>
                <span className="font-medium capitalize">{option.to}:</span>{" "}
                <span className="font-mono">{fallbackExample.output}</span>
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
