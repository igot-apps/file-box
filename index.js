const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.array("files", 5), (req, res) => {
  res.sendStatus(200);
});

app.get("/files", (req, res) => {
  fs.readdir("public/uploads", (err, files) => {
    if (err) {
      console.error("Error reading file directory:", err);
      res.status(500).json({ error: "Error reading file directory" });
    } else {
      res.json(files);
    }
  });
});

app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "public/uploads", req.params.filename);
  res.download(filePath, req.params.filename);
});

app.delete("/delete/:filename", (req, res) => {
  const filePath = path.join(__dirname, "public/uploads", req.params.filename);
  // console.log(req.body)
  const { password } = req.body;
  // console.log(req.body)

  // if (password !== "condom77") {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      res.status(500).json({ error: "Error deleting file" });
    } else {
      res.json({ message: "File deleted successfully" });
    }
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
