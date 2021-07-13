const { app, BrowserWindow } = require("electron");

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 805,
    height: 580,
    minWidth: 805,
    minHeight: 580
  });
  win.loadURL("http://localhost:3000/");
  win.setTitle("MecaMatic 3.0");
}

app.on("ready", createWindow);
