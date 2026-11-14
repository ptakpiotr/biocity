import type { Place, QuestionContent } from "@/Types";
import content from "@/data/initialQuestions.json";
import { initialPlaces } from "@/data/places";

const questions = content as QuestionContent[];

export const initialCityPlaces: Place[] = questions.map((question) => {
  const building = initialPlaces.find((place) => place.id === question.buildingId);
  if (!building || !building.cells.includes(question.cityId)) {
    throw new Error(`INVALID_CITY_QUESTION: ${question.questionId}`);
  }

  return {
    ...building,
    questionId: question.questionId,
    cityId: question.cityId,
    cells: [question.cityId],
    question: question.question,
    options: [...question.options],
    correct: question.correct,
  };
});
