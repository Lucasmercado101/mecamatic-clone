import { cond, equals, pipe } from "ramda";

export enum SENTENCE_POSITION {
  NOT_STARTED = -1,
  FIRST_LETTER = 0
}

type State = {
  areKeysColored: boolean;
  exerciseSelected: string | null;
  sentenceCursorPosition: number;
  lessonCategory?: string;
  lessonNumber?: number;
  exerciseNumber?: number;
};

export const initialModel: State = {
  areKeysColored: true,
  exerciseSelected: null,
  sentenceCursorPosition: SENTENCE_POSITION.NOT_STARTED
};

export enum ACTION_TYPE {
  LESSON_SELECTED,
  KEY_PRESSED
}

interface Action<T extends {}> {
  type: ACTION_TYPE;
  payload: T;
}

type SelectedLessonAction = Action<{
  selectedLessonText: string;
  lessonCategory: string;
  lessonNumber?: number;
  exerciseNumber: number;
}>;
type KeyPressedAction = Action<{ keyPressed: string }>;

type Actions = SelectedLessonAction | KeyPressedAction;

export function modelReducer(
  state: State = initialModel,
  action: Actions
): State {
  return cond(
    [
      [
        equals(ACTION_TYPE.LESSON_SELECTED),
        () => ({
          ...state,
          exerciseSelected: (action as SelectedLessonAction).payload
            .selectedLessonText,
          sentenceCursorPosition: SENTENCE_POSITION.NOT_STARTED,
          lessonCategory: (action as SelectedLessonAction).payload
            .lessonCategory,
          lessonNumber: (action as SelectedLessonAction).payload.lessonNumber,
          exerciseNumber: (action as SelectedLessonAction).payload
            .exerciseNumber
        })
      ],
      [
        equals(ACTION_TYPE.KEY_PRESSED),
        () => {
          // no exercise is selected
          if (!state.exerciseSelected) return state;
          const { keyPressed } = (action as KeyPressedAction).payload;

          const { sentenceCursorPosition, exerciseSelected } = state;

          // if the exercise is selected and hasn't started
          if (sentenceCursorPosition === SENTENCE_POSITION.NOT_STARTED) {
            // if enter is pressed, then the exercise starts
            if (keyPressed === "Enter")
              return {
                ...state,
                sentenceCursorPosition: SENTENCE_POSITION.FIRST_LETTER
              };
            else return state;
          }

          const currentLetter = exerciseSelected[sentenceCursorPosition];
          // if the current letter is the same as the key pressed
          if (currentLetter === keyPressed) {
            return {
              ...state,
              sentenceCursorPosition: sentenceCursorPosition + 1
            };
          } else return state;
        }
      ]
    ]
    // @ts-ignore
  )(action.type);
}
