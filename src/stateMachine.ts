import { createMachine, assign } from "xstate";

export enum eventTypes {
  EXERCISE_SELECTED = "EXERCISE_SELECTED"
}

export enum stateTypes {
  DEFAULT = "DEFAULT",
  EXERCISE_SELECTED = "EXERCISE_SELECTED"
}

enum actionTypes {
  SET_LESSON_DATA = "SET_LESSON_DATA"
}

interface stateContext {
  selectedLessonText?: string;
  lessonCategory?: string;
  lessonNumber?: number;
  exerciseNumber?: number;
}

type EXERCISE_SELECTED = {
  type: eventTypes.EXERCISE_SELECTED;
  selectedLessonText: string;
  lessonCategory: string;
  lessonNumber?: number;
  exerciseNumber: number;
};

type stateEvents = EXERCISE_SELECTED;

export const stateMachine = createMachine<stateContext, stateEvents>(
  {
    initial: stateTypes.DEFAULT,
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
      [actionTypes.SET_LESSON_DATA]: assign(
        (
          context,
          { exerciseNumber, lessonCategory, selectedLessonText, lessonNumber }
        ) => {
          return {
            exerciseNumber,
            lessonCategory,
            selectedLessonText,
            lessonNumber
          };
        }
      )
    }
  }
);
