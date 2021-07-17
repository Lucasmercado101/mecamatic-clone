const fs = require("fs");
const path = require("path");

const lessonsPath = path.resolve(__dirname, "lessons", "practice");

const folders = fs
  .readdirSync(lessonsPath)
  .sort((a, b) => a.split("lesson ")[1] - b.split("lesson ")[1]);

folders.forEach((folder, i) => {
  const folderNumber = +folder.split("lesson ")[1];

  const files = fs
    .readdirSync(path.resolve(lessonsPath, folder))
    .sort((a, b) => +a.split(".json")[0] - +b.split(".json")[0]);

  files.forEach((exercFile) => {
    const exerciseData = JSON.parse(
      fs.readFileSync(path.resolve(lessonsPath, folder, exercFile))
    );
    exerciseData.WPMNeededToPass = 60 + i * 10;
    fs.writeFileSync(
      path.resolve(lessonsPath, folder, exercFile),
      JSON.stringify(exerciseData)
    );
  });
});
