import type { Place, Progress } from "@/Types";
import { cities } from "@/data/cities";
export const getCompletedCities = (places: Place[], solved: Progress["solved"]) => {
  return cities.filter((city) => {
    const cityPlaces = places.filter((place) => place.cells.includes(city.id));
    return (
      cityPlaces.length > 0 && cityPlaces.every((place) => solved[city.id]?.includes(place.id))
    );
  });
};

export const getReviewProgress = (places: Place[], review: string[]) => ({
  pending: places.find((place) => !review.includes(place.questionId)),
  count: places.filter((place) => review.includes(place.questionId)).length,
  total: places.length,
});
