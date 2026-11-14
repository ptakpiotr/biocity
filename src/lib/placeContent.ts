import type { Place } from "@/Types";

// Porównujemy pola jawnie: kolejność kluczy obiektu nie wpływa na wynik.
export const matchesSavedPlace = (current: Place, expected: Place): boolean =>
  current.questionId === expected.questionId &&
  current.cityId === expected.cityId &&
  current.id === expected.id &&
  current.name === expected.name &&
  current.icon === expected.icon &&
  current.organelle === expected.organelle &&
  current.text === expected.text &&
  current.question === expected.question &&
  current.correct === expected.correct &&
  current.options.length === expected.options.length &&
  current.options.every((answer, index) => answer === expected.options[index]) &&
  current.cells.length === expected.cells.length &&
  current.cells.every((city, index) => city === expected.cells[index]);
