import { platform } from "@tauri-apps/plugin-os";

let cached: boolean | null = null;

/**
 * True on desktop platforms (Windows, macOS, Linux).
 *
 * The auto-updater only runs on desktop — Android and iOS receive updates
 * through their app stores. Outside a Tauri runtime (browser dev server or
 * the test runner) this resolves to `true` so the updater UI stays visible
 * during development; the actual update check fails harmlessly there.
 */
export function isDesktop(): boolean {
  if (cached !== null) return cached;
  try {
    const current = platform();
    cached = current === "windows" || current === "macos" || current === "linux";
  } catch {
    cached = true;
  }
  return cached;
}
