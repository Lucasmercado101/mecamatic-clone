import { State } from "xstate";
import { stateContext, stateEvents, stateTypes } from "../../stateMachine";

function calculatePercentageOfErrors(
  errors: number,
  totalAmount: number
): number {
  return (errors / totalAmount) * 100;
}

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
    userName,
    lessonCategory,
    lessonNumber,
    exerciseNumber,
    exerciseFinishedUnsuccessfullyIncidenceMessage,
    minSpeed,
    minimumWPMNeededToCompleteExerciseSuccessfully,
    totalNetKeystrokes,
    totalGrossKeystrokes,
    errors,
    exerciseCursorPosition,
    elapsedSeconds,
    timeLimitInSeconds
  } = state.context;

  const errorsCoefficient = state.context.errorsCoefficient ?? 2;

  const percentageOfErrors = calculatePercentageOfErrors(
    errors,
    exerciseCursorPosition
  );

  // check if percentageOfErrors is a whole number, if it
  // is then return the whole number, otherwise return the number with 1 decimal
  const percentageOfErrorsAsNumber =
    isNaN(percentageOfErrors) || percentageOfErrors === Infinity
      ? 0
      : percentageOfErrors % 1 === 0
      ? percentageOfErrors
      : percentageOfErrors.toFixed(1);

  const timeLimitMinutes = ~~((timeLimitInSeconds - elapsedSeconds) / 60);
  const timeLimitSeconds = (timeLimitInSeconds - elapsedSeconds) % 60;

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
          {userName}
          <br />
          {state.matches({
            [stateTypes.MAIN_VIEW]: stateTypes.EXERCISE_SELECTED
          }) && (
            <div style={{ marginTop: 8 }}>
              {lessonCategory}
              <br />
              {lessonNumber && `Lección ${lessonNumber}`}{" "}
              {exerciseNumber && lessonNumber && "-"}{" "}
              {exerciseNumber && `Ejercicio ${exerciseNumber}`}
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
        }) && (
          <RedBGIncidencesText>
            {exerciseFinishedUnsuccessfullyIncidenceMessage}
          </RedBGIncidencesText>
        )}
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
              {minSpeed || minimumWPMNeededToCompleteExerciseSuccessfully}
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
                }
              ].some(state.matches) && totalGrossKeystrokes}
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
                }
              ].some(state.matches) && totalNetKeystrokes}
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
                }
              ].some(state.matches) && errors}
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
                }
              ].some(state.matches) && percentageOfErrorsAsNumber}
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
                }
              ].some(state.matches) &&
                ((exerciseCursorPosition > 0 &&
                  elapsedSeconds > 0 &&
                  Math.max(
                    +calcNetWPM(
                      exerciseCursorPosition,
                      elapsedSeconds,
                      errors
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
          {timeLimitMinutes <= 9 ? `0${timeLimitMinutes}` : timeLimitMinutes}:
          {timeLimitSeconds <= 9 ? `0${timeLimitSeconds}` : timeLimitSeconds}
        </div>
      </div>
    </div>
  );
}

export default InfoPanel;
