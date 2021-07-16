import { createMachine, assign } from "xstate";

export enum EXERCISE_CURSOR_POSITION {
  NOT_STARTED = -1,
  FIRST_LETTER = 0
}

export enum eventTypes {
  EXERCISE_SELECTED = "EXERCISE_SELECTED",
  KEY_PRESSED = "KEY_PRESSED"
}

export enum stateTypes {
  DEFAULT = "DEFAULT",
  EXERCISE_SELECTED = "EXERCISE_SELECTED",
  EXERCISE_NOT_STARTED = "EXERCISE_NOT_STARTED",
  EXERCISE_ONGOING = "EXERCISE_ONGOING",
  EXERCISE_FINISHED = "EXERCISE_FINISHED"
}

enum actionTypes {
  SET_EXERCISE_DATA = "SET_EXERCISE_DATA",
  SET_CURSOR_TO_NOT_STARTED = "SET_CURSOR_TO_NOT_STARTED",
  SET_CURSOR_TO_FIRST_LETTER = "SET_CURSOR_TO_FIRST_LETTER",
  MOVE_CURSOR_BY_ONE = "MOVE_CURSOR_BY_ONE"
}

enum guardTypes {
  ENTER_WAS_PRESSED = "ENTER_WAS_PRESSED",
  PRESSED_CORRECT_LETTER = "PRESSED_CORRECT_LETTER",
  PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER = "PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER"
}

/** ---------- settings --------------
 *
 * type tutorPreferences = true | false | null
 *
 * ----------------------------------
 */

interface stateContext {
  // ----------------- global settings -----------------
  minSpeed?: number; // fixed number or depends on the exercise settings
  // maximum amount of errors allowed (%):
  // fixed number or depends on the exercise settings
  errorsCoefficient: number;
  showKeyboard?: boolean; // always show, never show, or depends on the exercise settings
  isTutorActive?: boolean; // always active, never active, or depends on the exercise settings
  // ---- options -----
  soundOnKeysTap: boolean;
  soundOnError: boolean;
  infoPanelOnTheLeft: boolean;
  showResultsWhileDoingExercise: boolean;

  // ----------------- exercise data -----------------
  selectedLessonText?: string;
  lessonCategory?: string;
  lessonNumber?: number;
  exerciseCursorPosition: number;
  exerciseNumber?: number;
}

type ExerciseSelectedEvent = {
  type: eventTypes.EXERCISE_SELECTED;
  selectedLessonText: string;
  lessonCategory: string;
  lessonNumber?: number;
  exerciseNumber: number;
};

type KeyPressedEvent = {
  type: eventTypes.KEY_PRESSED;
  key: string;
};

type stateEvents = ExerciseSelectedEvent | KeyPressedEvent;

export const stateMachine = createMachine<stateContext, stateEvents>(
  {
    initial: stateTypes.DEFAULT,
    context: {
      exerciseCursorPosition: EXERCISE_CURSOR_POSITION.NOT_STARTED,
      errorsCoefficient: 2,
      // settings
      soundOnKeysTap: false,
      soundOnError: false,
      infoPanelOnTheLeft: false,
      showResultsWhileDoingExercise: false
    },
    states: {
      [stateTypes.DEFAULT]: {},
      [stateTypes.EXERCISE_SELECTED]: {
        initial: stateTypes.EXERCISE_NOT_STARTED,
        entry: actionTypes.SET_CURSOR_TO_NOT_STARTED,
        states: {
          [stateTypes.EXERCISE_NOT_STARTED]: {
            on: {
              [eventTypes.KEY_PRESSED]: {
                target: stateTypes.EXERCISE_ONGOING,
                cond: guardTypes.ENTER_WAS_PRESSED,
                actions: actionTypes.SET_CURSOR_TO_FIRST_LETTER
              }
            }
          },
          [stateTypes.EXERCISE_ONGOING]: {
            on: {
              [eventTypes.KEY_PRESSED]: [
                {
                  target: stateTypes.EXERCISE_FINISHED,
                  cond: guardTypes.PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER,
                  actions: actionTypes.MOVE_CURSOR_BY_ONE
                },
                {
                  target: stateTypes.EXERCISE_ONGOING,
                  cond: guardTypes.PRESSED_CORRECT_LETTER,
                  actions: actionTypes.MOVE_CURSOR_BY_ONE
                }
              ]
            }
          },
          [stateTypes.EXERCISE_FINISHED]: {}
        }
      }
    },
    on: {
      [eventTypes.EXERCISE_SELECTED]: {
        target: stateTypes.EXERCISE_SELECTED,
        actions: actionTypes.SET_EXERCISE_DATA
      }
    }
  },
  {
    actions: {
      [actionTypes.SET_EXERCISE_DATA]: assign((_, event) => {
        const {
          exerciseNumber,
          lessonCategory,
          selectedLessonText,
          lessonNumber
        } = event as ExerciseSelectedEvent;

        return {
          exerciseNumber,
          lessonCategory,
          selectedLessonText,
          lessonNumber
        };
      }),
      [actionTypes.SET_CURSOR_TO_NOT_STARTED]: assign((_) => ({
        exerciseCursorPosition: EXERCISE_CURSOR_POSITION.NOT_STARTED
      })),
      [actionTypes.MOVE_CURSOR_BY_ONE]: assign((ctx) => ({
        exerciseCursorPosition: ctx.exerciseCursorPosition + 1
      })),
      [actionTypes.SET_CURSOR_TO_FIRST_LETTER]: assign((_) => ({
        exerciseCursorPosition: EXERCISE_CURSOR_POSITION.FIRST_LETTER
      }))
    },
    guards: {
      [guardTypes.ENTER_WAS_PRESSED]: (_, event) => {
        const { key } = event as KeyPressedEvent;
        return key === "Enter";
      },
      [guardTypes.PRESSED_CORRECT_LETTER]: (ctx, event) => {
        const { key } = event as KeyPressedEvent;
        return key === ctx.selectedLessonText?.[ctx.exerciseCursorPosition];
      },
      [guardTypes.PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER]: (
        ctx,
        event
      ) => {
        const { key } = event as KeyPressedEvent;
        return (
          key === ctx.selectedLessonText?.[ctx.exerciseCursorPosition] &&
          ctx.selectedLessonText?.length - 1 === ctx.exerciseCursorPosition
        );
      }
    }
  }
);
