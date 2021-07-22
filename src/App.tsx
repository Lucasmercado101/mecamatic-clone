import { useEffect } from "react";
import "./styles.css";
import { stateMachine, eventTypes, stateTypes } from "./stateMachine";
import { useMachine } from "@xstate/react";
import Welcome, { userData } from "./views/Welcome";
import Main from "./views/Main";
import { inspect } from "@xstate/inspect";
const electron = window?.require?.("electron");
const { NODE_ENV } = process.env;

NODE_ENV === "development" &&
  inspect({
    url: "https://statecharts.io/inspect",
    iframe: false
  });

export default function App() {
  const [state, send] = useMachine(
    stateMachine,
    NODE_ENV === "development" ? { devTools: true } : {}
  );

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
          text,
          WPMNeededToPass
        }: {
          text: string;
          isTutorActive: boolean;
          isKeyboardVisible: boolean;
          category: "Practica" | "Aprendizaje" | "Perfeccionamiento";
          lesson: number;
          exercise: number;
          WPMNeededToPass: number;
        }
      ) => {
        send({
          type: eventTypes.EXERCISE_SELECTED,
          selectedLessonText: text,
          lessonCategory: category,
          lessonNumber: lesson,
          exerciseNumber: exercise,
          isKeyboardVisible,
          isTutorActive,
          exerciseMinimumSpeed: WPMNeededToPass
        });
      }
    );

    electron?.ipcRenderer?.on(
      "reload-user-settings",
      (_, userData: userData) => {
        send({ type: eventTypes.USER_DATA_RELOADED, ...userData });
      }
    );

    electron?.ipcRenderer?.on("log-out", (_) => {
      send({ type: eventTypes.LOG_OUT });
    });

    return () => {
      electron.ipcRenderer.removeAllListeners("exercise");
      electron.ipcRenderer.removeAllListeners("load-user-profile");
    };
  }, [send]);

  switch (true) {
    case state.matches(stateTypes.WELCOME_VIEW):
      return <Welcome send={send} />;
    case state.matches(stateTypes.MAIN_VIEW):
      return <Main state={state} send={send} />;
    default:
      return (
        <div>
          If you're seeing this then something went wrong somewhere.
          <br />
          Please restart the app
        </div>
      );
  }
}
