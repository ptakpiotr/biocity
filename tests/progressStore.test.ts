import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { getCompletedCities } from "@/lib/progress";
import { initialCityPlaces } from "@/data/questions";

const entries = new Map<string, string>();
const storage: Storage = {
  get length() {
    return entries.size;
  },
  clear: () => entries.clear(),
  getItem: (key) => entries.get(key) ?? null,
  key: (index) => [...entries.keys()][index] ?? null,
  removeItem: (key) => {
    entries.delete(key);
  },
  setItem: (key, value) => {
    entries.set(key, value);
  },
};
let useProgress: typeof import("@/store/progressStore").useProgress;
const storageKey = "biocity-progress-v2";

beforeAll(async () => {
  // Zastępujemy wyłącznie nośnik localStorage; akcje i persist Zustand są rzeczywiste.
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("window", { localStorage: storage });
  ({ useProgress } = await import("@/store/progressStore"));
});

beforeEach(() => {
  useProgress.setState(useProgress.getInitialState(), true);
  storage.clear();
});

afterAll(() => vi.unstubAllGlobals());

describe("akcje gry", () => {
  it("ponowne zaliczenie budynku nie zwiększa postępu, a komórki są niezależne", () => {
    useProgress.getState().solve("plant", "gate");
    useProgress.getState().solve("plant", "gate");
    useProgress.getState().solve("animal", "power");
    expect(useProgress.getState().solved).toEqual({ plant: ["gate"], animal: ["power"] });
  });

  it("powtórka zapisuje osobno pytania o ten sam budynek w różnych komórkach", () => {
    useProgress.getState().solveReview("plant:gate");
    useProgress.getState().solveReview("animal:gate");
    useProgress.getState().solveReview("plant:gate");
    expect(useProgress.getState().review).toEqual(["plant:gate", "animal:gate"]);
  });

  it("edycja drużyny zachowuje rozwiązane pytania i miejsce w grze", () => {
    useProgress.getState().setTeam({ name: "Badacze", icon: "rocket" });
    useProgress.getState().solve("plant", "gate");
    useProgress.getState().solveReview("plant:gate");
    useProgress.getState().visit("/powtorka");
    useProgress.getState().setTeam({ name: "  Tropiciele  ", icon: "turtle" });
    expect(useProgress.getState()).toMatchObject({
      team: { name: "Tropiciele", icon: "turtle" },
      solved: { plant: ["gate"] },
      review: ["plant:gate"],
      lastPath: "/powtorka",
    });
  });

  it("reset usuwa odpowiedzi i blokuje powtórkę, zachowując drużynę", () => {
    useProgress.getState().setTeam({ name: "Badacze", icon: "cat" });
    for (const place of initialCityPlaces) useProgress.getState().solve(place.cityId, place.id);
    useProgress.getState().solveReview("plant:gate");
    useProgress.getState().visit("/powtorka");
    expect(getCompletedCities(initialCityPlaces, useProgress.getState().solved)).toHaveLength(3);
    useProgress.getState().reset();
    expect(useProgress.getState()).toMatchObject({
      team: { name: "Badacze", icon: "cat" },
      solved: {},
      review: [],
      lastPath: "/",
    });
    expect(getCompletedCities(initialCityPlaces, useProgress.getState().solved)).toEqual([]);
  });
});

describe("zapis i ponowne uruchomienie gry", () => {
  it("odtwarza drużynę, postęp i powtórkę z rzeczywistego zapisu middleware persist", async () => {
    useProgress.getState().setTeam({ name: "Tropiciele", icon: "flame" });
    useProgress.getState().solve("plant", "gate");
    useProgress.getState().solveReview("plant:gate");
    useProgress.getState().visit("/miasto/animal");
    const saved = storage.getItem(storageKey)!;
    useProgress.setState(useProgress.getInitialState(), true);
    storage.setItem(storageKey, saved);
    await useProgress.persist.rehydrate();
    expect(useProgress.getState()).toMatchObject({
      team: { name: "Tropiciele", icon: "flame" },
      solved: { plant: ["gate"], animal: [], bacteria: [] },
      review: ["plant:gate"],
      lastPath: "/miasto/animal",
    });
    useProgress.getState().solve("animal", "power");
    expect(useProgress.getState().solved.animal).toEqual(["power"]);
  });

  it("odtwarza starszy postęp bez drużyny i pozwala ją dodać bez utraty odpowiedzi", async () => {
    storage.setItem(
      storageKey,
      JSON.stringify({
        version: 0,
        state: { solved: { plant: ["gate"] }, review: ["plant:gate"], lastPath: "/" },
      }),
    );
    await useProgress.persist.rehydrate();
    expect(useProgress.getState().team).toBeNull();
    useProgress.getState().setTeam({ name: "Nowa drużyna", icon: "rocket" });
    expect(useProgress.getState().solved.plant).toEqual(["gate"]);
    expect(useProgress.getState().review).toEqual(["plant:gate"]);
    expect(JSON.parse(storage.getItem(storageKey)!).state.team).toEqual({
      name: "Nowa drużyna",
      icon: "rocket",
    });
  });

  it("reset pozostaje zapisany po ponownym uruchomieniu, łącznie z zachowaną drużyną", async () => {
    useProgress.getState().setTeam({ name: "Badacze", icon: "turtle" });
    useProgress.getState().solve("animal", "power");
    useProgress.getState().solveReview("animal:power");
    useProgress.getState().reset();
    const saved = storage.getItem(storageKey)!;
    useProgress.setState(useProgress.getInitialState(), true);
    storage.setItem(storageKey, saved);
    await useProgress.persist.rehydrate();
    expect(useProgress.getState()).toMatchObject({
      team: { name: "Badacze", icon: "turtle" },
      solved: { plant: [], animal: [], bacteria: [] },
      review: [],
      lastPath: "/",
    });
  });

  it("błąd zapisu nie przerywa tworzenia drużyny ani zaliczania odpowiedzi", () => {
    vi.spyOn(storage, "setItem").mockImplementationOnce(() => {
      throw new DOMException("Full", "QuotaExceededError");
    });
    expect(() => useProgress.getState().setTeam({ name: "Badacze", icon: "cat" })).not.toThrow();
    expect(() => useProgress.getState().solve("plant", "gate")).not.toThrow();
    expect(useProgress.getState()).toMatchObject({
      team: { name: "Badacze", icon: "cat" },
      solved: { plant: ["gate"] },
    });
  });
});
