"use client";

import { useEffect, useSyncExternalStore } from "react";
import { instituteOptions, Institute, SELECTED_INSTITUTE_KEY } from "@/lib/institute";

function saveInstituteSelection(institute: Institute) {
  sessionStorage.setItem(SELECTED_INSTITUTE_KEY, institute);
  document.cookie = `${SELECTED_INSTITUTE_KEY}=${institute}; path=/; max-age=2592000; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent("selectedInstituteChanged", { detail: institute }));
}

function getSelectedInstituteSnapshot(): Institute | null {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(SELECTED_INSTITUTE_KEY);
  return stored && instituteOptions.includes(stored as Institute) ? (stored as Institute) : null;
}

function subscribeToInstituteChanges(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("selectedInstituteChanged", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("selectedInstituteChanged", handler);
  };
}

export default function InstituteGate() {
  const selectedInstitute = useSyncExternalStore(
    subscribeToInstituteChanges,
    getSelectedInstituteSnapshot,
    () => null
  );

  useEffect(() => {
    if (selectedInstitute) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedInstitute]);

  if (selectedInstitute) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-8">
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-maroon-600 mb-3">
          Access Required
        </p>
        <h2 className="text-3xl font-black text-slate-900 mb-3">Select Your Institute</h2>
        <p className="text-sm text-slate-500 mb-6">
          You must choose one option to continue. Registration rules will follow this selection.
        </p>

        <div className="space-y-3">
          {instituteOptions.map((institute) => (
            <button
              key={institute}
              type="button"
              onClick={() => saveInstituteSelection(institute)}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-left font-bold text-slate-800 hover:border-maroon-400 hover:bg-maroon-50/60 transition-colors"
            >
              I am student from {institute}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
