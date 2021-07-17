import { useState, useEffect } from "react";
import "./styles.css";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import {
  stateMachine,
  eventTypes,
  EXERCISE_CURSOR_POSITION,
  stateTypes
} from "./stateMachine";
import { useMachine } from "@xstate/react";
const electron = window?.require?.("electron");
// const electron = require("electron");
// import * as electron from "electron";

// import {} from "ramda"

// ------------------- ENUMS -------------------

const KEY_FINGER_COLORS = {
  PINKY: "#ffffc0",
  RING_FINGER: "#c0ffc0",
  MIDDLE_FINGER: "#c0ffff",
  INDEX_LEFT_HAND: "#ffc0ff",
  INDEX_RIGHT_HAND: "#ff96ff"
};

const BACKSPACE = "Backspace";
const WPM = (typedEntries: number, mins: number) => typedEntries / 5 / mins;
// ----------------------------------

const useStyles = makeStyles({
  riseTitleText: {
    backgroundColor: "#c0c0c0",
    position: "absolute",
    display: "inline",
    top: 0,
    left: 7,
    textAlign: "center",
    transform: "translateY(-50%)",
    padding: "0 1px"
  },
  enterBottom: ({
    isTutorActive,
    isEnterHighlighted
  }: {
    isTutorActive: boolean;
    isEnterHighlighted: boolean;
  }) => ({
    position: "relative",
    "&::after": {
      content: "''",
      position: "absolute",
      right: -3,
      left: -3,
      top: 0,
      bottom: 10,
      backgroundColor: isEnterHighlighted
        ? "#ff8080"
        : isTutorActive
        ? KEY_FINGER_COLORS.PINKY
        : "#e0e0e0",
      borderLeft: "3px solid #808080",
      borderRight: "3px solid #808080",
      transform: "translateY(-65%)"
    }
  })
});

const WelcomeMessage = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "grid",
      placeItems: "center"
    }}
  >
    Bienvenido a MecaMatic 3.0
  </div>
);

