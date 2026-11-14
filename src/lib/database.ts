import Dexie, { liveQuery } from "dexie";
import type { DatabaseTables, Place } from "@/Types";
import { matchesSavedPlace } from "@/lib/placeContent";
import { createCityQuestions } from "@/lib/cityQuestions";
import { initialCityPlaces } from "@/data/questions";

const db = new Dexie("biocity") as Dexie & DatabaseTables;
const initialQuestions = initialCityPlaces;

db.version(1).stores({ places: "id" });
db.version(2)
  .stores({
    places: "id",
    cityPlaces: "questionId, cityId, id, &[cityId+id]",
  })
  .upgrade(async (transaction) => {
    const legacy = await transaction.table("places").toArray();
    // Zachowaj dotychczasowe treści jako niezależne kopie w każdym mieście.
    await transaction.table("cityPlaces").bulkPut(createCityQuestions(legacy));
  });

export const readPlaces = async (): Promise<Place[]> => {
  const rows = await db.cityPlaces.toArray();
  const byId = new Map(rows.map((row) => [row.questionId, row]));
  return initialQuestions.map((seed) => byId.get(seed.questionId) ?? seed);
};

export const loadPlaces = async (): Promise<Place[]> => {
  await db.transaction("rw", db.cityPlaces, async () => {
    for (const place of initialQuestions) {
      if (!(await db.cityPlaces.get(place.questionId))) {
        await db.cityPlaces.add(place);
      }
    }
  });
  return readPlaces();
};

export const observePlaces = () => liveQuery(readPlaces);

export const savePlace = async (place: Place, expected: Place): Promise<void> => {
  await db.transaction("rw", db.cityPlaces, async () => {
    const current = await db.cityPlaces.get(place.questionId);
    if (!current || !matchesSavedPlace(current, expected)) {
      throw new Error("PLACE_CONFLICT");
    }
    await db.cityPlaces.put(place);
  });
};
