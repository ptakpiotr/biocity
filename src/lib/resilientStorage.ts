import type { StateStorage } from "zustand/middleware";

// After a storage failure, keep using memory so an older disk value cannot
// overwrite progress made during this session.
export const createResilientStorage = (
  getStorage: () => Pick<Storage, "getItem" | "setItem" | "removeItem">,
) => {
  const memory = new Map<string, string>();
  const listeners = new Set<() => void>();
  let persistent = true;
  const fail = () => {
    if (!persistent) return;
    persistent = false;
    listeners.forEach((listener) => listener());
  };

  const storage: StateStorage = {
    getItem(key) {
      if (persistent) {
        try {
          const value = getStorage().getItem(key);
          if (value === null) memory.delete(key);
          else memory.set(key, value);
          return value;
        } catch {
          fail();
        }
      }
      return memory.get(key) ?? null;
    },
    setItem(key, value) {
      memory.set(key, value);
      if (persistent) {
        try {
          getStorage().setItem(key, value);
        } catch {
          fail();
        }
      }
    },
    removeItem(key) {
      memory.delete(key);
      if (persistent) {
        try {
          getStorage().removeItem(key);
        } catch {
          fail();
        }
      }
    },
  };

  return {
    storage,
    getSnapshot: () => persistent,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};
