const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const learningLessonsPath = path.join(
  __dirname,
  "..",
  "data",
  "lessons",
  "learning"
);
const practiceLessonsPath = path.join(
  __dirname,
  "..",
  "data",
  "lessons",
  "practice"
);
const perfectionLessonsPath = path.join(
  __dirname,
  "..",
  "data",
  "lessons",
  "perfecting"
);
const userProfilesPath = path.join(__dirname, "..", "data", "profiles");

ipcMain.handle("get-user-profiles", () => {
  const users = fs.readdirSync(userProfilesPath);
  return users;
});

ipcMain.handle("create-user-profile-and-load-user-it", (event, userName) => {
  const userProfileDir = path.join(userProfilesPath, userName);

  fs.mkdirSync(userProfileDir);

  const userSettings = {
    errorsCoefficient: 2,
    timeLimitInSeconds: 600
  };

  fs.writeFileSync(
    path.join(userProfileDir, "settings.json"),
    JSON.stringify(userSettings),
    "utf8"
  );

  return { userName, ...userSettings };
});

ipcMain.handle("load-user-profile", (event, userName) => {
  const userProfileDir = path.join(userProfilesPath, userName);

  const userSettings = fs.readFileSync(
    path.join(userProfileDir, "settings.json"),
    { encoding: "utf8" }
  );

  return { userName, ...JSON.parse(userSettings) };
});

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
        .sort((a, b) => +a.split("lesson")[1] - +b.split("lesson")[1])
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
                        win.webContents.send("exercise", {
                          category: "Aprendizaje",
                          lesson: lessonNumber,
                          exercise: exerciseNumber,
                          ...JSON.parse(data)
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
        .sort((a, b) => +a.split("lesson")[1] - +b.split("lesson")[1])
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
                        win.webContents.send("exercise", {
                          category: "Practica",
                          lesson: lessonNumber,
                          exercise: exerciseNumber,
                          ...JSON.parse(data)
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
      label: "Perfeccionamiento",
      submenu: fs
        .readdirSync(perfectionLessonsPath)
        .sort((a, b) => +a.split("lesson")[1] - +b.split("lesson")[1])
        .map((lessonsFolder) => {
          const lessonNumber = +lessonsFolder.split("lesson")[1];
          return {
            label: "LECCION " + lessonNumber,
            submenu: fs
              .readdirSync(path.join(perfectionLessonsPath, lessonsFolder))
              .sort((a, b) => +a.split(".json")[0] - +b.split(".json")[0])
              .map((exercise) => {
                const exerciseNumber = +exercise.split(".json")[0];
                return {
                  label: "Ejercicio " + exerciseNumber,
                  click() {
                    fs.readFile(
                      path.join(perfectionLessonsPath, lessonsFolder, exercise),
                      "utf8",
                      (err, data) => {
                        win.webContents.send("exercise", {
                          category: "Practica",
                          lesson: lessonNumber,
                          exercise: exerciseNumber,
                          ...JSON.parse(data)
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
