import { State } from "xstate";
import { stateEvents, stateTypes } from "../../globalStateMachine/stateMachine";
import { stateContext } from "../../globalStateMachine/context";
import { cond, always, complement, T } from "ramda";
import { isValidNumber } from "ramda-adjunct";

const calcWhatPercentageOfANumberIsAnotherNumber = (
  number: number,
  anotherNumber: number
) => (number / anotherNumber) * 100;

const isWholeNumber = (num: number) => num % 1 === 0;

function calculatePercentageOfErrors(
  errors: number,
  totalAmount: number | null | undefined
): string {
  if (!totalAmount) return "";

  const errorsPercentage = calcWhatPercentageOfANumberIsAnotherNumber(
    errors,
    totalAmount
  );

  const res = cond([
    [complement(isValidNumber), always(0)],
    [isWholeNumber, always(errorsPercentage)],
    [T, (num: number): string => num.toFixed(2)]
  ])(errorsPercentage);

  return res + "";
}

const calcNetKeystrokesTyped = (totalKeystrokes: number, errors: number) =>
  totalKeystrokes - errors;

const calcGrossKeystrokesTyped = (totalKeystrokes: number, errors: number) =>
  totalKeystrokes + errors;

const calcNetWPM = (
  typedEntries: number,
  seconds: number,
  errors: number
): number => (typedEntries / 5 - errors) / (seconds / 60);

interface Props {
  state: State<
    stateContext,
    stateEvents,
    any,
    {
      value: any;
      context: stateContext;
    }
  >;
}

const RedBGIncidencesText: React.FC = ({ children }) => (
  <div
    style={{
      backgroundColor: "#ff8080",
      border: "2px solid",
      borderStyle: "inset",
      color: "white",
      height: "100%",
      width: "100%",
      padding: 5
    }}
  >
    {children}
  </div>
);

const riseTitleTextStyles = {
  backgroundColor: "#c0c0c0",
  position: "absolute" as "absolute",
  display: "inline",
  top: 0,
  left: 7,
  textAlign: "center" as "center",
  transform: "translateY(-50%)",
  padding: "0 1px"
};

// TODO: always show stats when in exercise_progress or finished, both successfully and unsuccessfully

