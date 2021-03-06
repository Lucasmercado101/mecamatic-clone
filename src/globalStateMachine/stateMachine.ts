import { createMachine, assign } from "xstate";
import { userData } from "../views/Welcome";

function calculatePercentageOfErrors(
  errors: number,
  totalAmount: number
): number {
  return (errors / totalAmount) * 100;
}

export enum EXERCISE_CURSOR_POSITION {
  NOT_STARTED = -1,
  FIRST_LETTER = 0
}

export enum eventTypes {
  EXERCISE_SELECTED = "EXERCISE_SELECTED",
  KEY_PRESSED = "KEY_PRESSED",
  USER_DATA_LOADED = "USER_DATA_LOADED",
  USER_DATA_RELOADED = "USER_DATA_RELOADED",
  PAUSE_TIMER = "PAUSE_TIMER",
  RESUME_TIMER = "RESUME_TIMER",
  LOG_OUT = "LOG_OUT"
}

export enum stateTypes {
  WELCOME_VIEW = "WELCOME_VIEW",
  MAIN_VIEW = "MAIN_VIEW",
  EXERCISE_NOT_SELECTED = "EXERCISE_NOT_SELECTED",
  EXERCISE_PROGRESS = "EXERCISE_PROGRESS",
  EXERCISE_SELECTED = "EXERCISE_SELECTED",
  EXERCISE_NOT_STARTED = "EXERCISE_NOT_STARTED",
  EXERCISE_ONGOING = "EXERCISE_ONGOING",
  EXERCISE_FINISHED = "EXERCISE_FINISHED",
  EXERCISE_FINISHED_UNSUCCESSFULLY = "EXERCISE_FINISHED_UNSUCCESSFULLY",
  EXERCISE_TIMER = "EXERCISE_TIMER",
  TIMER_OFF = "TIMER_OFF",
  TIMER_ONGOING = "TIMER_ONGOING",
  TIMER_STOPPED = "TIMER_STOPPED",
  TIMER_PAUSED = "TIMER_PAUSED"
}

enum IDs {
  ROOT = "ROOT",
  WELCOME_VIEW = "WELCOME_VIEW",
  MAIN_VIEW = "MAIN_VIEW"
}

enum actionTypes {
  SET_EXERCISE_DATA = "SET_EXERCISE_DATA",
  SET_CURSOR_TO_NOT_STARTED = "SET_CURSOR_TO_NOT_STARTED",
  SET_CURSOR_TO_FIRST_LETTER = "SET_CURSOR_TO_FIRST_LETTER",
  MOVE_CURSOR_BY_ONE = "MOVE_CURSOR_BY_ONE",
  ADD_ONE_TO_ELAPSED_SECONDS = "ADD_ONE_TO_ELAPSED_SECONDS",
  RESET_ELAPSED_TIME_TO_0 = "RESET_ELAPSED_TIME_TO_0",
  CALCULATE_GROSS_KEYWORDS_TYPED = "CALCULATE_GROSS_KEYWORDS_TYPED",
  CALCULATE_NET_KEYWORDS_TYPED = "CALCULATE_NET_KEYWORDS_TYPED",
  INCREASE_ERRORS_BY_ONE = "INCREASE_ERRORS_BY_ONE",
  RESET_ERRORS_TO_0 = "RESET_ERRORS_TO_0",
  RESET_GROSS_KEYWORDS_TYPED_TO_0 = "RESET_GROSS_KEYWORDS_TYPED_TO_0",
  RESET_NET_KEYWORDS_TYPED_TO_0 = "RESET_NET_KEYWORDS_TYPED_TO_0",
  SET_USER_DATA = "SET_USER_DATA",
  SET_ERROR_MESSAGE_TO_TIME_RAN_OUT = "SET_ERROR_MESSAGE_TO_TIME_RAN_OUT",
  SET_ERROR_MESSAGE_TO_TOO_MANY_ERRORS = "SET_ERROR_MESSAGE_TO_TOO_MANY_ERRORS",
  SET_ERROR_MESSAGE_TO_TOO_SLOW = "SET_ERROR_MESSAGE_TO_TOO_SLOW"
}

