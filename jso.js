const fs = require("fs");
const path = require("path");

const lessonsPath = path.resolve(__dirname, "lessons", "learning", "lesson 10");

const lessonsSourcePath = path.resolve(__dirname, "lessons1");

const dto = (text, isTutorActive, isKeyboardVisible) => ({
  text,
  isTutorActive,
  isKeyboardVisible
});

const files = fs
  .readdirSync(lessonsSourcePath)
  .sort((a, b) => +a.split(".txt")[0] - +b.split(".txt")[0]);

const finalJSONData = [];

for (let i = 0; i < 10; i++) {
  const file = files[i];
  const filePath = path.join(lessonsSourcePath, file);
  const content = fs.readFileSync(filePath, "utf-8");
  finalJSONData.push(dto(content.replace(/(\r\n|\n|\r)/gm, ""), true, true));
  fs.rmSync(path.join(lessonsSourcePath, file));
}

finalJSONData.forEach((el, i) => {
  fs.writeFileSync(
    path.join(lessonsPath, `${i + 1}.json`),
    JSON.stringify(el),
    "utf-8",
    (err) => {}
  );
});

// fs.readFile(path.join(lessonsPath), "utf-8", (err, data) => {
//   });