// Pure component, the stateMachine isn't interacted with, no state is mutated
// only new values are obtained and shown locally from the state
function InfoPanel({ state }: Props) {
  const {
    incidentMessage,
    errorsCommitted,
    elapsedSeconds,
    exerciseCursorPosition,
    exerciseData
  } = state.context;

  const userData = state.context.userData ?? { // NOTE this is to serve as a placeholder for when no user data has loaded yet
    // TODO userSettings placeholder data with fixed variable
    userSettings: {
      timeLimit: 900, // 15 minutes default time limit
      errorsCoefficient: 2
    }
  };

  const { timeLimit: timeLimitInSeconds, errorsCoefficient } =
    userData.userSettings;

  const timeRemaining = {
    minutes: ~~((timeLimitInSeconds - elapsedSeconds) / 60),
    seconds: (timeLimitInSeconds - elapsedSeconds) % 60
  };

  const netKeyStrokes = exerciseCursorPosition
    ? calcNetKeystrokesTyped(exerciseCursorPosition, errorsCommitted)
    : null;

  const grossKeyStrokes = exerciseCursorPosition
    ? calcNetKeystrokesTyped(exerciseCursorPosition, errorsCommitted)
    : null;

  const percentageOfErrors = calculatePercentageOfErrors(
    errorsCommitted,
    exerciseCursorPosition
  );

  return (
    <div
      style={{
        minWidth: "175px",
        maxWidth: "175px",
        marginRight: 3,
        height: "100%",
        border: "2px solid",
        borderStyle: "inset",
        padding: "13px 8px",
        display: "flex",
        gap: 15,
        flexDirection: "column",
        userSelect: "none"
      }}
    >
      <div
        style={{
          border: "thin solid",
          borderStyle: "ridge",
          textAlign: "center",
          fontSize: "0.85rem",
          position: "relative",
          height: 81
        }}
      >
        <div style={riseTitleTextStyles}>Alumno y nivel actual</div>
        <br />
        <div>
          {userData?.userName}
          <br />
          {state.matches({
            [stateTypes.MAIN_VIEW]: stateTypes.EXERCISE_SELECTED
          }) && (
            <div style={{ marginTop: 8 }}>
              {exerciseData?.exerciseCategory}
              <br />
              {exerciseData?.lessonNumber &&
                `Lección ${exerciseData?.lessonNumber}`}{" "}
              {exerciseData?.exerciseNumber &&
                exerciseData?.lessonNumber &&
                "-"}{" "}
              {exerciseData?.exerciseNumber &&
                `Ejercicio ${exerciseData?.exerciseNumber}`}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          border: "thin solid",
          borderStyle: "ridge",
          textAlign: "center",
          fontSize: "0.85rem",
          position: "relative",
          height: 81,
          padding: 6,
          paddingTop: 12
        }}
      >
        <div style={riseTitleTextStyles}>Incidencias</div>
        {state.matches({
          [stateTypes.MAIN_VIEW]: stateTypes.EXERCISE_NOT_SELECTED
        }) && (
          <RedBGIncidencesText>Seleccione un ejercicio</RedBGIncidencesText>
        )}

        {state.matches({
          [stateTypes.MAIN_VIEW]: {
            [stateTypes.EXERCISE_SELECTED]: {
              [stateTypes.EXERCISE_PROGRESS]: stateTypes.EXERCISE_FINISHED
            }
          }
        }) && (
          <RedBGIncidencesText>
            Ha realizado el ejercicio con exito
          </RedBGIncidencesText>
        )}

        {state.matches({
          [stateTypes.MAIN_VIEW]: stateTypes.EXERCISE_FINISHED_UNSUCCESSFULLY
        }) && <RedBGIncidencesText>{incidentMessage}</RedBGIncidencesText>}
      </div>

      <div
        style={{
          border: "thin solid",
          borderStyle: "ridge",
          textAlign: "center",
          fontSize: "0.85rem",
          position: "relative",
          height: 67,
          padding: 6,
          paddingTop: 12
        }}
      >
        <div style={riseTitleTextStyles}>Valores establecidos</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{ display: "flex", width: "100%", textAlign: "left" }}
            title="Coeficiente máximo de errores permitidos %"
          >
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "70%"
              }}
            >
              Coefi. m.e.p
            </div>
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "30%",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "0.8rem"
              }}
            >
              {errorsCoefficient}&nbsp;%
            </div>
          </div>

          <div
            style={{ display: "flex", width: "100%", textAlign: "left" }}
            title="Velocidad minima para realizar el ejercicio"
          >
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "70%"
              }}
            >
              Velocidad
            </div>
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "30%",
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              {/* // TODO replace magic number with number from an enum globalDefaults */}
              {userData?.userSettings.minWPM || exerciseData?.minWPM || 20}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          border: "thin solid",
          borderStyle: "ridge",
          textAlign: "center",
          fontSize: "0.85rem",
          position: "relative",
          height: 150,
          padding: 6,
          paddingTop: 19
        }}
      >
        <div style={riseTitleTextStyles}>Resultados obtenidos</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{ display: "flex", width: "100%", textAlign: "left" }}
            title="Pulsaciones brutas realizadas"
          >
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "70%"
              }}
            >
              P. Brutas
            </div>
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "30%",
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              {[
                {
                  [stateTypes.MAIN_VIEW]: {
                    [stateTypes.EXERCISE_SELECTED]: {
                      [stateTypes.EXERCISE_PROGRESS]:
                        stateTypes.EXERCISE_ONGOING
                    }
                  }
                },
                {
                  [stateTypes.MAIN_VIEW]: {
                    [stateTypes.EXERCISE_SELECTED]: {
                      [stateTypes.EXERCISE_PROGRESS]:
                        stateTypes.EXERCISE_FINISHED
                    }
                  }
                },
                {
                  [stateTypes.MAIN_VIEW]:
                    stateTypes.EXERCISE_FINISHED_UNSUCCESSFULLY
                }
              ].some(state.matches) && grossKeyStrokes}
            </div>
          </div>
          <div
            style={{ display: "flex", width: "100%", textAlign: "left" }}
            title="Pulsaciones netas realizadas"
          >
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "70%"
              }}
            >
              P. Netas
            </div>
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "30%",
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              {[
                {
                  [stateTypes.MAIN_VIEW]: {
                    [stateTypes.EXERCISE_SELECTED]: {
                      [stateTypes.EXERCISE_PROGRESS]:
                        stateTypes.EXERCISE_ONGOING
                    }
                  }
                },
                {
                  [stateTypes.MAIN_VIEW]: {
                    [stateTypes.EXERCISE_SELECTED]: {
                      [stateTypes.EXERCISE_PROGRESS]:
                        stateTypes.EXERCISE_FINISHED
                    }
                  }
                },
                {
                  [stateTypes.MAIN_VIEW]:
                    stateTypes.EXERCISE_FINISHED_UNSUCCESSFULLY
                }
              ].some(state.matches) && netKeyStrokes}
            </div>
          </div>

          <div
            style={{ display: "flex", width: "100%", textAlign: "left" }}
            title="Errores cometidos"
          >
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "70%"
              }}
            >
              Errores
            </div>
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "30%",
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              {[
                {
                  [stateTypes.MAIN_VIEW]: {
                    [stateTypes.EXERCISE_SELECTED]: {
                      [stateTypes.EXERCISE_PROGRESS]:
                        stateTypes.EXERCISE_ONGOING
                    }
                  }
                },
                {
                  [stateTypes.MAIN_VIEW]: {
                    [stateTypes.EXERCISE_SELECTED]: {
                      [stateTypes.EXERCISE_PROGRESS]:
                        stateTypes.EXERCISE_FINISHED
                    }
                  }
                },
                {
                  [stateTypes.MAIN_VIEW]:
                    stateTypes.EXERCISE_FINISHED_UNSUCCESSFULLY
                }
              ].some(state.matches) && errorsCommitted}
            </div>
          </div>

          <div
            style={{ display: "flex", width: "100%", textAlign: "left" }}
            title="Porcentage de errores cometidos"
          >
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "70%"
              }}
            >
              % Errores
            </div>
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "30%",
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              {[
                {
                  [stateTypes.MAIN_VIEW]: {
                    [stateTypes.EXERCISE_SELECTED]: {
                      [stateTypes.EXERCISE_PROGRESS]:
                        stateTypes.EXERCISE_ONGOING
                    }
                  }
                },
                {
                  [stateTypes.MAIN_VIEW]: {
                    [stateTypes.EXERCISE_SELECTED]: {
                      [stateTypes.EXERCISE_PROGRESS]:
                        stateTypes.EXERCISE_FINISHED
                    }
                  }
                },
                {
                  [stateTypes.MAIN_VIEW]:
                    stateTypes.EXERCISE_FINISHED_UNSUCCESSFULLY
                }
              ].some(state.matches) && percentageOfErrors}
            </div>
          </div>

          <div
            style={{ display: "flex", width: "100%", textAlign: "left" }}
            title="Pulsaciones por minuto realizadas"
          >
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "70%"
              }}
            >
              P. p. m.
            </div>
            <div
              style={{
                background: "#e0e0e0",
                border: "2px solid",
                borderStyle: "inset",
                padding: "1px 4px",
                width: "30%",
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              {[
                {
                  [stateTypes.MAIN_VIEW]: {
                    [stateTypes.EXERCISE_SELECTED]: {
                      [stateTypes.EXERCISE_PROGRESS]:
                        stateTypes.EXERCISE_ONGOING
                    }
                  }
                },
                {
                  [stateTypes.MAIN_VIEW]: {
                    [stateTypes.EXERCISE_SELECTED]: {
                      [stateTypes.EXERCISE_PROGRESS]:
                        stateTypes.EXERCISE_FINISHED
                    }
                  }
                },
                {
                  [stateTypes.MAIN_VIEW]:
                    stateTypes.EXERCISE_FINISHED_UNSUCCESSFULLY
                }
              ].some(state.matches) &&
                ((exerciseCursorPosition! > 0 &&
                  elapsedSeconds > 0 &&
                  Math.max(
                    +calcNetWPM(
                      exerciseCursorPosition!,
                      elapsedSeconds,
                      errorsCommitted
                    ).toFixed(0),
                    0
                  )) ||
                  0)}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{ display: "flex", width: "100%", padding: "0 7px" }}
        title="Tiempo disponible para realizar el ejercicio"
      >
        <div
          style={{
            background: "#e0e0e0",
            border: "2px solid",
            borderStyle: "inset",
            padding: "1px 4px",
            fontSize: "0.85rem",
            width: "60%",
            paddingTop: 2
          }}
        >
          Tiempo dis.
        </div>
        <div
          style={{
            background: "#e0e0e0",
            border: "2px solid",
            borderStyle: "inset",
            width: "40%",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "0.9rem",
            paddingTop: 1
          }}
        >
          {timeRemaining.minutes <= 9
            ? `0${timeRemaining.minutes}`
            : timeRemaining.minutes}
          :
          {timeRemaining.seconds <= 9
            ? `0${timeRemaining.seconds}`
            : timeRemaining.seconds}
        </div>
      </div>
    </div>
  );
}

export default InfoPanel;
