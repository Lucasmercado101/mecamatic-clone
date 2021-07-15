import { cond, equals, assoc, pipe } from "ramda";

const SENTENCE_POSITION = {
  NOT_STARTED: -1,
  FIRST_LETTER: 0
};

export const initialModel = {
  areKeysColored: true,
  exerciseSelected: null,
  sentenceCursorPosition: SENTENCE_POSITION.NOT_STARTED
};
export const MESSAGES = {
  LESSON_SELECTED: 0
};

export function modelReducer(state = initialModel, { type, payload }) {
  const res = cond([
    [
      equals(MESSAGES.LESSON_SELECTED),
      () =>
        pipe(
          assoc("exerciseSelected", payload),
          assoc("sentenceCursorPosition", SENTENCE_POSITION.NOT_STARTED)
        )(state)
    ]
  ]);
  return res(type);
}
