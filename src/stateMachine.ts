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
  EXERCISE_SELECTED = "EXERCISE_SELECTED"
}

enum actionTypes {
  SET_LESSON_DATA = "SET_LESSON_DATA"
}

/** ---------- settings --------------
 *
 * // always, never, or dependent on the exercise settings
 * type tutorPreferences = true | false | null
 *
 * ----------------------------------
 */

interface stateContext {
  isTutorEnabled: boolean;
  // exercise data
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
      isTutorEnabled: false,
      exerciseCursorPosition: EXERCISE_CURSOR_POSITION.NOT_STARTED
    },
    states: {
      [stateTypes.DEFAULT]: {},
      [stateTypes.EXERCISE_SELECTED]: {}
    },
    on: {
      [eventTypes.EXERCISE_SELECTED]: {
        target: stateTypes.EXERCISE_SELECTED,
        actions: actionTypes.SET_LESSON_DATA
      }
    }
  },
  {
    actions: {
      [actionTypes.SET_LESSON_DATA]: assign((_, event) => {
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
      })
    }
  }
);
