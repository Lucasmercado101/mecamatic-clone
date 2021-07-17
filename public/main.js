const { app, BrowserWindow, Menu } = require("electron");
const fs = require("fs");
const path = require("path");
const learningLessonsPath = path.join(__dirname, "..", "lessons", "learning");
const practiceLessonsPath = path.join(__dirname, "..", "lessons", "practice");

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

  const menu = Menu.buildFromTemplate([
    {
      label: "Aprendizaje",
      submenu: fs
        .readdirSync(learningLessonsPath)
        .sort((a, b) => +a.split("lesson")[1] - b.split("lesson")[1])
        .map((lessonsFolder) => {
          const lessonNumber = +lessonsFolder.split("lesson")[1];
          return {
            label: "LECCION " + lessonNumber,
            submenu: fs
              .readdirSync(path.join(learningLessonsPath, lessonsFolder))
              .sort((a, b) => +a.split(".json")[0] - +b.split(".json")[0])
              .map((exercise) => {
                const exerciseNumber = +exercise.split(".json")[0];
                return {
                  label: "Ejercicio " + exerciseNumber,
                  click() {
                    fs.readFile(
                      path.join(learningLessonsPath, lessonsFolder, exercise),
                      "utf8",
                      (err, data) => {
                        const { text, isTutorActive, isKeyboardVisible } =
                          JSON.parse(data);
                        win.webContents.send("exercise", {
                          text,
                          isTutorActive,
                          isKeyboardVisible,
                          category: "Aprendizaje",
                          lesson: lessonNumber,
                          exercise: exerciseNumber
                        });
                      }
                    );
                  }
                };
              })
          };
        })
    },
    {
      label: "Practica",
      submenu: fs
        .readdirSync(practiceLessonsPath)
        .sort((a, b) => +a.split("lesson")[1] - b.split("lesson")[1])
        .map((lessonsFolder) => {
          const lessonNumber = +lessonsFolder.split("lesson")[1];
          return {
            label: "LECCION " + lessonNumber,
            submenu: fs
              .readdirSync(path.join(practiceLessonsPath, lessonsFolder))
              .sort((a, b) => +a.split(".json")[0] - +b.split(".json")[0])
              .map((exercise) => {
                const exerciseNumber = +exercise.split(".json")[0];
                return {
                  label: "Ejercicio " + exerciseNumber,
                  click() {
                    fs.readFile(
                      path.join(practiceLessonsPath, lessonsFolder, exercise),
                      "utf8",
                      (err, data) => {
                        const { text, isTutorActive, isKeyboardVisible } =
                          JSON.parse(data);
                        win.webContents.send("exercise", {
                          text,
                          isTutorActive,
                          isKeyboardVisible,
                          category: "Practica",
                          lesson: lessonNumber,
                          exercise: exerciseNumber
                        });
                      }
                    );
                  }
                };
              })
          };
        })
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
