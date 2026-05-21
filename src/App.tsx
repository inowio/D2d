import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Converter from "./pages/Converter";
import AllInOne from "./pages/AllInOne";
import About from "./pages/About";
import "./App.css";

function App(): React.ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    </BrowserRouter>
  );
}

export default App;
