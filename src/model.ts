import { cond, equals, assoc, pipe } from "ramda";

const SENTENCE_POSITION = {
  NOT_STARTED: -1,
  FIRST_LETTER: 0
};

type State = {
  areKeysColored: boolean;
  exerciseSelected: string | null;
  sentenceCursorPosition: number;
};

export const initialModel: State = {
  areKeysColored: true,
  exerciseSelected: null,
  sentenceCursorPosition: SENTENCE_POSITION.NOT_STARTED
};

export enum ACTION_TYPE {
  LESSON_SELECTED = 0
}

type Action = {
  type: ACTION_TYPE;
  payload: any;
};

export function modelReducer(
  state: State = initialModel,
  { type, payload }: Action
): State {
  return cond(
    [
      [
        equals(ACTION_TYPE.LESSON_SELECTED),
        () =>
          pipe(
            assoc("exerciseSelected", payload),
            assoc("sentenceCursorPosition", SENTENCE_POSITION.NOT_STARTED)
          )(state)
      ]
    ]
    // @ts-ignore
  )(type);
}
