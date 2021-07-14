import { useState, useEffect } from "react";
import "./styles.css";
import { makeStyles } from "@material-ui/styles";
// import {} from "ramda"

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
  enterBottom: {
    position: "relative",
    "&::after": {
      content: "''",
      position: "absolute",
      right: -3,
      left: -3,
      top: 0,
      bottom: 10,
      backgroundColor: "#e0e0e0",
      borderLeft: "3px solid #808080",
      borderRight: "3px solid #808080",
      transform: "translateY(-65%)"
    }
  }
});

const sentenceTest = Array.from(
  `Es indispensable que el alumno practique al menos media hora todos los días. Si el alumno tuviera necesidad de dominar la mecanografía rápidamente, deberá aumentar este tiempo a una o dos horas diarias, en cuyo caso el tiempo necesario para escribir con rapidez y precisión disminuirá proporcionalmente al tiempo y el esfuerzo empleado.
  Lo que desde luego es imprescindible, es escribir todos los días, para adquirir cualquier habilidad se precisa tiempo y constancia.`
  // "la casa de casa la casa de casa la casa de casa la casa de casa la casa de casa la casa de casa la casa de casa"
);

const BACKSPACE = "Backspace";
const WPM = (typedEntries, mins) => typedEntries / 5 / mins;

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
        const { key: keyPressed, code: keyCode } = e;
        setKeyPressed(keyPressed);
        // console.log(e.code === "");

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
          {/* <WelcomeMessage /> */}
          {sentenceTest.map((letter, i) => (
            <span className={currentLetter === i ? "key-selected" : ""}>
              {letter}
            </span>
          ))}
        </div>

        {/* Keyboard */}
        <div
          style={{
            width: 570,
            height: 205,
            marginTop: 40,
            border: "9px solid #808080",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: 8,
            fontWeight: "bold"
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            <Key
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
              style={{
                width: 48,
                fontSize: "1.1em",
                textAlign: "left",
                paddingLeft: 5,
                paddingTop: 0
              }}
              letter="&#11134;"
            />
            <Key letter="Q" />
            <Key letter="W" />
            <Key letter="E" />
            <Key letter="R" />
            <Key letter="T" />
            <Key letter="Y" />
            <Key letter="U" />
            <Key letter="I" />
            <Key letter="O" />
            <Key letter="P" />
            <Key
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
              style={{
                width: 59,
                fontSize: "0.9rem",
                textAlign: "left",
                padding: 4
              }}
              letter="Mayús"
            />
            <Key letter="A" />
            <Key letter="S" />
            <Key letter="D" />
            <Key
              letter={
                <div style={{ lineHeight: 0.3, paddingTop: 5 }}>
                  F <br /> _
                </div>
              }
            />
            <Key letter="G" />
            <Key letter="H" />
            <Key
              letter={
                <div style={{ lineHeight: 0.3, paddingTop: 5 }}>
                  J <br /> _
                </div>
              }
            />
            <Key letter="K" />
            <Key letter="L" />
            <Key letter="Ñ" />
            <Key
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
              className={classes.enterBottom}
              style={{ width: 41, paddingTop: 7 }}
              letter="&crarr;"
            />
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            <Key
              style={{
                width: 44,
                fontSize: "0.9rem",
                textAlign: "left",
                padding: 4
              }}
              letter="&#8679;"
            />
            <Key
              letter={
                <div style={{ lineHeight: 0.65 }}>
                  &gt; <br /> &lt;
                </div>
              }
            />
            <Key letter="Z" />
            <Key letter="X" />
            <Key letter="C" />
            <Key letter="V" />
            <Key letter="B" />
            <Key letter="N" />
            <Key letter="M" />
            <Key
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
            <Key style={{ width: 159 }} />
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

function Key({ letter, style, ...otherProps }) {
  return (
    <div
      // className={isSelected ? "key-pressed" : ""}
      {...otherProps}
      style={{
        width: 32,
        height: 32,
        border: "3px solid #808080",
        borderRadius: "4px",
        backgroundColor: "#e0e0e0",
        textAlign: "center",
        paddingTop: 3,
        ...style
      }}
    >
      {letter}
    </div>
  );
}
