import { useEffect, useRef } from "react";
import { Event, EventData, SingleOrArray, State } from "xstate";
import {
  eventTypes,
  EXERCISE_CURSOR_POSITION,
  stateEvents,
  stateTypes
} from "../../globalStateMachine/stateMachine";
import { makeStyles } from "@material-ui/styles";
import TopToolbar from "./TopToolbar";
import InfoPanel from "./InfoPanel";
import { stateContext } from "../../globalStateMachine/context";
const electron = window?.require?.("electron");

enum KEY_FINGER_COLORS {
  PINKY = "#ffffc0",
  RING_FINGER = "#c0ffc0",
  MIDDLE_FINGER = "#c0ffff",
  INDEX_LEFT_HAND = "#ffc0ff",
  INDEX_RIGHT_HAND = "#ff96ff"
}

const useStyles = makeStyles({
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

const isCurrentlyOnChar = (
  char: string,
  exerciseText: string | null | undefined,
  cursorLocation: number | null | undefined
) => {
  if (!exerciseText || !cursorLocation) return false;
  return exerciseText[cursorLocation] === char;
};

interface Props {
  send: (
    event: SingleOrArray<Event<stateEvents>>,
    payload?: EventData | undefined
  ) => void;
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

function Index({ send, state }: Props) {
  useEffect(() => {
    electron.ipcRenderer.send("is-on-main-view");
  }, []);

  const myRef = useRef<null | HTMLElement>(null);
  const textContainerDiv = useRef<null | HTMLDivElement>(null);

  const executeScroll = () => myRef?.current?.scrollIntoView();

  const { exerciseData, exerciseCursorPosition } = state.context;

  const userData = state.context.userData ?? {
    // TODO get this from global placeholder variable
    // NOTE this is to serve as a placeholder for when no user data has loaded yet
    userSettings: { isTutorActive: null }
  };
  const isTutorActive =
    userData.userSettings.isTutorActive ?? exerciseData?.isTutorActive ?? false;

  useEffect(() => {
    if (textContainerDiv?.current) {
      textContainerDiv.current.scrollTop = 0;
    }
  }, [exerciseData?.text]);

  const classes = useStyles({
    isTutorActive,
    isEnterHighlighted: state.matches({
      [stateTypes.MAIN_VIEW]: {
        [stateTypes.EXERCISE_SELECTED]: {
          [stateTypes.EXERCISE_PROGRESS]: stateTypes.EXERCISE_NOT_STARTED
        }
      }
    })
  });

  return (
    <div
      onKeyDown={({ key, altKey, ctrlKey }) => {
        executeScroll();
        // NOTE "key" does not pick up dead key modifier keys ( "´" , "^", "`")
        send({
          type: eventTypes.KEY_PRESSED,
          key,
          pressedAltKey: altKey,
          pressedCtrlKey: ctrlKey
        });
      }}
      tabIndex={0}
      style={{
        backgroundColor: "#c0c0c0",
        display: "flex",
        minHeight: "100vh"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TopToolbar state={state} send={send} />
        <div style={{ display: "flex", gap: 15, padding: "10px 0px 0px 25px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              ref={textContainerDiv}
              style={{
                backgroundColor: "#008282",
                color: "white",
                overflow: "auto",
                height: 210,
                width: 570,
                border: "thin solid",
                borderStyle: "inset"
              }}
            >
              {state.matches({
                [stateTypes.MAIN_VIEW]: stateTypes.EXERCISE_NOT_SELECTED
              }) && (
                <div
                  style={{
                    fontSize: "1.5rem",
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center"
                  }}
                >
                  Bienvenido a MecaMatic 3.0
                </div>
              )}

              {state.matches({
                [stateTypes.MAIN_VIEW]: stateTypes.EXERCISE_SELECTED
              }) && (
                <div
                  style={{
                    fontSize: "1.3rem",
                    padding: 4
                  }}
                >
                  {/* // TODO handle what happens when exercise data hasn't loaded yet */}
                  {Array.from(exerciseData?.text || "").map((letter, i) => (
                    <span
                      key={i}
                      style={{
                        // TODO change so that when exercise has loaded after it has been selected to tell typescript cursor exists (!)
                        color: (exerciseCursorPosition || 0) > i ? "black" : "",
                        backgroundColor:
                          (exerciseCursorPosition || 0) === i
                            ? "#ff8a7e"
                            : "transparent",
                        whiteSpace: "break-spaces",
                        fontFamily: `monospace`
                      }}
                      ref={(exerciseCursorPosition || 0) === i ? myRef : null}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
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
                      <p style={{ position: "absolute", left: 4, top: 11 }}>
                        °
                      </p>
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
                  isHighlighted={["1", "!"].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                  isHighlighted={["2", `"`].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                      <p style={{ position: "absolute", left: 5, top: -2 }}>
                        "
                      </p>
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
                  isHighlighted={["3", `#`].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                      <p style={{ position: "absolute", left: 5, top: -10 }}>
                        .
                      </p>
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
                  isHighlighted={["4", `$`].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                  isHighlighted={["5", `%`].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                  isHighlighted={["6", `&`].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
                  )}
                  color={
                    isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""
                  }
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
                  isHighlighted={["7", `/`].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
                  )}
                  color={
                    isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""
                  }
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
                  isHighlighted={["8", `(`].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                  isHighlighted={["9", `)`].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                  isHighlighted={["0", `=`].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                  isHighlighted={["?", "'", "\\"].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                  isHighlighted={["¿", "¡"].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                  isHighlighted={isCurrentlyOnChar(
                    "q",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="Q"
                  color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "w",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="W"
                  color={isTutorActive ? KEY_FINGER_COLORS.RING_FINGER : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "e",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
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
                  isHighlighted={isCurrentlyOnChar(
                    "r",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="R"
                  color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "t",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="T"
                  color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "y",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="Y"
                  color={
                    isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""
                  }
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "u",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="U"
                  color={
                    isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""
                  }
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "i",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="I"
                  color={isTutorActive ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "o",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="O"
                  color={isTutorActive ? KEY_FINGER_COLORS.RING_FINGER : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "p",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
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
                      <p style={{ position: "absolute", left: 6, top: 13 }}>
                        `
                      </p>
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
                  isHighlighted={["+", "*", "~"].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                      EXERCISE_CURSOR_POSITION.NOT_STARTED &&
                    !!selectedLessonText
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
                  isHighlighted={isCurrentlyOnChar(
                    "a",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="A"
                  color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "s",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="S"
                  color={isTutorActive ? KEY_FINGER_COLORS.RING_FINGER : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "d",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="D"
                  color={isTutorActive ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "f",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
                  letter={
                    <div style={{ lineHeight: 0.3, paddingTop: 5 }}>
                      F <br /> _
                    </div>
                  }
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "g",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="G"
                  color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "h",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="H"
                  color={
                    isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""
                  }
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "j",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  color={
                    isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""
                  }
                  letter={
                    <div style={{ lineHeight: 0.3, paddingTop: 5 }}>
                      J <br /> _
                    </div>
                  }
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "k",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="K"
                  color={isTutorActive ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "l",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="L"
                  color={isTutorActive ? KEY_FINGER_COLORS.RING_FINGER : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "ñ",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="Ñ"
                  color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "{",
                    exerciseData?.text,
                    exerciseCursorPosition
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
                      <p style={{ position: "absolute", left: 6, top: 2 }}>¨</p>
                      <p style={{ position: "absolute", left: 4, top: 13 }}>
                        ´
                      </p>
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
                  isHighlighted={isCurrentlyOnChar(
                    "}",
                    exerciseData?.text,
                    exerciseCursorPosition
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
                      EXERCISE_CURSOR_POSITION.NOT_STARTED &&
                    !!selectedLessonText
                  }
                />
              </div>

              <div style={{ display: "flex", gap: 4 }}>
                <Key
                  isHighlighted={[";", ":", "_"].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                  isHighlighted={["<", ">"].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
                  )}
                  letter={
                    <div style={{ lineHeight: 0.65 }}>
                      &gt; <br /> &lt;
                    </div>
                  }
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "z",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="Z"
                  color={isTutorActive ? KEY_FINGER_COLORS.PINKY : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "x",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="X"
                  color={isTutorActive ? KEY_FINGER_COLORS.RING_FINGER : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "c",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="C"
                  color={isTutorActive ? KEY_FINGER_COLORS.MIDDLE_FINGER : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "v",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="V"
                  color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "b",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="B"
                  color={isTutorActive ? KEY_FINGER_COLORS.INDEX_LEFT_HAND : ""}
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "n",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="N"
                  color={
                    isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""
                  }
                />
                <Key
                  isHighlighted={isCurrentlyOnChar(
                    "m",
                    exerciseData?.text,
                    exerciseCursorPosition
                  )}
                  letter="M"
                  color={
                    isTutorActive ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND : ""
                  }
                />
                <Key
                  isHighlighted={[",", ";"].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                  isHighlighted={[".", ":"].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
                  isHighlighted={["-", "_"].some((char) =>
                    isCurrentlyOnChar(
                      char,
                      exerciseData?.text,
                      exerciseCursorPosition
                    )
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
          <InfoPanel state={state} />
        </div>
      </div>
    </div>
  );
}

export default Index;
