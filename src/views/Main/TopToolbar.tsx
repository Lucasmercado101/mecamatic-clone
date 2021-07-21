import { Event, EventData, SingleOrArray, State } from "xstate";
import redCheckCheckMark from "../../assets/red_checkmark.png";
import stopIcon from "../../assets/stop.png";
import { stateContext, stateEvents } from "../../stateMachine";
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
        // onClick={() => {
        //   electron.ipcRenderer.send(
        //     "open-global-settings-window",
        //     state.context.userName
        //   );
        // }}
        className="top-toolbar-menu-item"
      >
        <img src={stopIcon} alt="a red stop sign icon" />
        Pausa
      </button>
      <div className="toolbar-separator" />
    </div>
  );
}

export default TopToolbar;
