import { describe, expect, it, vi } from "vite-plus/test";
import { createResilientStorage } from "@/lib/resilientStorage";

const createStorage = () => {
  const entries = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => entries.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      entries.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      entries.delete(key);
    }),
  };
};

describe("awarie przechowywania postępu", () => {
  it("odczytuje i zapisuje dane w dostępnym localStorage", () => {
    const disk = createStorage();
    disk.setItem("progress", "saved");
    const { storage, getSnapshot } = createResilientStorage(() => disk);
    expect(storage.getItem("progress")).toBe("saved");
    storage.setItem("progress", "new");
    expect(disk.getItem("progress")).toBe("new");
    storage.removeItem("progress");
    expect(disk.getItem("progress")).toBeNull();
    expect(getSnapshot()).toBe(true);
  });

  it("po przekroczeniu limitu pamięci zachowuje nowszy postęp i powiadamia interfejs", () => {
    const disk = createStorage();
    disk.setItem("progress", "old");
    const { storage, getSnapshot, subscribe } = createResilientStorage(() => disk);
    const notify = vi.fn();
    const unsubscribe = subscribe(notify);
    disk.setItem.mockImplementationOnce(() => {
      throw new DOMException("Full", "QuotaExceededError");
    });
    expect(() => storage.setItem("progress", "new")).not.toThrow();
    expect(storage.getItem("progress")).toBe("new");
    expect(disk.getItem("progress")).toBe("old");
    expect(getSnapshot()).toBe(false);
    expect(notify).toHaveBeenCalledTimes(1);
    storage.setItem("progress", "newest");
    expect(storage.getItem("progress")).toBe("newest");
    expect(notify).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it("po błędzie odczytu zachowuje ostatnie odczytane dane w sesji", () => {
    const disk = createStorage();
    disk.setItem("progress", "saved");
    const { storage } = createResilientStorage(() => disk);
    expect(storage.getItem("progress")).toBe("saved");
    disk.getItem.mockImplementationOnce(() => {
      throw new Error("Blocked");
    });
    expect(storage.getItem("progress")).toBe("saved");
  });

  it("obsługuje zablokowany dostęp do samego localStorage", () => {
    const { storage, getSnapshot } = createResilientStorage(() => {
      throw new DOMException("Blocked", "SecurityError");
    });
    expect(storage.getItem("progress")).toBeNull();
    storage.setItem("progress", "session");
    expect(storage.getItem("progress")).toBe("session");
    expect(getSnapshot()).toBe(false);
  });

  it("usunięcie przy zablokowanym zapisie nie przywraca starego postępu", () => {
    const disk = createStorage();
    disk.setItem("progress", "old");
    const { storage } = createResilientStorage(() => disk);
    expect(storage.getItem("progress")).toBe("old");
    disk.removeItem.mockImplementationOnce(() => {
      throw new Error("Blocked");
    });
    expect(() => storage.removeItem("progress")).not.toThrow();
    expect(storage.getItem("progress")).toBeNull();
  });
});
