import { HiSun, HiMoon, HiMenu, HiX } from "react-icons/hi";
import { useTheme } from "../contexts/ThemeContext";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Navbar({ sidebarOpen, setSidebarOpen }: NavbarProps): React.ReactElement {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="D2d Logo" className="w-9 h-9 object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                D2d
              </span>
              <span className="text-xs uppercase tracking-widest text-gray-800 dark:text-white">
                Data Conversion Toolkit
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <HiMoon className="w-5 h-5" /> : <HiSun className="w-5 h-5" />}
        </button>
      </div>
    </nav>
  );
}
