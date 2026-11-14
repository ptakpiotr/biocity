import type { CityId, LegacyPlace, Place } from "@/Types";

const cityIds: CityId[] = ["plant", "animal", "bacteria"];

export const createCityQuestions = (buildings: LegacyPlace[]): Place[] =>
  buildings.flatMap((building) =>
    cityIds
      .filter((cityId) => building.cells.includes(cityId))
      .map((cityId) => ({
        ...building,
        questionId: `${cityId}:${building.id}`,
        cityId,
        cells: [cityId],
        options: [...building.options],
      })),
  );
