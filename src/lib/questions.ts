import type { Place } from "@/Types";

export const isQuestionReady = (place: Place): boolean => {
  const question = place.question.trim();
  const answers = place.options.map((answer) => answer.trim().toLocaleLowerCase("pl"));

  return (
    question !== "" &&
    question !== "?" &&
    answers.length === 4 &&
    answers.every((answer) => answer !== "") &&
    new Set(answers).size === 4 &&
    Number.isInteger(place.correct) &&
    place.correct >= 0 &&
    place.correct < 4
  );
};

export const getQuestionKey = (place: Place): string =>
  JSON.stringify([place.questionId, place.question, place.options, place.correct]);
