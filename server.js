const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();

// ✅ FIX PORT cho Render
const PORT = process.env.PORT || 3000;

// Tạo thư mục uploads
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Cấu hình upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// ✅ TRANG CHỦ (không còn lỗi Cannot GET /)
app.get("/", (req, res) => {
  res.send(`
    <h2>Upload file 🚀</h2>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  `);
});


// ✅ UPLOAD → trả link dạng /get/id
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.send("Không có file!");

  const id = crypto.randomBytes(5).toString("hex");
  const newName = id + path.extname(req.file.originalname);

  fs.renameSync(
    path.join("uploads", req.file.filename),
    path.join("uploads", newName)
  );

  const link = `${req.protocol}://${req.get("host")}/get/${id}`;

  res.send(`
    <p>Upload thành công ✅</p>
    <a href="${link}">${link}</a>
  `);
});


// ✅ LINK DOWNLOAD ĐẸP
app.get("/get/:id", (req, res) => {
  const files = fs.readdirSync("uploads");
  const file = files.find(f => f.startsWith(req.params.id));

  if (!file) return res.send("Không tìm thấy file");

  res.download(path.join(__dirname, "uploads", file));
});


app.listen(PORT, () => console.log("Server chạy cổng " + PORT));
