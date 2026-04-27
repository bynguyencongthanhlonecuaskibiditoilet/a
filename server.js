const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// ✅ FIX PORT cho Render
const PORT = process.env.PORT || 3000;

// Tạo thư mục uploads
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Cấu hình lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ THÊM TRANG CHỦ (fix lỗi Cannot GET /)
app.get("/", (req, res) => {
  res.send(`
    <h2>Upload file 🚀</h2>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  `);
});

// Upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.send("Không có file!");

  const link = `${req.protocol}://${req.get("host")}/download/${req.file.filename}`;

  res.send(`
    <p>Upload thành công ✅</p>
    <a href="${link}">${link}</a>
  `);
});

// Download
app.get("/download/:file", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.file);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.send("Không thấy file");
  }
});

app.listen(PORT, () => console.log("Server chạy cổng " + PORT));
