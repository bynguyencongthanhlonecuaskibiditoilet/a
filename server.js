const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.send("Không có file!");

  const link = `${req.protocol}://${req.get("host")}/download/${req.file.filename}`;

  res.json({
    message: "OK",
    link: link,
  });
});

app.get("/download/:file", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.file);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.send("Không thấy file");
  }
});

app.listen(PORT, () => console.log("http://localhost:" + PORT));
