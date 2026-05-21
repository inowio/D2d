import { useState } from "react";
import { HiX, HiDownload, HiRefresh } from "react-icons/hi";

import type { ProgressHandler } from "../utils/updater";

interface UpdateDialogProps {
  open: boolean;
  version: string;
  currentVersion: string;
  notes: string | null;
  install: (onProgress: ProgressHandler) => Promise<void>;
  onClose: () => void;
}

type Phase =
  | { kind: "idle" }
  | { kind: "downloading"; downloaded: number; total: number | null }
  | { kind: "error"; message: string };

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function UpdateDialog({
  open,
  version,
  currentVersion,
  notes,
  install,
  onClose,
}: UpdateDialogProps): React.ReactElement | null {
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  if (!open) return null;

  const busy = phase.kind === "downloading";

  const requestClose = (): void => {
    if (busy) return;
    setPhase({ kind: "idle" });
    onClose();
  };

  const handleInstall = async (): Promise<void> => {
    setPhase({ kind: "downloading", downloaded: 0, total: null });
    try {
      await install((downloaded, total) => {
        setPhase({ kind: "downloading", downloaded, total });
      });
      // On success the app relaunches, so this state is rarely visible.
    } catch (e) {
      setPhase({
        kind: "error",
        message: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const progressPercent =
    phase.kind === "downloading" && phase.total
      ? Math.min(100, Math.round((phase.downloaded / phase.total) * 100))
      : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Update available"
        className="w-full max-w-xl rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-2xl"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-blue-700 dark:text-blue-300">
              Update available
            </h2>
            <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
              Version {version} is available. You have {currentVersion}.
            </p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            disabled={busy}
            aria-label="Close"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {phase.kind === "error" && (
          <div className="mb-3 rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-400">
            Update failed: {phase.message}
          </div>
        )}

        <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/60 p-3 text-sm text-gray-700 dark:text-gray-300">
          {notes ? (
            <pre className="whitespace-pre-wrap font-sans">{notes}</pre>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              No release notes provided.
            </span>
          )}
        </div>

        {phase.kind === "downloading" && (
          <div className="mt-3" aria-live="polite">
            <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
              <span className="inline-flex items-center gap-2">
                <HiRefresh className="w-3.5 h-3.5 animate-spin" />
                Downloading…
              </span>
              <span className="font-mono">
                {formatBytes(phase.downloaded)}
                {phase.total ? ` / ${formatBytes(phase.total)}` : ""}
                {progressPercent !== null ? ` (${progressPercent}%)` : ""}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: progressPercent !== null ? `${progressPercent}%` : "30%" }}
              />
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={requestClose}
            disabled={busy}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Later
          </button>
          <button
            type="button"
            onClick={handleInstall}
            disabled={busy}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiDownload className="w-4 h-4" />
            {phase.kind === "error" ? "Retry" : "Install & Restart"}
          </button>
        </div>
      </div>
    </div>
  );
}
