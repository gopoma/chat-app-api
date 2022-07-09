const {uploadFile} = require("../libs/storage");

class FileService {
  async upload(file) {
    try {
      const result = await uploadFile(file);
      return {
        success: true,
        message: "File uploaded successfully",
        public_id: result.public_id,
        secure_url: result.secure_url
      };
    } catch(error) {
      console.log(error);
      return {
        success: false,
        message: "A wild error has appeared"
      };
    }
  }
}

module.exports = FileService;