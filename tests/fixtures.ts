import { initialCityPlaces } from "@/data/questions";
import type { CityId, Place, Progress } from "@/Types";

export const getQuestion = (cityId: CityId, buildingId = "gate"): Place => {
  const place = initialCityPlaces.find((item) => item.cityId === cityId && item.id === buildingId);
  if (!place) throw new Error(`Brak pytania: ${cityId}:${buildingId}`);
  return structuredClone(place);
};

export const completeCity = (cityId: CityId): Progress["solved"] => ({
  [cityId]: initialCityPlaces.filter((place) => place.cityId === cityId).map((place) => place.id),
});
