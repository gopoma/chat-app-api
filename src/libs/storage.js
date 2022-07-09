const cloudinary = require("cloudinary").v2;
const {
  cloudinaryCloudName,
  cloudinaryAPIKey,
  cloudinaryAPISecret,
  cloudinaryFolderName
} = require("../config");

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryAPIKey,
  api_secret: cloudinaryAPISecret
});

function uploadFile(file) {
  return new Promise((resolve, reject) => {
    const cloudinaryWriteStream = cloudinary.uploader.upload_stream({
      folder: cloudinaryFolderName,
    }, (error, result) => {
      if(error) {
        return reject(error);
      }
      return resolve(result);
    });

    file.pipe(cloudinaryWriteStream);
  });
}

module.exports = {
  uploadFile
};