enum guardTypes {
  ENTER_WAS_PRESSED = "ENTER_WAS_PRESSED",
  PRESSED_CORRECT_LETTER = "PRESSED_CORRECT_LETTER",
  PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER = "PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER",
  PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER_BUT_MADE_TOO_MANY_MISTAKES = "PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER_BUT_MADE_TOO_MANY_MISTAKES",
  PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER_BUT_WAS_TOO_SLOW = "PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER_BUT_WAS_TOO_SLOW",
  THERE_IS_ONE_SECOND_LEFT = "THERE_IS_ONE_SECOND_LEFT",
  PRESSED_A_MODIFIER_KEY = "PRESSED_A_MODIFIER_KEY"
}

export interface stateContext {
  // ----------------- global settings -----------------
  // fixed number or depends on the exercise settings
  // this global number, if set, overrides the minimum speed
  // of the exercises
  minSpeed?: number;
  // maximum amount of errors allowed (%):
  // fixed number or depends on the exercise settings
  errorsCoefficient: number;
  defaultErrorsCoefficient: number;
  isKeyboardGloballyVisible?: boolean; // always show, never show, or depends on the exercise settings
  isTutorGloballyActive?: boolean; // always active, never active, or depends on the exercise settings
  timeLimitInSeconds: number;
  userName: string;

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
  minimumWPMNeededToCompleteExerciseSuccessfully: number;
  isTutorActiveForThisExercise?: boolean;
  isKeyboardVisibleForThisExercise?: boolean;
  totalNetKeystrokes?: number;
  totalGrossKeystrokes?: number;
  errors: number;
  elapsedSeconds: number;
  exerciseFinishedUnsuccessfullyIncidenceMessage: string;
}

type ExerciseSelectedEvent = {
  type: eventTypes.EXERCISE_SELECTED;
  selectedLessonText: string;
  lessonCategory: string;
  lessonNumber?: number;
  exerciseNumber: number;
  isTutorActive: boolean;
  isKeyboardVisible: boolean;
  exerciseMinimumSpeed: number;
};

type KeyPressedEvent = {
  type: eventTypes.KEY_PRESSED;
  key: string;
  pressedCtrlKey?: boolean;
  pressedAltKey?: boolean;
};

type UserDataLoadedEvent = {
  type: eventTypes.USER_DATA_LOADED;
} & userData;

type UserDataReloadedEvent = {
  type: eventTypes.USER_DATA_RELOADED;
} & userData;

type PauseTimerEvent = {
  type: eventTypes.PAUSE_TIMER;
};

type ResumeTimerEvent = {
  type: eventTypes.RESUME_TIMER;
};

type LogOutEvent = {
  type: eventTypes.LOG_OUT;
};

export type stateEvents =
  | ExerciseSelectedEvent
  | KeyPressedEvent
  | UserDataLoadedEvent
  | UserDataReloadedEvent
  | PauseTimerEvent
  | ResumeTimerEvent
  | LogOutEvent;

function totalNetKeystrokesTyped(totalKeystrokes: number, errors: number) {
  return totalKeystrokes - errors;
}

function totalGrossKeystrokesTyped(totalKeystrokes: number, errors: number) {
  return totalKeystrokes + errors;
}

