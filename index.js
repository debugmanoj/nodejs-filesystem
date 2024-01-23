import express from "express";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 8000;

const getTime = () => {
  let today = new Date().toISOString();
  let TodayTime = today.replace(/:/g, '-'); 
  const currentDir = path.dirname(new URL(import.meta.url).pathname);

  let filePath = path.join(currentDir, "DateTime", `${TodayTime}.txt`);

  fs.writeFileSync(filePath, today, "utf8");

  let data = fs.readFileSync(filePath, "utf8");
  return data;
};

app.get("/", (req, res) => {
  const result = getTime(); 
  res.status(200).send(result);
});


app.listen(PORT, () => console.log("Server is running on port", PORT));