export default function App() {
  const [state, send] = useMachine(stateMachine);
  const [startedTyping, setStartedTyping] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const {
    selectedLessonText,
    isTutorActive = true, // TODO: if no exercise is selected then default to true
    exerciseNumber,
    lessonCategory,
    exerciseCursorPosition,
    lessonNumber,
    errorsCoefficient,
    minimumWPMNeededToCompleteExerciseSuccessfully
  } = state.context;
  const classes = useStyles({
    isTutorActive,
    isEnterHighlighted:
      exerciseCursorPosition === EXERCISE_CURSOR_POSITION.NOT_STARTED &&
      !!selectedLessonText
  });

  useEffect(() => {
    let timer1 = setInterval(() => {
      if (startedTyping) {
        setSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, [startedTyping]);

  useEffect(() => {
    electron?.ipcRenderer?.on(
      "exercise",
      (
        event,
        {
          category,
          exercise,
          isKeyboardVisible,
          isTutorActive,
          lesson,
          text
        }: {
          text: string;
          isTutorActive: boolean;
          isKeyboardVisible: boolean;
          category: "Practica" | "Aprendizaje";
          lesson: number;
          exercise: number;
        }
      ) => {
        send({
          type: eventTypes.EXERCISE_SELECTED,
          selectedLessonText: text,
          lessonCategory: category,
          lessonNumber: lesson,
          exerciseNumber: exercise
        });
      }
    );
  }, [send]);

  return (
    <div
      onKeyDown={({
        key: keyPressed
        //  code: keyCode
      }) => {
        send({ type: eventTypes.KEY_PRESSED, key: keyPressed });
      }}
      tabIndex={0}
      style={{
        backgroundColor: "#c0c0c0",
        padding: "10px 0px 0px 25px",
        display: "flex",
        gap: 15,
        minHeight: "100vh"
      }}
    >
      {/* {JSON.stringify(state.context)} */}
      {/* {seconds} Seconds <br />
      WPM: {WPM(currentLetter, seconds / 60).toFixed(0)} */}
      <div>
        <div
          style={{
            backgroundColor: "#008282",
            color: "white",
            // resize: "both",
            overflow: "auto",
            height: 210,
            width: 570,
            fontSize: "1.5rem",
            border: "thin solid",
            borderStyle: "inset"
            // fontSize: "1.2rem",
            // padding: 15,
          }}
        >
          {selectedLessonText ? (
            <div style={{ padding: 4 }}>
              {Array.from(selectedLessonText).map((letter, i) => (
                <span
                  key={i}
                  style={{
                    color: exerciseCursorPosition > i ? "black" : "",
                    backgroundColor:
                      exerciseCursorPosition === i ? "#ff8a7e" : "transparent",
                    whiteSpace: "break-spaces"
                    // minWidth: 13
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          ) : (
            <WelcomeMessage />
          )}
        </div>

        {/* Keyboard */}
        <div
          style={{
            width: 570,
            height: 208,
            marginTop: 40,
            border: "9px solid #808080",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: 8,
            fontWeight: "bold",
            userSelect: "none"
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            <Key
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      fontSize: "0.8rem",
                      left: 4,
                      top: -4
                    }}
                  >
                    a
                  </p>
                  <p style={{ position: "absolute", left: 4, top: 11 }}>°</p>
                  <p
                    style={{
                      position: "absolute",
                      left: 16,
                      top: 7,
                      fontSize: "0.9rem"
                    }}
                  >
                    \
                  </p>
                </div>
              }
            />
            <Key
              isHighlighted={["1", "!"].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: -3,
                      fontSize: "0.8rem"
                    }}
                  >
                    !
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 4,
                      top: 10,
                      fontSize: "0.7rem"
                    }}
                  >
                    1
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 18,
                      top: 6,
                      fontSize: "0.8rem"
                    }}
                  >
                    |
                  </p>
                </div>
              }
            />
            <Key
              isHighlighted={["2", `"`].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.RING_FINGER : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p style={{ position: "absolute", left: 5, top: -2 }}>"</p>
                  <p
                    style={{
                      position: "absolute",
                      left: 4,
                      top: 8,
                      fontSize: "0.8rem"
                    }}
                  >
                    2
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 14,
                      top: 8,
                      fontSize: "0.6rem"
                    }}
                  >
                    @
                  </p>
                </div>
              }
            />
            <Key
              isHighlighted={["3", `#`].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p style={{ position: "absolute", left: 5, top: -10 }}>.</p>
                  <p
                    style={{
                      position: "absolute",
                      left: 4,
                      top: 7,
                      fontSize: "0.8rem"
                    }}
                  >
                    3
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 16,
                      top: 8,
                      fontSize: "0.7rem"
                    }}
                  >
                    #
                  </p>
                </div>
              }
            />
            <Key
              isHighlighted={["4", `$`].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      left: 6,
                      top: -3,
                      fontSize: "0.8rem"
                    }}
                  >
                    $
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: 9,
                      fontSize: "0.8rem"
                    }}
                  >
                    4
                  </p>
                </div>
              }
            />
            <Key
              isHighlighted={["5", `%`].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: -3,
                      fontSize: "0.7rem"
                    }}
                  >
                    %
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: 9,
                      fontSize: "0.8rem"
                    }}
                  >
                    5
                  </p>
                </div>
              }
            />
            <Key
              isHighlighted={["6", `&`].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: -3,
                      fontSize: "1.3rem"
                    }}
                  >
                    °
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 6,
                      top: 9,
                      fontSize: "0.8rem"
                    }}
                  >
                    6
                  </p>
                </div>
              }
            />
            <Key
              isHighlighted={["7", `/`].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      left: 6,
                      top: -3,
                      fontSize: "0.8rem"
                    }}
                  >
                    /
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: 9,
                      fontSize: "0.8rem"
                    }}
                  >
                    7
                  </p>
                </div>
              }
            />
            <Key
              isHighlighted={["8", `(`].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: -3,
                      fontSize: "0.7rem"
                    }}
                  >
                    (
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: 9,
                      fontSize: "0.8rem"
                    }}
                  >
                    8
                  </p>
                </div>
              }
            />
            <Key
              isHighlighted={["9", `)`].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.RING_FINGER : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: -3,
                      fontSize: "0.7rem"
                    }}
                  >
                    )
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: 9,
                      fontSize: "0.8rem"
                    }}
                  >
                    9
                  </p>
                </div>
              }
            />
            <Key
              isHighlighted={["0", `=`].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: -3,
                      fontSize: "0.7rem"
                    }}
                  >
                    =
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: 9,
                      fontSize: "0.8rem"
                    }}
                  >
                    0
                  </p>
                </div>
              }
            />
            <Key
              isHighlighted={["?", "'", "\\"].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: -2,
                      fontSize: "0.8rem"
                    }}
                  >
                    ?
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: 14,
                      fontSize: "0.8rem"
                    }}
                  >
                    '
                  </p>
                </div>
              }
            />
            <Key
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              isHighlighted={["¿", "¡"].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: -6,
                      fontSize: "0.8rem"
                    }}
                  >
                    ¿
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 8,
                      top: 8,
                      fontSize: "0.7rem"
                    }}
                  >
                    ¡
                  </p>
                </div>
              }
            />
            <Key
              style={{
                width: 68,
                textAlign: "left",
                paddingLeft: 4,
                fontSize: "1.1rem"
              }}
              letter={<div style={{ marginTop: -5 }}>&larr;</div>}
            />
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            <Key
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              style={{
                width: 48,
                fontSize: "1.1em",
                textAlign: "left",
                paddingLeft: 5,
                paddingTop: 0
              }}
              letter="&#11134;"
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "q"
              }
              letter="Q"
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "w"
              }
              letter="W"
              color={isTutorActive ? KEY_FINGER_COLORS.RING_FINGER : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "e"
              }
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    width: "100%",
                    height: "100%"
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      left: 4,
                      top: 0,
                      fontSize: "1rem"
                    }}
                  >
                    E
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      bottom: 1,
                      right: 2,
                      fontSize: "0.7rem"
                    }}
                  >
                    &euro;
                  </p>
                </div>
              }
              color={isTutorActive ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "r"
              }
              letter="R"
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "t"
              }
              letter="T"
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "y"
              }
              letter="Y"
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "u"
              }
              letter="U"
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "i"
              }
              letter="I"
              color={isTutorActive ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "o"
              }
              letter="O"
              color={isTutorActive ? KEY_FINGER_COLORS.RING_FINGER : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "p"
              }
              letter="P"
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
            />
            <Key
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p style={{ position: "absolute", left: 5, top: 1 }}>^</p>
                  <p style={{ position: "absolute", left: 6, top: 13 }}>`</p>
                  <p
                    style={{
                      position: "absolute",
                      left: 16,
                      top: 8,
                      fontSize: "0.7rem"
                    }}
                  >
                    {"["}
                  </p>
                </div>
              }
            />
            <Key
              isHighlighted={["+", "*", "~"].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p style={{ position: "absolute", left: 5, top: 0 }}>*</p>
                  <p style={{ position: "absolute", left: 4, top: 7 }}>+</p>
                  <p
                    style={{
                      position: "absolute",
                      left: 18,
                      top: 8,
                      fontSize: "0.7rem"
                    }}
                  >
                    {"]"}
                  </p>
                </div>
              }
            />
            <Key
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              isHighlighted={
                exerciseCursorPosition ===
                  EXERCISE_CURSOR_POSITION.NOT_STARTED && !!selectedLessonText
              }
              style={{
                width: 52,
                fontSize: "0.7rem",
                display: "grid",
                placeItems: "center",
                paddingBottom: 4
              }}
              letter="Enter"
            />
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            <Key
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              style={{
                width: 59,
                fontSize: "0.9rem",
                textAlign: "left",
                padding: 4
              }}
              letter="Mayús"
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "a"
              }
              letter="A"
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "s"
              }
              letter="S"
              color={isTutorActive ? KEY_FINGER_COLORS.RING_FINGER : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "d"
              }
              letter="D"
              color={isTutorActive ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "f"
              }
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
              letter={
                <div style={{ lineHeight: 0.3, paddingTop: 5 }}>
                  F <br /> _
                </div>
              }
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "g"
              }
              letter="G"
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "h"
              }
              letter="H"
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "j"
              }
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
              letter={
                <div style={{ lineHeight: 0.3, paddingTop: 5 }}>
                  J <br /> _
                </div>
              }
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "k"
              }
              letter="K"
              color={isTutorActive ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "l"
              }
              letter="L"
              color={isTutorActive ? KEY_FINGER_COLORS.RING_FINGER : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "ñ"
              }
              letter="Ñ"
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "{"
              }
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p style={{ position: "absolute", left: 6, top: 2 }}>¨</p>
                  <p style={{ position: "absolute", left: 4, top: 13 }}>´</p>
                  <p
                    style={{
                      position: "absolute",
                      left: 16,
                      top: 8,
                      fontSize: "0.7rem"
                    }}
                  >
                    {"{"}
                  </p>
                </div>
              }
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "}"
              }
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              letter={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      left: 5,
                      top: -3,
                      fontSize: "0.8rem"
                    }}
                  >
                    ç
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      left: 16,
                      top: 4,
                      fontSize: "0.8rem"
                    }}
                  >
                    {"}"}
                  </p>
                </div>
              }
            />
            <Key
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              className={classes.enterBottom}
              style={{ width: 41, paddingTop: 7 }}
              letter="&crarr;"
              isHighlighted={
                exerciseCursorPosition ===
                  EXERCISE_CURSOR_POSITION.NOT_STARTED && !!selectedLessonText
              }
            />
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            <Key
              isHighlighted={[";", ":", "_"].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              style={{
                width: 44,
                fontSize: "0.9rem",
                textAlign: "left",
                padding: 4
              }}
              letter="&#8679;"
            />
            <Key
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              isHighlighted={["<", ">"].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              letter={
                <div style={{ lineHeight: 0.65 }}>
                  &gt; <br /> &lt;
                </div>
              }
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "z"
              }
              letter="Z"
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "x"
              }
              letter="X"
              color={isTutorActive ? KEY_FINGER_COLORS.RING_FINGER : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "c"
              }
              letter="C"
              color={isTutorActive ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "v"
              }
              letter="V"
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "b"
              }
              letter="B"
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "n"
              }
              letter="N"
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition]?.toLowerCase() ===
                "m"
              }
              letter="M"
              color={isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
            />
            <Key
              isHighlighted={[",", ";"].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
              letter={
                <div
                  style={{
                    lineHeight: 0.65,
                    fontSize: "0.85rem",
                    textAlign: "left",
                    paddingLeft: 6
                  }}
                >
                  ;<br /> ,
                </div>
              }
            />
            <Key
              isHighlighted={[".", ":"].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.RING_FINGER : ""}
              letter={
                <div
                  style={{
                    lineHeight: 0.65,
                    fontSize: "0.85rem",
                    textAlign: "left",
                    paddingLeft: 6
                  }}
                >
                  :<br /> .
                </div>
              }
            />
            <Key
              isHighlighted={["-", "_"].some(
                (char) => selectedLessonText?.[exerciseCursorPosition] === char
              )}
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              letter={
                <div
                  style={{
                    lineHeight: 1.2,
                    fontSize: "0.9rem",
                    textAlign: "left",
                    paddingLeft: 6,
                    marginTop: -8
                  }}
                >
                  _<br /> -
                </div>
              }
            />
            <Key
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition] === ">"
              }
              color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
              style={{
                width: 93,
                fontSize: "0.9rem",
                textAlign: "left",
                padding: 4
              }}
              letter="&#8679;"
            />
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            <Key
              style={{
                width: 52,
                fontSize: "0.8rem",
                textAlign: "left",
                padding: 4,
                paddingTop: 6
              }}
              letter="Ctrl"
            />
            <Key
              style={{
                width: 52
              }}
            />
            <Key
              style={{
                width: 52,
                textAlign: "left",
                fontSize: "0.8rem",
                padding: 4,
                paddingTop: 6
              }}
              letter="Alt"
            />
            <Key
              style={{ width: 159 }}
              isHighlighted={
                selectedLessonText?.[exerciseCursorPosition] === " "
              }
              color={isTutorActive ? "#ffc0c0" : ""}
            />
            <Key
              style={{
                width: 48,
                textAlign: "left",
                fontSize: "0.75rem",
                padding: 4,
                paddingTop: 6
              }}
              letter="AltGr"
            />
            <Key style={{ width: 48 }} />
            <Key style={{ width: 48 }} />
            <Key
              style={{
                width: 52,
                fontSize: "0.8rem",
                textAlign: "left",
                padding: 4,
                paddingTop: 6
              }}
              letter="Ctrl"
            />
          </div>
        </div>
      </div>

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
          <div className={classes.riseTitleText}>Alumno y nivel actual</div>
          <br />
          <div>
            Lucas
            <br />
            {state.matches(stateTypes.EXERCISE_SELECTED) && (
              <div style={{ marginTop: 8 }}>
                {lessonCategory === "learning" && "Aprendizaje"}
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
          <div className={classes.riseTitleText}>Incidencias</div>
          {!state.matches(stateTypes.EXERCISE_SELECTED) && (
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
              Seleccione un ejercicio
            </div>
          )}

          {state.matches({
            [stateTypes.EXERCISE_SELECTED]: stateTypes.EXERCISE_FINISHED
          }) && (
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
              Ha realizado el ejercicio con exito
            </div>
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
          <div className={classes.riseTitleText}>Valores establecidos</div>
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
                {minimumWPMNeededToCompleteExerciseSuccessfully}
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
          <div className={classes.riseTitleText}>Resultados obtenidos</div>
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
                14
              </div>
            </div>
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
                10
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
                1
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
                7.1
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
                210
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
            00:12
          </div>
        </div>
      </div>
    </div>
  );
}

// function Key({ letter, color, isSelected = false }) {
//   return (
//     <div
//       className={isSelected ? "key-pressed" : ""}
//       style={{
//         width: "2rem",
//         height: "2rem",
//         backgroundColor: color,
//         padding: "0.2rem",
//         display: "flex",
//         justifyContent: "center",
//         border: "3px solid #808080",
//         borderRadius: "4px",
//         margin: "3px"
//       }}
//     >
//       {letter}
//     </div>
//   );
// }

interface KeyProps {
  letter?: React.ReactElement | string;
  color?: string;
  isSelected?: boolean;
  isHighlighted?: boolean;
  style?: React.CSSProperties | null;
}

function Key({
  color,
  letter,
  style,
  isHighlighted,
  ...otherProps
}: KeyProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...otherProps}
      style={{
        backgroundColor: isHighlighted ? "#ff8080" : color || "#e0e0e0",
        width: 32,
        height: 32,
        border: "3px solid #808080",
        borderRadius: "4px",
        textAlign: "center",
        paddingTop: 3,
        ...style
      }}
    >
      {letter}
    </div>
  );
}
