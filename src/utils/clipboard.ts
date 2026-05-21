import { writeText } from "@tauri-apps/plugin-clipboard-manager";

/**
 * Fallback copy using legacy execCommand for HTTP/non-secure contexts.
 */
function fallbackCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch {
    document.body.removeChild(textarea);
    return false;
  }
}

/**
 * Copy text to clipboard using Tauri native API with web API fallback.
 * This ensures clipboard works on all platforms including mobile.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // Try Tauri native clipboard first (works on mobile/desktop apps)
  try {
    await writeText(text);
    return true;
  } catch {
    // Not in Tauri context, continue to web fallbacks
  }

  // Try modern clipboard API (requires HTTPS on mobile)
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API failed, use execCommand fallback
  }

  // Final fallback: execCommand (works over HTTP)
  return fallbackCopy(text);
}
