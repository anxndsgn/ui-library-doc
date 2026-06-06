import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import {
  applyTheme,
  getAppliedTheme,
  getSystemTheme,
  readStoredTheme,
  type ResolvedTheme,
  uiStorageKey,
} from "./theme";

export const defaultPackageManager = "pnpm";
export const legacyPackageManagerStorageKey = "docs-package-manager";

type UiStore = {
  theme: ResolvedTheme | null;
  resolvedTheme: ResolvedTheme;
  packageManager: string;
  isDocsSidebarOpen: boolean;
  setTheme: (theme: ResolvedTheme) => void;
  setResolvedTheme: (theme: ResolvedTheme) => void;
  setPackageManager: (packageManager: string) => void;
  setDocsSidebarOpen: (isOpen: boolean) => void;
  openDocsSidebar: () => void;
  closeDocsSidebar: () => void;
};

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function getStorage() {
  return typeof window === "undefined" ? noopStorage : window.localStorage;
}

function getInitialResolvedTheme(): ResolvedTheme {
  return getAppliedTheme() ?? readStoredTheme() ?? getSystemTheme();
}

function getInitialPackageManager() {
  if (typeof window === "undefined") return defaultPackageManager;

  try {
    return window.localStorage.getItem(legacyPackageManagerStorageKey) ?? defaultPackageManager;
  } catch {
    return defaultPackageManager;
  }
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      theme: null,
      resolvedTheme: getInitialResolvedTheme(),
      packageManager: getInitialPackageManager(),
      isDocsSidebarOpen: false,
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme, resolvedTheme: theme });
      },
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
      setPackageManager: (packageManager) => set({ packageManager }),
      setDocsSidebarOpen: (isDocsSidebarOpen) => set({ isDocsSidebarOpen }),
      openDocsSidebar: () => set({ isDocsSidebarOpen: true }),
      closeDocsSidebar: () => set({ isDocsSidebarOpen: false }),
    }),
    {
      name: uiStorageKey,
      storage: createJSONStorage(getStorage),
      partialize: ({ theme, packageManager }) => ({ theme, packageManager }),
    },
  ),
);
