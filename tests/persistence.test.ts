import { describe, expect, it } from "vite-plus/test";
import { sanitizeProgress, sanitizeTeam } from "@/lib/progressPersistence";

describe("drużyna", () => {
  it.each(["rocket", "cat", "flame", "turtle"])("zapisuje nazwę i dozwoloną ikonę %s", (icon) => {
    expect(sanitizeTeam({ name: "  Tropiciele Komórek  ", icon })).toEqual({
      name: "Tropiciele Komórek",
      icon,
    });
  });

  it("przyjmuje maksymalnie 32 znaki nazwy po usunięciu skrajnych spacji", () => {
    expect(sanitizeTeam({ name: ` ${"A".repeat(32)} `, icon: "cat" })?.name).toHaveLength(32);
    expect(sanitizeTeam({ name: "A".repeat(33), icon: "cat" })).toBeNull();
  });

  it.each([
    null,
    false,
    "Drużyna",
    {},
    { name: " ", icon: "cat" },
    { name: 123, icon: "cat" },
    { name: "Badacze", icon: "unknown" },
    { name: "Badacze" },
  ])("odrzuca niepełny lub uszkodzony profil: %j", (value) => {
    expect(sanitizeTeam(value)).toBeNull();
  });
});

describe("odtwarzanie zapisu gry", () => {
  it("starszy zapis bez drużyny zachowuje zaliczenia", () => {
    const restored = sanitizeProgress({
      solved: { plant: ["gate"] },
      review: ["plant:gate"],
      lastPath: "/miasto/plant",
    });
    expect(restored).toEqual({
      team: null,
      solved: { plant: ["gate"], animal: [], bacteria: [] },
      review: ["plant:gate"],
      lastPath: "/miasto/plant",
    });
  });

  it("uszkodzona drużyna nie usuwa prawidłowych odpowiedzi ani trasy", () => {
    const restored = sanitizeProgress({
      team: { name: "", icon: "cat" },
      solved: { animal: ["power"] },
      review: ["animal:power"],
      lastPath: "/powtorka",
    });
    expect(restored.team).toBeNull();
    expect(restored.solved.animal).toEqual(["power"]);
    expect(restored.review).toEqual(["animal:power"]);
    expect(restored.lastPath).toBe("/powtorka");
  });

  it("pomija nieprawidłowe typy i duplikaty bez usuwania prawidłowych wpisów", () => {
    const restored = sanitizeProgress({
      solved: { plant: ["gate", null, "gate", 7, "power", ""], animal: "gate", bacteria: null },
      review: ["plant:gate", false, "plant:gate", "animal:gate"],
    });
    expect(restored.solved).toEqual({ plant: ["gate", "power"], animal: [], bacteria: [] });
    expect(restored.review).toEqual(["plant:gate", "animal:gate"]);
  });

  it.each([null, undefined, 17, "tekst", [], { solved: null, review: {}, team: 1 }])(
    "bezpiecznie rozpoczyna grę dla uszkodzonego zapisu: %j",
    (value) => {
      expect(sanitizeProgress(value)).toEqual({
        team: null,
        solved: { plant: [], animal: [], bacteria: [] },
        review: [],
        lastPath: "/",
      });
    },
  );

  it.each(["/", "/miasto/plant", "/miasto/animal", "/miasto/bacteria", "/powtorka"])(
    "przywraca dozwoloną trasę %s",
    (lastPath) => {
      expect(sanitizeProgress({ lastPath }).lastPath).toBe(lastPath);
    },
  );

  it.each([
    "/edytor",
    "/miasto/unknown",
    "//example.com",
    "https://example.com",
    "/powtorka?next=1",
  ])("zastępuje niedozwoloną trasę %s stroną główną", (lastPath) => {
    expect(sanitizeProgress({ lastPath }).lastPath).toBe("/");
  });
});
