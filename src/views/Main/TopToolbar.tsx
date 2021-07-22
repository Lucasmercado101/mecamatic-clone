import { Event, EventData, SingleOrArray, State } from "xstate";
import redCheckCheckMark from "../../assets/red_checkmark.png";
import stopIcon from "../../assets/stop.png";
import {
  eventTypes,
  stateContext,
  stateEvents,
  stateTypes
} from "../../globalStateMachine/stateMachine";
const electron = window?.require?.("electron");

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

function TopToolbar({ send, state }: Props) {
  // TODO buttons stay focused once clicked
  // if exercise is selected after clicking a button
  // the buttons are not unblured.
  return (
    <div className="top-toolbar" style={{ height: 22, display: "flex" }}>
      <div className="toolbar-separator" />
      <button
        onClick={() => {
          electron.ipcRenderer.send(
            "open-global-settings-window",
            state.context.userName
          );
        }}
        className="top-toolbar-menu-item"
      >
        <img src={redCheckCheckMark} alt="a red checkmark" />
        Opciones
      </button>
      <div className="toolbar-separator" />
      <button
        onClick={() => {
          if (
            [
              {
                [stateTypes.MAIN_VIEW]: {
                  [stateTypes.EXERCISE_SELECTED]: {
                    [stateTypes.EXERCISE_PROGRESS]: stateTypes.EXERCISE_ONGOING
                  }
                }
              },
              {
                [stateTypes.MAIN_VIEW]: {
                  [stateTypes.EXERCISE_SELECTED]: {
                    [stateTypes.EXERCISE_TIMER]: stateTypes.TIMER_ONGOING
                  }
                }
              }
            ].every(state.matches)
          )
            send({ type: eventTypes.PAUSE_TIMER });
          else if (
            [
              {
                [stateTypes.MAIN_VIEW]: {
                  [stateTypes.EXERCISE_SELECTED]: {
                    [stateTypes.EXERCISE_PROGRESS]: stateTypes.EXERCISE_ONGOING
                  }
                }
              },
              {
                [stateTypes.MAIN_VIEW]: {
                  [stateTypes.EXERCISE_SELECTED]: {
                    [stateTypes.EXERCISE_TIMER]: stateTypes.TIMER_PAUSED
                  }
                }
              }
            ].some(state.matches)
          )
            send({ type: eventTypes.RESUME_TIMER });
        }}
        className="top-toolbar-menu-item"
      >
        <img src={stopIcon} alt="a red stop sign icon" />
        {state.matches({
          [stateTypes.MAIN_VIEW]: {
            [stateTypes.EXERCISE_SELECTED]: {
              [stateTypes.EXERCISE_TIMER]: [stateTypes.TIMER_PAUSED]
            }
          }
        })
          ? "Reanudar"
          : "Pausa"}
      </button>
      <div className="toolbar-separator" />
    </div>
  );
}

export default TopToolbar;
