import { useState, useEffect, useReducer } from "react";
import "./styles.css";
import { makeStyles } from "@material-ui/styles";
import {
  modelReducer,
  initialModel,
  ACTION_TYPE,
  SENTENCE_POSITION
} from "./model";
import React from "react";
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
    areKeysColored,
    isEnterHighlighted
  }: {
    areKeysColored: boolean;
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
        : areKeysColored
        ? KEY_FINGER_COLORS.PINKY
        : "#e0e0e0",
      borderLeft: "3px solid #808080",
      borderRight: "3px solid #808080",
      transform: "translateY(-65%)"
    }
  })
});

const sentenceTest = Array.from(
  `Es indispensable que el alumno practique al menos media hora todos los días. Si el alumno tuviera necesidad de dominar la mecanografía rápidamente, deberá aumentar este tiempo a una o dos horas diarias, en cuyo caso el tiempo necesario para escribir con rapidez y precisión disminuirá proporcionalmente al tiempo y el esfuerzo empleado.
  Lo que desde luego es imprescindible, es escribir todos los días, para adquirir cualquier habilidad se precisa tiempo y constancia.`
  // "la casa de casa la casa de casa la casa de casa la casa de casa la casa de casa la casa de casa la casa de casa"
);

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
  const [state, dispatch] = useReducer(modelReducer, initialModel);
  const [currentLetter, setCurrentLetter] = useState(0);
  const [keyPressed, setKeyPressed] = useState<null | string>(null);
  const [startedTyping, setStartedTyping] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const { areKeysColored, exerciseSelected, sentenceCursorPosition } = state;
  const classes = useStyles({
    areKeysColored,
    isEnterHighlighted: sentenceCursorPosition === SENTENCE_POSITION.NOT_STARTED
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
    electron?.ipcRenderer?.on("lesson-1-exercise-1", (event, lessonText) => {
      dispatch({
        type: ACTION_TYPE.LESSON_SELECTED,
        payload: { selectedLessonText: lessonText }
      });
    });
    electron?.ipcRenderer?.on("lesson-1-exercise-2", (event, lessonText) => {
      dispatch({
        type: ACTION_TYPE.LESSON_SELECTED,
        payload: { selectedLessonText: lessonText }
      });
    });
    electron?.ipcRenderer?.on("lesson-1-exercise-3", (event, lessonText) => {
      dispatch({
        type: ACTION_TYPE.LESSON_SELECTED,
        payload: { selectedLessonText: lessonText }
      });
    });
  }, []);

  return (
    <div
      onKeyDown={(e) => {
        const {
          key: keyPressed
          //  code: keyCode
        } = e;
        dispatch({ type: ACTION_TYPE.KEY_PRESSED, payload: { keyPressed } });
      }}
      tabIndex={0}
      style={{
        backgroundColor: "#c0c0c0",
        height: "100vh",
        padding: "10px 0px 0px 25px",
        display: "flex",
        gap: 15
      }}
    >
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
          {exerciseSelected ? (
            <div style={{ padding: 4 }}>
              {Array.from(exerciseSelected).map((letter, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor:
                      sentenceCursorPosition === i ? "#ff8a7e" : "transparent",
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
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.RING_FINGER : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.RING_FINGER : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
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
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "q"
              }
              letter="Q"
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "w"
              }
              letter="W"
              color={areKeysColored ? KEY_FINGER_COLORS.RING_FINGER : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
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
              color={areKeysColored ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "r"
              }
              letter="R"
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "t"
              }
              letter="T"
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "y"
              }
              letter="Y"
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "u"
              }
              letter="U"
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "i"
              }
              letter="I"
              color={areKeysColored ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "o"
              }
              letter="O"
              color={areKeysColored ? KEY_FINGER_COLORS.RING_FINGER : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "p"
              }
              letter="P"
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
            />
            <Key
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
              isHighlighted={
                sentenceCursorPosition === SENTENCE_POSITION.NOT_STARTED
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
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
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
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "a"
              }
              letter="A"
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "s"
              }
              letter="S"
              color={areKeysColored ? KEY_FINGER_COLORS.RING_FINGER : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "d"
              }
              letter="D"
              color={areKeysColored ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "f"
              }
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
              letter={
                <div style={{ lineHeight: 0.3, paddingTop: 5 }}>
                  F <br /> _
                </div>
              }
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "g"
              }
              letter="G"
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "h"
              }
              letter="H"
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "j"
              }
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
              letter={
                <div style={{ lineHeight: 0.3, paddingTop: 5 }}>
                  J <br /> _
                </div>
              }
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "k"
              }
              letter="K"
              color={areKeysColored ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "l"
              }
              letter="L"
              color={areKeysColored ? KEY_FINGER_COLORS.RING_FINGER : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "ñ"
              }
              letter="Ñ"
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "{"
              }
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
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
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "}"
              }
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
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
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
              className={classes.enterBottom}
              style={{ width: 41, paddingTop: 7 }}
              letter="&crarr;"
              isHighlighted={
                sentenceCursorPosition === SENTENCE_POSITION.NOT_STARTED
              }
            />
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            <Key
              isHighlighted={[";", ":", "_"].some(
                (char) => exerciseSelected?.[sentenceCursorPosition] === char
              )}
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
              style={{
                width: 44,
                fontSize: "0.9rem",
                textAlign: "left",
                padding: 4
              }}
              letter="&#8679;"
            />
            <Key
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
              isHighlighted={["<", ">"].some(
                (char) => exerciseSelected?.[sentenceCursorPosition] === char
              )}
              letter={
                <div style={{ lineHeight: 0.65 }}>
                  &gt; <br /> &lt;
                </div>
              }
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "z"
              }
              letter="Z"
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "x"
              }
              letter="X"
              color={areKeysColored ? KEY_FINGER_COLORS.RING_FINGER : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "c"
              }
              letter="C"
              color={areKeysColored ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "v"
              }
              letter="V"
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "b"
              }
              letter="B"
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "n"
              }
              letter="N"
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
            />
            <Key
              isHighlighted={
                exerciseSelected?.[sentenceCursorPosition]?.toLowerCase() ===
                "m"
              }
              letter="M"
              color={areKeysColored ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""}
            />
            <Key
              isHighlighted={[",", ";"].some(
                (char) => exerciseSelected?.[sentenceCursorPosition] === char
              )}
              color={areKeysColored ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
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
                (char) => exerciseSelected?.[sentenceCursorPosition] === char
              )}
              color={areKeysColored ? KEY_FINGER_COLORS.RING_FINGER : ""}
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
                (char) => exerciseSelected?.[sentenceCursorPosition] === char
              )}
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
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
              isHighlighted={exerciseSelected?.[sentenceCursorPosition] === ">"}
              color={areKeysColored ? KEY_FINGER_COLORS.PINKY : ""}
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
              isHighlighted={exerciseSelected?.[sentenceCursorPosition] === " "}
              color="#ffc0c0"
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
          flexDirection: "column"
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
            {/* Aprendizaje
            <br />
            Lección 1 - Ejercicio 1 */}
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
            <div style={{ display: "flex", width: "100%", textAlign: "left" }}>
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
                  width: "30%"
                }}
              >
                2%
              </div>
            </div>

            <div style={{ display: "flex", width: "100%", textAlign: "left" }}>
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
                  width: "30%"
                }}
              ></div>
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
            <div style={{ display: "flex", width: "100%", textAlign: "left" }}>
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
                  width: "30%"
                }}
              ></div>
            </div>
            <div style={{ display: "flex", width: "100%", textAlign: "left" }}>
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
                  width: "30%"
                }}
              ></div>
            </div>

            <div style={{ display: "flex", width: "100%", textAlign: "left" }}>
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
                  width: "30%"
                }}
              ></div>
            </div>

            <div style={{ display: "flex", width: "100%", textAlign: "left" }}>
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
                  width: "30%"
                }}
              ></div>
            </div>

            <div style={{ display: "flex", width: "100%", textAlign: "left" }}>
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
                  width: "30%"
                }}
              ></div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", width: "100%", padding: "0 7px" }}>
          <div
            style={{
              background: "#e0e0e0",
              border: "2px solid",
              borderStyle: "inset",
              padding: "1px 4px",
              fontSize: "0.85rem",
              width: "60%"
            }}
          >
            Tiempo dis.
          </div>
          <div
            style={{
              background: "#e0e0e0",
              border: "2px solid",
              borderStyle: "inset",
              width: "40%"
            }}
          ></div>
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
