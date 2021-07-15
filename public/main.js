const { app, BrowserWindow, Menu } = require("electron");
const fs = require("fs");
const path = require("path");
const lessonsPath = path.join(__dirname, "..", "lessons");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 805,
    height: 580,
    minWidth: 805,
    minHeight: 580,
    title: "MecaMatic 3.0",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  });
  win.loadURL("http://localhost:3000/");

  // Open the DevTools.
  win.webContents.openDevTools();

  const submenus = [];

  let exercises = [];
  for (let i = 1; i <= 100; i++) {
    exercises.push(`${i % 10 === 0 ? 10 : i % 10}.txt`);
    if (i % 10 === 0) {
      submenus.push({
        label: `LECCION ${i / 10}`,
        submenu: exercises.map((el) => ({
          label: el,
          click() {
            fs.readFile(path.join(lessonsPath, el), "utf8", (err, data) => {
              win.webContents.send("exercise", data, {
                category: "learning",
                lesson: i / 10,
                exercise: el.split("txt")[0]
              });
            });
          }
        }))
      });
      exercises = [];
    }
  }

  const menu = Menu.buildFromTemplate([
    {
      label: "Aprendizaje",
      submenu: submenus
    }
  ]);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
