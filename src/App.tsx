import { useEffect } from "react";
import "./styles.css";
import { stateMachine, eventTypes, stateTypes } from "./stateMachine";
import { useMachine } from "@xstate/react";
import Welcome from "./views/Welcome";
import Main from "./views/Main";
const electron = window?.require?.("electron");

export default function App() {
  const [state, send] = useMachine(stateMachine);

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
          category: "Practica" | "Aprendizaje";
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
  }, [send]);

  switch (true) {
    case state.matches(stateTypes.WELCOME_VIEW):
      return <Welcome send={send} />;
    case [stateTypes.EXERCISE_NOT_SELECTED, stateTypes.EXERCISE_SELECTED].some(
      state.matches
    ):
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
