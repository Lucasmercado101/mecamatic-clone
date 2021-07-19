import { useEffect, useState } from "react";
import { Event, EventData, SingleOrArray } from "xstate";
import { eventTypes, stateEvents } from "../stateMachine";
const electron = window?.require?.("electron");

interface userData {
  userName: string;
}

function Welcome({
  send
}: {
  send: (
    event: SingleOrArray<Event<stateEvents>>,
    payload?: EventData | undefined
  ) => void;
}) {
  const [userName, setUserName] = useState("");
  const [userNames, setUserNames] = useState<string[]>([]);

  useEffect(() => {
    electron.ipcRenderer.invoke("get-user-profiles").then((data) => {
      setUserNames(data);
    });
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        padding: 15,
        display: "grid",
        placeItems: "center"
      }}
    >
      <div style={{ display: "flex", gap: 15 }}>
        <input
          list="user-profiles"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <datalist id="user-profiles">
          {userNames.map((el, i) => (
            <option value={el} key={i} />
          ))}
        </datalist>
        <button
          onClick={() => {
            if (userNames.includes(userName)) {
              electron.ipcRenderer
                .invoke("load-user-profile", userName)
                .then(({ userName }: userData) => {
                  send({ type: eventTypes.USER_DATA_LOADED, userName });
                });
            } else {
              electron.ipcRenderer
                .invoke("create-user-profile-and-load-said-user", userName)
                .then(({ userName }: userData) => {
                  send({ type: eventTypes.USER_DATA_LOADED, userName });
                });
            }
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default Welcome;
