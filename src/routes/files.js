const express = require("express");
const FileService = require("../services/files");
const busboy = require("busboy");
const { downloadFile } = require("../libs/storage");

function files(app) {
  const router = express.Router();
  app.use("/api/files", router);
  const fileServ = new FileService();



  router.post("/", (req, res) => {
    let promise;
    const bb = busboy({ headers: req.headers });
    
    bb.on("file", (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      console.log("Filename:", filename);
      console.log("Encoding:", encoding);
      console.log("MimeType:", mimeType);
      promise = fileServ.upload(file);
    });

    bb.on("close", async () => {
      const result = await promise;
      res.json(result);
    });

    req.pipe(bb);
  });

  router.get("/:fileName", async (req, res) => {
    const {fileName} = req.params;

    downloadFile(fileName, res);
  });

  router.delete("/:fileName", async (req, res) => {
    const {fileName} = req.params;
    const result = await fileServ.delete(fileName);

    return res.status(result.success ? 202 : 400).json(result);
  });
}

module.exports = files;