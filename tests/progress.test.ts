import { describe, expect, it } from "vite-plus/test";
import { initialCityPlaces } from "@/data/questions";
import { getCompletedCities, getReviewProgress } from "@/lib/progress";
import { completeCity, getQuestion } from "./fixtures";

describe("ukończenie komórek i odblokowanie powtórki", () => {
  it("zaliczenie wszystkich budynków jednej komórki nie zalicza pozostałych", () => {
    expect(
      getCompletedCities(initialCityPlaces, completeCity("plant")).map((city) => city.id),
    ).toEqual(["plant"]);
  });

  it("brak jednej odpowiedzi blokuje ukończenie, nawet przy duplikatach i nieznanych budynkach", () => {
    const ids = completeCity("plant").plant.filter((id) => id !== "gate");
    expect(getCompletedCities(initialCityPlaces, { plant: [...ids, ...ids, "nieznany"] })).toEqual(
      [],
    );
  });

  it("powtórkę można odblokować dopiero po ukończeniu wszystkich trzech komórek", () => {
    const solved = { ...completeCity("plant"), ...completeCity("animal") };
    expect(getCompletedCities(initialCityPlaces, solved)).toHaveLength(2);
    expect(
      getCompletedCities(initialCityPlaces, { ...solved, ...completeCity("bacteria") }).map(
        (city) => city.id,
      ),
    ).toEqual(["plant", "animal", "bacteria"]);
  });

  it("pusta komórka ani brak zapisu nie oznaczają ukończenia gry", () => {
    expect(getCompletedCities([], completeCity("plant"))).toEqual([]);
    expect(getCompletedCities(initialCityPlaces, {})).toEqual([]);
  });
});

describe("przebieg powtórki", () => {
  const places = [getQuestion("plant"), getQuestion("animal"), getQuestion("bacteria")];

  it("zaliczenie struktury roślinnej nie zalicza tej samej struktury zwierzęcej lub bakteryjnej", () => {
    const result = getReviewProgress(places, ["plant:gate"]);
    expect(result).toMatchObject({ count: 1, total: 3 });
    expect(result.pending?.questionId).toBe("animal:gate");
  });

  it("dawne zbiorcze identyfikatory budynków nie zaliczają nowych pytań", () => {
    const result = getReviewProgress(places, ["gate"]);
    expect(result.count).toBe(0);
    expect(result.pending?.questionId).toBe("plant:gate");
  });

  it("duplikaty i nieznane pytania nie zawyżają wyniku", () => {
    const result = getReviewProgress(places, ["plant:gate", "plant:gate", "animal:unknown"]);
    expect(result.count).toBe(1);
    expect(result.pending?.questionId).toBe("animal:gate");
  });

  it("po ostatniej odpowiedzi nie pozostaje kolejne pytanie", () => {
    expect(
      getReviewProgress(
        places,
        places.map((place) => place.questionId),
      ),
    ).toEqual({ count: 3, total: 3, pending: undefined });
  });
});
