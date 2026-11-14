import { describe, expect, it } from "vite-plus/test";
import { initialCityPlaces } from "@/data/questions";
import { initialPlaces } from "@/data/places";
import { createCityQuestions } from "@/lib/cityQuestions";
import { isQuestionReady } from "@/lib/questions";
import { matchesSavedPlace } from "@/lib/placeContent";
import { getQuestion } from "./fixtures";

describe("pytania przypisane do komórek", () => {
  it("każda dozwolona para komórka-budynek ma dokładnie jedno gotowe pytanie", () => {
    const expectedIds = initialPlaces.flatMap((place) =>
      place.cells.map((city) => `${city}:${place.id}`),
    );
    expect(initialCityPlaces.map((place) => place.questionId).sort()).toEqual(expectedIds.sort());
    expect(initialCityPlaces.every(isQuestionReady)).toBe(true);
    for (const place of initialCityPlaces) {
      expect(place.questionId).toBe(`${place.cityId}:${place.id}`);
      expect(place.cells).toEqual([place.cityId]);
    }
  });

  it("migracja zachowuje dawną treść, ale późniejsze zmiany dotyczą tylko jednej komórki", () => {
    const building = structuredClone(initialPlaces.find((place) => place.id === "gate")!);
    building.question = "Dawne pytanie";
    building.options = ["Woda", "Tlen", "Białko", "DNA"];
    const migrated = createCityQuestions([building]);
    const plant = migrated.find((place) => place.cityId === "plant")!;
    const animal = migrated.find((place) => place.cityId === "animal")!;
    const bacteria = migrated.find((place) => place.cityId === "bacteria")!;
    expect(migrated.map((place) => place.question)).toEqual([
      "Dawne pytanie",
      "Dawne pytanie",
      "Dawne pytanie",
    ]);
    plant.question = "Pytanie tylko dla roślin";
    plant.options[0] = "Chloroplast";
    expect(animal.question).toBe("Dawne pytanie");
    expect(animal.options[0]).toBe("Woda");
    expect(bacteria.options[0]).toBe("Woda");
    expect(building.options[0]).toBe("Woda");
  });

  it("nie tworzy pytań o struktury nieobecne w danej komórce", () => {
    const farm = initialPlaces.find((place) => place.id === "farm")!;
    expect(createCityQuestions([farm]).map((place) => place.questionId)).toEqual(["plant:farm"]);
  });
});

describe("warunki gotowości pytania", () => {
  it.each([0, 1, 2, 3])("akceptuje poprawną odpowiedź o indeksie %i", (correct) => {
    expect(isQuestionReady({ ...getQuestion("plant"), correct })).toBe(true);
  });

  it.each(["", "   ", "?", " ? "])("odrzuca pustą lub zastępczą treść %j", (question) => {
    expect(isQuestionReady({ ...getQuestion("plant"), question })).toBe(false);
  });

  it.each([
    ["Woda", "Tlen", "DNA"],
    ["Woda", "Tlen", "DNA", "Białko", "Tłuszcz"],
    ["Woda", "Tlen", "DNA", "  "],
    ["Woda", " wODA ", "DNA", "Białko"],
    ["BŁONA", "błona", "DNA", "Białko"],
  ])("wymaga czterech niepustych, różnych odpowiedzi: %j", (...options) => {
    expect(isQuestionReady({ ...getQuestion("plant"), options })).toBe(false);
  });

  it.each([-1, 4, 1.5, NaN, Infinity])("odrzuca nieprawidłowy indeks %s", (correct) => {
    expect(isQuestionReady({ ...getQuestion("plant"), correct })).toBe(false);
  });
});

describe("ochrona przed nadpisaniem innej wersji pytania", () => {
  it("akceptuje tę samą treść niezależnie od kolejności pól", () => {
    const place = getQuestion("animal");
    const reordered = Object.fromEntries(Object.entries(place).reverse());
    expect(matchesSavedPlace(place, reordered as typeof place)).toBe(true);
  });

  it("wykrywa nowszą treść, inną poprawną odpowiedź i inny typ komórki", () => {
    const place = getQuestion("animal");
    expect(matchesSavedPlace(place, { ...place, question: "Nowe pytanie" })).toBe(false);
    expect(
      matchesSavedPlace(place, { ...place, options: ["Nowa", ...place.options.slice(1)] }),
    ).toBe(false);
    expect(matchesSavedPlace(place, { ...place, correct: (place.correct + 1) % 4 })).toBe(false);
    expect(matchesSavedPlace(place, getQuestion("plant"))).toBe(false);
  });
});
