const {
  uploadFile,
  downloadFile,
  deleteFile
} = require("../libs/storage");

class FileService {
  async upload(file) {
    try {
      const result = await uploadFile(file);
      return {
        success: true,
        message: "File uploaded successfully",
        key: result.public_id.split("/")[1],
        location: result.secure_url
      };
    } catch(error) {
      console.log(error);
      return {
        success: false,
        message: "A wild error has appeared"
      };
    }
  }

  async download(fileName) {
    try {
      const result = await downloadFile(fileName);
      console.log(result);

      return {
        success: true,
        message: "File downloaded successfully",
      };
    } catch(error) {
      console.log(error);
      return {
        success: false,
        message: "A wild error has appeared"
      };
    }
  }

  async delete(fileName) {
    try {
      await deleteFile(fileName);
      return {
        success: true,
        message: "File deleted successfully"
      };
    } catch(error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

module.exports = FileService;