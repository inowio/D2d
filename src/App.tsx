import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { Update } from "@tauri-apps/plugin-updater";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import UpdateDialog from "./components/UpdateDialog";
import Home from "./pages/Home";
import Converter from "./pages/Converter";
import AllInOne from "./pages/AllInOne";
import About from "./pages/About";
import { checkForUpdate, installAndRelaunch } from "./utils/updater";
import { isDesktop } from "./utils/platform";
import "./App.css";

interface UpdatePrompt {
  version: string;
  currentVersion: string;
  notes: string | null;
  update: Update;
}

function App(): React.ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updatePrompt, setUpdatePrompt] = useState<UpdatePrompt | null>(null);
  const checkedOnceRef = useRef(false);

  // Silent startup update check, desktop only and once per process. Mobile
  // builds update through their app stores, and the updater plugin is not
  // available in the browser dev server — failures are swallowed here; the
  // manual "Check for updates" button on the About page surfaces errors.
  useEffect(() => {
    if (checkedOnceRef.current || !isDesktop()) return;
    checkedOnceRef.current = true;

    let cancelled = false;
    void (async () => {
      const result = await checkForUpdate();
      if (cancelled || result.status !== "available") return;
      setUpdatePrompt({
        version: result.version,
        currentVersion: result.currentVersion,
        notes: result.notes,
        update: result.update,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent): void => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        event.preventDefault();
        return;
      }

      const explicitOptIn = target.closest("[data-allow-context-menu='true']");
      if (explicitOptIn) {
        return;
      }

      const textInput = target.closest("textarea, input, [contenteditable='true']") as
        | HTMLTextAreaElement
        | HTMLInputElement
        | HTMLElement
        | null;

      if (textInput instanceof HTMLTextAreaElement || textInput instanceof HTMLInputElement) {
        if (textInput.readOnly || textInput.disabled) {
          event.preventDefault();
          return;
        }
        return;
      }

      if (textInput) {
        return;
      }

      event.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className="flex-1 lg:ml-0 min-h-[calc(100vh-3.5rem)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/multi-format" element={<AllInOne />} />
              <Route path="/convert/:id" element={<Converter />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </div>
      {updatePrompt && (
        <UpdateDialog
          open
          version={updatePrompt.version}
          currentVersion={updatePrompt.currentVersion}
          notes={updatePrompt.notes}
          install={(onProgress) => installAndRelaunch(updatePrompt.update, onProgress)}
          onClose={() => setUpdatePrompt(null)}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
