const express = require("express");
const date = require("date-and-time");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

const Direct = process.cwd();

const outputFolder = "output";

const outputFolderPath = path.join(Direct, outputFolder);
if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath);
}

// Define a route to create a text file with current date and time
app.get("/", (req, res) => {
  const now = new Date();
  const value = date.format(now, "DD-MM-YYYY,HH-mm-ss");

  if (!value) {
    return res.status(500).send("Error generating date and time");
  }

  const filePath = path.join(outputFolderPath, `${value}.txt`);

  fs.writeFile(filePath, `${value}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    res
      .status(200)
      .send(
        `Created ${value}.txt file  successfully in the '${outputFolder}' folder`
      );
  });
});

app.get("/getreadFiles", (req, res) => {
  fs.readdir(outputFolderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (files.length === 0) {
      return res.status(404).send('No files found in the "output" folder');
    }

    const fileContents = [];

    files.forEach((filename, index, array) => {
      const filePath = path.join(outputFolderPath, filename);

      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }

        fileContents.push({ filename, data });
        if (index === array.length - 1) {
          // Send the response once all files have been read
          res.status(200).json(fileContents);
        }
      });
    });
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
