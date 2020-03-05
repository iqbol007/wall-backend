const express = require("express");
const cors = require("cors");
const fsExtra = require("fs-extra");
const path = require("path");
const multer = require("multer");
const uuid = require("uuid");
const publicPath = path.resolve(__dirname, "public");
fsExtra.ensureDirSync(publicPath);
const server = express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use("/static", express.static(publicPath));
let media = [];
server.get("/api/media", (req, res) => {
  setTimeout(() => {
    res.send(media);
  }, 2000);
});
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, publicPath);
  },
  filename(req, file, callback) {
    const filename = uuid.v4();
    let ext = "";
    console.log(file.mimetype);
    switch (file.mimetype) {
      case "image/png":
        ext = ".png";
        break;
      case "image/jpeg":
        ext = ".jpg";
        break;
      case "audio/mp3":
        ext = ".mp3";
        break;
      case "video/webm":
        ext = ".webm";
        break;
      case "video/mpeg":
        ext = ".mpeg";
        break;
      case "video/mp4":
        ext = ".mp4";
        break;
      case "application/pdf":
        ext = ".pdf";
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        ext = ".docx";
      case "text/plain":
        ext = ".txt";
      case "application/x-zip-compressed":
        ext = ".zip";

      default:
        callback(new Error("invalid mime type"));
        return;
    }
    callback(null, `${filename}${ext}`);
  }
});
let nextMediaId = 1;
const fileUpload = multer({ storage }).single("media");
server.post("/api/upload", (req, res) => {
  setTimeout(() => {
    fileUpload(req, res, err => {
      console.log(err);
      console.log(req.file);
      if (err) {
        res.status(400).send();
        return;
      }
      media = [{ name: req.file.filename, id: nextMediaId++ }, ...media];
      res.send();
    });
  }, 1000);
});
server.delete("/api/media/:id", (req, res) => {
  setTimeout(() => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.statusCode = 400;
      res.send();
      return;
    }
    const mediaToRemove = media.find(o => o.id === id);
    if (mediaToRemove === undefined) {
      res.statusCode = 444;
      res.send();
      return;
    }
    media = media.filter(o => o.id !== id);
    res.statusCode = 204;
    res.send();
  }, 5000);
});
const port = process.env.PORT || 9999;
server.listen(port);
