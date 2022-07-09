const express = require("express");
const FileService = require("../services/files");
const busboy = require("busboy");

function files(app) {
  const router = express.Router();
  app.use("/api/files", router);
  const fileServ = new FileService();



  router.get("/:fileName", async (req, res) => {
    return res.json({message:"Sending a File..."});
  });

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

  router.delete("/:fileName", async (req, res) => {
    return res.json({message:"Deleting a File..."});
  });
}

module.exports = files;