export const stateMachine = createMachine<stateContext, stateEvents>(
  {
    id: IDs.ROOT,
    initial: stateTypes.WELCOME_VIEW,
    context: {
      exerciseFinishedUnsuccessfullyIncidenceMessage: "",
      userName: "",
      exerciseCursorPosition: EXERCISE_CURSOR_POSITION.NOT_STARTED,
      minimumWPMNeededToCompleteExerciseSuccessfully: 20,
      elapsedSeconds: 0,
      errors: 0,
      timeLimitInSeconds: 900, // 15 minutes default time limit
      // global settings
      defaultErrorsCoefficient: 2,
      errorsCoefficient: 2, // initially 2, then loaded from user settings,
      soundOnKeysTap: false,
      soundOnError: false,
      infoPanelOnTheLeft: false,
      showResultsWhileDoingExercise: false
    },
    states: {
      [stateTypes.WELCOME_VIEW]: {
        id: IDs.WELCOME_VIEW,
        on: {
          [eventTypes.USER_DATA_LOADED]: {
            target: stateTypes.MAIN_VIEW,
            actions: actionTypes.SET_USER_DATA
          }
        }
      },
      [stateTypes.MAIN_VIEW]: {
        id: IDs.MAIN_VIEW,
        type: "compound",
        initial: stateTypes.EXERCISE_NOT_SELECTED,
        states: {
          [stateTypes.EXERCISE_NOT_SELECTED]: {},
          [stateTypes.EXERCISE_SELECTED]: {
            entry: [
              actionTypes.RESET_ELAPSED_TIME_TO_0,
              actionTypes.RESET_ERRORS_TO_0,
              // TODO i don't think these computed values should be computed here and not in app.tsx on the fly
              actionTypes.RESET_GROSS_KEYWORDS_TYPED_TO_0,
              actionTypes.RESET_NET_KEYWORDS_TYPED_TO_0
            ],
            type: "parallel",
            states: {
              [stateTypes.EXERCISE_PROGRESS]: {
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
                          target: `#${IDs.MAIN_VIEW}.${stateTypes.EXERCISE_FINISHED_UNSUCCESSFULLY}`,
                          cond: guardTypes.PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER_BUT_MADE_TOO_MANY_MISTAKES,
                          actions: [
                            actionTypes.MOVE_CURSOR_BY_ONE,
                            actionTypes.CALCULATE_GROSS_KEYWORDS_TYPED,
                            actionTypes.CALCULATE_NET_KEYWORDS_TYPED,
                            actionTypes.SET_ERROR_MESSAGE_TO_TOO_MANY_ERRORS
                          ]
                        },
                        {
                          target: `#${IDs.MAIN_VIEW}.${stateTypes.EXERCISE_FINISHED_UNSUCCESSFULLY}`,
                          cond: guardTypes.PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER_BUT_WAS_TOO_SLOW,
                          actions: [
                            actionTypes.MOVE_CURSOR_BY_ONE,
                            actionTypes.CALCULATE_GROSS_KEYWORDS_TYPED,
                            actionTypes.CALCULATE_NET_KEYWORDS_TYPED,
                            actionTypes.SET_ERROR_MESSAGE_TO_TOO_SLOW
                          ]
                        },
                        {
                          target: stateTypes.EXERCISE_FINISHED,
                          cond: guardTypes.PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER,
                          actions: [
                            actionTypes.MOVE_CURSOR_BY_ONE,
                            actionTypes.CALCULATE_GROSS_KEYWORDS_TYPED,
                            actionTypes.CALCULATE_NET_KEYWORDS_TYPED
                          ]
                        },
                        {
                          target: stateTypes.EXERCISE_ONGOING,
                          cond: guardTypes.PRESSED_CORRECT_LETTER,
                          actions: [
                            actionTypes.MOVE_CURSOR_BY_ONE,
                            actionTypes.CALCULATE_GROSS_KEYWORDS_TYPED,
                            actionTypes.CALCULATE_NET_KEYWORDS_TYPED
                          ]
                        },
                        {
                          target: stateTypes.EXERCISE_ONGOING,
                          cond: guardTypes.PRESSED_A_MODIFIER_KEY,
                          actions: [
                            actionTypes.CALCULATE_GROSS_KEYWORDS_TYPED,
                            actionTypes.CALCULATE_NET_KEYWORDS_TYPED
                          ]
                        },
                        {
                          target: stateTypes.EXERCISE_ONGOING,
                          actions: [
                            actionTypes.INCREASE_ERRORS_BY_ONE,
                            actionTypes.CALCULATE_GROSS_KEYWORDS_TYPED,
                            actionTypes.CALCULATE_NET_KEYWORDS_TYPED
                          ]
                        }
                      ]
                    }
                  },
                  [stateTypes.EXERCISE_FINISHED]: {}
                }
              },
              [stateTypes.EXERCISE_TIMER]: {
                initial: stateTypes.TIMER_OFF,
                states: {
                  [stateTypes.TIMER_OFF]: {
                    on: {
                      [eventTypes.KEY_PRESSED]: {
                        target: stateTypes.TIMER_ONGOING,
                        cond: guardTypes.ENTER_WAS_PRESSED
                      }
                    }
                  },
                  [stateTypes.TIMER_ONGOING]: {
                    after: {
                      1000: [
                        {
                          target: `#${IDs.MAIN_VIEW}.${stateTypes.EXERCISE_FINISHED_UNSUCCESSFULLY}`,
                          actions: [
                            actionTypes.ADD_ONE_TO_ELAPSED_SECONDS,
                            actionTypes.SET_ERROR_MESSAGE_TO_TIME_RAN_OUT
                          ],
                          cond: guardTypes.THERE_IS_ONE_SECOND_LEFT
                        },
                        {
                          target: stateTypes.TIMER_ONGOING,
                          actions: actionTypes.ADD_ONE_TO_ELAPSED_SECONDS
                        }
                      ]
                    },
                    on: {
                      [eventTypes.KEY_PRESSED]: {
                        target: stateTypes.TIMER_STOPPED,
                        cond: guardTypes.PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER
                      },
                      [eventTypes.PAUSE_TIMER]: {
                        target: stateTypes.TIMER_PAUSED
                      }
                    }
                  },
                  [stateTypes.TIMER_PAUSED]: {
                    on: {
                      [eventTypes.RESUME_TIMER]: {
                        target: stateTypes.TIMER_ONGOING
                      }
                    }
                  },
                  [stateTypes.TIMER_STOPPED]: {}
                }
              }
            }
          },
          [stateTypes.EXERCISE_FINISHED_UNSUCCESSFULLY]: {}
        },
        on: {
          [eventTypes.EXERCISE_SELECTED]: {
            target: `#${IDs.MAIN_VIEW}.${stateTypes.EXERCISE_SELECTED}`,
            actions: actionTypes.SET_EXERCISE_DATA
          }
        }
      }
    },
    on: {
      [eventTypes.USER_DATA_RELOADED]: {
        actions: actionTypes.SET_USER_DATA
      },
      [eventTypes.LOG_OUT]: {
        target: stateTypes.WELCOME_VIEW
        // TODO clear user data
        //actions: actionTypes.CLEAR_USER_DATA
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
          lessonNumber,
          isKeyboardVisible,
          isTutorActive,
          exerciseMinimumSpeed
        } = event as ExerciseSelectedEvent;

        return {
          exerciseNumber,
          lessonCategory,
          selectedLessonText,
          lessonNumber,
          isTutorActiveForThisExercise: isTutorActive,
          isKeyboardVisibleForThisExercise: isKeyboardVisible,
          minimumWPMNeededToCompleteExerciseSuccessfully: exerciseMinimumSpeed
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
      })),
      [actionTypes.ADD_ONE_TO_ELAPSED_SECONDS]: assign((ctx) => ({
        elapsedSeconds: ctx.elapsedSeconds + 1
      })),
      [actionTypes.RESET_ELAPSED_TIME_TO_0]: assign((_) => ({
        elapsedSeconds: 0
      })),
      [actionTypes.CALCULATE_GROSS_KEYWORDS_TYPED]: assign((ctx) => ({
        totalNetKeystrokes: totalNetKeystrokesTyped(
          ctx.exerciseCursorPosition,
          ctx.errors
        )
      })),
      [actionTypes.CALCULATE_NET_KEYWORDS_TYPED]: assign((ctx) => ({
        totalGrossKeystrokes: totalGrossKeystrokesTyped(
          ctx.exerciseCursorPosition,
          ctx.errors
        )
      })),
      [actionTypes.INCREASE_ERRORS_BY_ONE]: assign((ctx) => ({
        errors: ctx.errors + 1
      })),
      [actionTypes.RESET_GROSS_KEYWORDS_TYPED_TO_0]: assign((_) => ({
        totalGrossKeystrokes: 0
      })),
      [actionTypes.RESET_NET_KEYWORDS_TYPED_TO_0]: assign((_) => ({
        totalNetKeystrokes: 0
      })),
      [actionTypes.RESET_ERRORS_TO_0]: assign((_) => ({
        errors: 0
      })),
      [actionTypes.SET_USER_DATA]: assign((_, e) => {
        const {
          userName,
          errorsCoefficient,
          timeLimitInSeconds,
          isKeyboardGloballyVisible,
          isTutorGloballyActive,
          minimumWPM
        } = e as UserDataLoadedEvent;
        return {
          userName,
          errorsCoefficient,
          timeLimitInSeconds,
          isKeyboardGloballyVisible,
          isTutorGloballyActive,
          minSpeed: minimumWPM
        };
      }),
      [actionTypes.SET_ERROR_MESSAGE_TO_TIME_RAN_OUT]: assign((_) => ({
        exerciseFinishedUnsuccessfullyIncidenceMessage:
          "Ha superado el\nlimite de tiempo\nestablecido"
      })),
      [actionTypes.SET_ERROR_MESSAGE_TO_TOO_MANY_ERRORS]: assign((_) => ({
        exerciseFinishedUnsuccessfullyIncidenceMessage:
          "Ha superado el % maximo de errores permitidos"
      })),
      [actionTypes.SET_ERROR_MESSAGE_TO_TOO_SLOW]: assign((_) => ({
        exerciseFinishedUnsuccessfullyIncidenceMessage:
          "No ha superado la velocidad minima"
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
      [guardTypes.THERE_IS_ONE_SECOND_LEFT]: (ctx) => {
        return ctx.timeLimitInSeconds - ctx.elapsedSeconds === 1;
      },
      [guardTypes.PRESSED_A_MODIFIER_KEY]: (_, event) => {
        // https://www.w3.org/TR/uievents-key/#keys-modifier
        const modifierKeys = [
          "Alt",
          "AltGraph",
          "CapsLock",
          "Control",
          "Fn",
          "FnLock",
          "Meta",
          "NumLock",
          "ScrollLock",
          "Shift",
          "Symbol",
          "SymbolLock"
        ];

        // https://www.w3.org/TR/uievents-key/#keys-composition
        const IMEAndCompositionKeys = [
          "AllCandidates",
          "Alphanumeric",
          "CodeInput",
          "Compose",
          "Convert",
          "Dead",
          "FinalMode",
          "GroupFirst",
          "GroupLast",
          "GroupNext",
          "GroupPrevious",
          "ModeChange",
          "NextCandidate",
          "NonConvert",
          "PreviousCandidate",
          "Process",
          "SingleCandidate"
        ];

        const { pressedAltKey, pressedCtrlKey, key } = event as KeyPressedEvent;
        return (
          pressedAltKey ||
          pressedCtrlKey ||
          IMEAndCompositionKeys.some((k) => k === key) ||
          modifierKeys.some((k) => k === key) ||
          false
        );
      },
      [guardTypes.PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER]: (
        ctx,
        event
      ) => {
        const { key } = event as KeyPressedEvent;
        const pressedCorrectKey =
          key === ctx.selectedLessonText?.[ctx.exerciseCursorPosition];
        const isAtLastLetter = ctx.selectedLessonText
          ? ctx.selectedLessonText.length - 1 === ctx.exerciseCursorPosition
          : false;

        return pressedCorrectKey && isAtLastLetter;
      },
      [guardTypes.PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER_BUT_MADE_TOO_MANY_MISTAKES]:
        (ctx, event) => {
          const { key } = event as KeyPressedEvent;
          const pressedCorrectKey =
            key === ctx.selectedLessonText?.[ctx.exerciseCursorPosition];
          const isAtLastLetter = ctx.selectedLessonText
            ? ctx.selectedLessonText.length - 1 === ctx.exerciseCursorPosition
            : false;

          const madeTooManyMistakes =
            calculatePercentageOfErrors(
              ctx.errors,
              ctx.exerciseCursorPosition
            ) > (ctx.errorsCoefficient || ctx.defaultErrorsCoefficient);

          return pressedCorrectKey && isAtLastLetter && madeTooManyMistakes;
        },
      [guardTypes.PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER_BUT_WAS_TOO_SLOW]:
        (ctx, event) => {
          const { key } = event as KeyPressedEvent;
          const pressedCorrectKey =
            key === ctx.selectedLessonText?.[ctx.exerciseCursorPosition];
          const isAtLastLetter = ctx.selectedLessonText
            ? ctx.selectedLessonText.length - 1 === ctx.exerciseCursorPosition
            : false;

          const calcNetWPM = (
            typedEntries: number,
            seconds: number,
            errors: number
          ): number => (typedEntries / 5 - errors) / (seconds / 60);

          const wasTooSlow =
            +calcNetWPM(
              ctx.exerciseCursorPosition,
              ctx.elapsedSeconds,
              ctx.errors
            ).toFixed(0) <
            (ctx.minSpeed ||
              ctx.minimumWPMNeededToCompleteExerciseSuccessfully);

          return pressedCorrectKey && isAtLastLetter && wasTooSlow;
        }
    }
  }
);
