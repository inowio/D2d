import { useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HiHome,
  HiChip,
  HiHashtag,
  HiCode,
  HiDocumentText,
  HiChevronDown,
  HiChevronRight,
  HiArrowsExpand,
  HiInformationCircle,
  HiCalculator,
} from "react-icons/hi";
import { conversionOptions } from "../utils/conversions";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const groupOrder = ["ascii", "hex", "decimal", "binary", "octal", "gray", "bcd", "advanced-numeric"];

const groupLabels: Record<string, string> = {
  binary: "Binary",
  gray: "Gray Code",
  hex: "Hexadecimal",
  decimal: "Decimal",
  bcd: "BCD",
  octal: "Octal",
  ascii: "ASCII",
  "advanced-numeric": "Number Systems",
};

const groupIcons: Record<string, React.ReactNode> = {
  binary: <HiChip className="w-5 h-5" />,
  gray: <HiChip className="w-5 h-5" />,
  hex: <HiCode className="w-5 h-5" />,
  decimal: <HiHashtag className="w-5 h-5" />,
  bcd: <HiHashtag className="w-5 h-5" />,
  octal: <HiHashtag className="w-5 h-5" />,
  ascii: <HiDocumentText className="w-5 h-5" />,
  "advanced-numeric": <HiCalculator className="w-5 h-5" />,
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps): React.ReactElement {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    binary: false,
    gray: false,
    hex: false,
    decimal: false,
    bcd: false,
    octal: false,
    ascii: false,
    "advanced-numeric": false,
  });

  const isInConverter = location.pathname.startsWith("/convert/");

  const groupedOptions = useMemo(() => {
    const groups: Record<string, typeof conversionOptions> = {};
    conversionOptions.forEach((option) => {
      if (!groups[option.from]) {
        groups[option.from] = [];
      }
      groups[option.from].push(option);
    });
    return groups;
  }, []);

  const handleLinkClick = (): void => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const toggleGroup = (group: string): void => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const isGroupActive = (groupKey: string): boolean => {
    return groupedOptions[groupKey]?.some(
      (option) => location.pathname === `/convert/${option.id}`
    ) ?? false;
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={`fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-full lg:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-4">
            <NavLink
              to="/"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
              }
            >
              <HiHome className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </NavLink>
          </div>

          <div className="px-4 pb-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Conversions
            </h3>
          </div>

          <nav className="flex-1 px-2 pb-4 space-y-1">
            <NavLink
              to="/multi-format"
              replace={isInConverter}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mt-2 text-sm font-medium ${isActive
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
              }
            >
              <HiArrowsExpand className="w-5 h-5" />
              <span>Multi-Format</span>
            </NavLink>
            {groupOrder.map((groupKey) => {
              const options = groupedOptions[groupKey];
              if (!options || options.length === 0) return null;

              const isExpanded = expandedGroups[groupKey];
              const isActive = isGroupActive(groupKey);

              return (
                <div key={groupKey}>
                  <button
                    onClick={() => toggleGroup(groupKey)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${isActive
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {groupIcons[groupKey]}
                      <span className="text-sm font-medium">{groupLabels[groupKey]}</span>
                    </div>
                    {isExpanded ? (
                      <HiChevronDown className="w-4 h-4" />
                    ) : (
                      <HiChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {options.map((option) => (
                        <NavLink
                          key={option.id}
                          to={`/convert/${option.id}`}
                          replace={isInConverter}
                          onClick={handleLinkClick}
                          className={({ isActive }) =>
                            `flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${isActive
                              ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`
                          }
                        >
                          <span>{option.title}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="px-3 pb-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Information
                </h3>
              </div>
              <NavLink
                to="/about"
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <HiInformationCircle className="w-5 h-5" />
                <span className="font-medium">About</span>
              </NavLink>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
