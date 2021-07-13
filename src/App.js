import { useState, useEffect } from "react";
import "./styles.css";
import { makeStyles } from "@material-ui/styles";

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
  }
});

const sentenceTest = Array.from(
  "la casa de papel es una casa muy grande y delicada"
  // "la casa de casa la casa de casa la casa de casa la casa de casa la casa de casa la casa de casa la casa de casa"
);

const BACKSPACE = "Backspace";
const WPM = (typedEntries, mins) => typedEntries / 5 / mins;

export default function App() {
  const classes = useStyles();
  const [currentLetter, setCurrentLetter] = useState(0);
  const [keyPressed, setKeyPressed] = useState(null);
  const [startedTyping, setStartedTyping] = useState(false);
  const [seconds, setSeconds] = useState(0);

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

  return (
    <div
      onKeyDown={(e) => {
        const { key: keyPressed } = e;
        setKeyPressed(keyPressed);

        if (currentLetter !== sentenceTest.length) {
          if (
            keyPressed === sentenceTest[currentLetter] &&
            currentLetter === 0
          ) {
            setStartedTyping(true);
          }

          if (keyPressed === sentenceTest[currentLetter]) {
            setCurrentLetter((prev) => {
              if (prev + 1 === sentenceTest.length) {
                setStartedTyping(false);
              }
              return prev + 1;
            });
          } else if (keyPressed === BACKSPACE && currentLetter !== 0) {
            setCurrentLetter((prev) => prev - 1);
          }
        }
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
            // padding: 15
          }}
        >
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
        </div>
        {/* <div
        style={{
          backgroundColor: "#0e7876",
          color: "white",
          resize: "both",
          overflow: "auto",
          height: 210,
          width: 570,
          fontSize: "1.2rem",
          padding: 15
        }}
      >
        {sentenceTest.map((letter, i) => (
          <span className={currentLetter === i ? "key-selected" : ""}>
            {letter}
          </span>
        ))}
      </div> */}

        {/* Keyboard */}
        <div
          style={{
            width: 570,
            height: 205,
            marginTop: 40,
            border: "9px solid #808080"
          }}
        >
          <div className="letters-row">
            <Key isSelected={keyPressed === "q"} letter="Q" color="#fefec3" />
            <Key isSelected={keyPressed === "w"} letter="W" color="#c4fcbf" />
            <Key isSelected={keyPressed === "e"} letter="E" color="#c8fefc" />
            <Key isSelected={keyPressed === "r"} letter="R" color="#fac5fb" />
            <Key isSelected={keyPressed === "t"} letter="T" color="#fac5fb" />
            <Key isSelected={keyPressed === "y"} letter="Y" color="#f991ff" />
            <Key isSelected={keyPressed === "u"} letter="U" color="#f991ff" />
            <Key isSelected={keyPressed === "i"} letter="I" color="#f991ff" />
            <Key isSelected={keyPressed === "o"} letter="O" color="#c6f9c7" />
            <Key isSelected={keyPressed === "p"} letter="P" color="#fdfcca" />
          </div>
          <div className="letters-row">
            <Key isSelected={keyPressed === "a"} letter="A" color="#fefec3" />
            <Key isSelected={keyPressed === "s"} letter="S" color="#c4fcbf" />
            <Key isSelected={keyPressed === "d"} letter="D" color="#c8fefc" />
            <Key isSelected={keyPressed === "f"} letter="F" color="#fac5fb" />
            <Key isSelected={keyPressed === "g"} letter="G" color="#fac5fb" />
            <Key isSelected={keyPressed === "h"} letter="H" color="#f991ff" />
            <Key isSelected={keyPressed === "j"} letter="J" color="#f991ff" />
            <Key isSelected={keyPressed === "k"} letter="K" color="#f991ff" />
            <Key isSelected={keyPressed === "l"} letter="L" color="#c6f9c7" />
            <Key isSelected={keyPressed === "ñ"} letter="Ñ" color="#fdfcca" />
          </div>
          <div className="letters-row">
            <Key isSelected={keyPressed === "z"} letter="Z" color="#fefec3" />
            <Key isSelected={keyPressed === "x"} letter="X" color="#c4fcbf" />
            <Key isSelected={keyPressed === "c"} letter="C" color="#c8fefc" />
            <Key isSelected={keyPressed === "v"} letter="V" color="#fac5fb" />
            <Key isSelected={keyPressed === "b"} letter="B" color="#fac5fb" />
            <Key isSelected={keyPressed === "n"} letter="N" color="#f991ff" />
            <Key isSelected={keyPressed === "m"} letter="M" color="#f991ff" />
          </div>
          <div
            className={keyPressed === " " ? "key-pressed" : ""}
            style={{
              width: "12rem",
              height: "2rem",
              backgroundColor: "#ffccce",
              padding: "0.2rem",
              display: "flex",
              justifyContent: "center",
              border: "medium solid #8e807f",
              borderRadius: "4px",
              margin: "3px"
            }}
          />
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

function Key({ letter, color, isSelected = false }) {
  return (
    <div
      className={isSelected ? "key-pressed" : ""}
      style={{
        width: "2rem",
        height: "2rem",
        backgroundColor: color,
        padding: "0.2rem",
        display: "flex",
        justifyContent: "center",
        border: "3px solid #808080",
        borderRadius: "4px",
        margin: "3px"
      }}
    >
      {letter}
    </div>
  );
}
