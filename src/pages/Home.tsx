import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch, HiArrowRight, HiX, HiArrowsExpand } from "react-icons/hi";
import { conversionOptions } from "../utils/conversions";

const groupOrder = ["ascii", "hex", "decimal", "binary", "octal", "gray", "bcd", "advanced-numeric"];

const groupLabels: Record<string, string> = {
  ascii: "ASCII",
  hex: "Hexadecimal",
  decimal: "Decimal",
  binary: "Binary",
  octal: "Octal",
  gray: "Gray Code",
  bcd: "BCD",
  "advanced-numeric": "Number Systems",
};

export default function Home(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredGroups = useMemo(() => {
    const filtered = conversionOptions.filter(
      (option) =>
        option.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, typeof conversionOptions> = {};
    filtered.forEach((option) => {
      if (!groups[option.from]) {
        groups[option.from] = [];
      }
      groups[option.from].push(option);
    });

    return groups;
  }, [searchQuery]);

  const hasResults = Object.keys(filteredGroups).length > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 mx-auto animate-in fade-in duration-700">
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-2 hidden sm:block">
          <span className="text-blue-700 dark:text-blue-300">D2d</span>
          <span className="text-xs uppercase tracking-widest ml-2">Data Conversion Toolkit</span>
        </h1>
        <p className="text-lg md:text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Convert between various data formats easily.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Clear search"
            >
              <HiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => navigate("/multi-format")}
          className="w-full p-4 cursor-pointer rounded-lg border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500 dark:bg-blue-400 text-white">
                <HiArrowsExpand className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">
                  Multi-Format Converter
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Convert between all formats at once
                </p>
              </div>
            </div>
            <HiArrowRight className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
        </button>
      </div>

      {hasResults ? (
        <div className="space-y-8">
          {groupOrder.map(
            (groupKey) =>
              filteredGroups[groupKey] && (
                <section key={groupKey}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 capitalize">
                    {groupLabels[groupKey] || groupKey}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredGroups[groupKey].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => navigate(`/convert/${option.id}`)}
                        className="group p-4 cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {option.title}
                          </h3>
                          <HiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs">
                          <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 capitalize">
                            {option.to}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No conversions found matching "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
