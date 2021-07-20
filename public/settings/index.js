/* global Elm:false electron:false */

const electron = window.require("electron");

const app = Elm.Main.init({
  node: document.getElementById("root")
});

// When a command goes to the `sendMessage` port, we pass the message
// along to the WebSocket.
// app.ports.sendMessage.subscribe(function (message) {
//   socket.send(message);
// });

// When a message comes into our WebSocket, we pass the message along
// to the `messageReceiver` port.

electron.ipcRenderer.on("settings-conf-json-sent", (_, data) => {
  app.ports.settingsReceiver.send(data);
});

// If you want to use a JavaScript library to manage your WebSocket
// connection, replace the code in JS with the alternate implementation.
