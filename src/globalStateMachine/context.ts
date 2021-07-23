/**
 * User settings, these override exercise's settings
 */
interface userSettings {
  /**
   * Minimum Words Per Minute needed to complete
   * any exercise successfully
   *
   * Overrides the exercise's minimum WPM speed requirement
   **/
  minWPM?: number;
  /**
   * Maximum amount of errors allowed (%)
   **/
  errorsCoefficient: number;
  /**
   * The time limit, in seconds, for the exercise
   *
   * Overrides the exercise's time limit
   */
  timeLimit: number;
  userName: string;
  isKeyboardVisible?: boolean;
  isTutorActive?: boolean;
  showResultsWhileDoingExercise: true;

  // TODO implement
  // showResultsWhileDoingExercise: boolean;
  // soundOnKeysTap: boolean;
  // soundOnError: boolean;
  // infoPanelOnTheLeft: boolean;
}

/**
 * Selected exercises' data
 */
interface exerciseData {
  text: string;
  exerciseCategory:
    | "Perfeccionamiento"
    | "Practica"
    | "Aprendizaje"
    | "Definido por el Usuario";
  // TODO user made lessons won't have a lesson number
  lessonNumber: number;
  exerciseNumber: number;
  /**
   * Minimum Words Per Minute needed to complete
   * the exercise successfully
   */
  minWPM: number;
  isTutorActive: boolean;
  isKeyboardVisible: boolean;
}

export interface stateContext {
  userSettings?: userSettings;
  exerciseData?: exerciseData;

  /**
   * On what letter of the exercise is it at
   *
   * @example
   * if (exerciseData?.text) {
   *    const position = exerciseData.text[exerciseCursorPosition]
   * }
   */
  exerciseCursorPosition?: number;
  /**
   * Message to be displayed in the info panel
   * if the user didn't complete the exercise in the time required
   * or completed it unsuccessfully
   */
  incidentMessage?: string;
  errorsCommitted: number;
  elapsedSeconds: number;
}
