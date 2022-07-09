const cloudinary = require("cloudinary").v2;
const {
  cloudinaryCloudName,
  cloudinaryAPIKey,
  cloudinaryAPISecret,
  cloudinaryFolderName
} = require("../config");
require("isomorphic-fetch");

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

function downloadFile(fileName) {
  return new Promise((resolve, reject) => {
    const resourcePublicID = `${cloudinaryFolderName}/${fileName}`;
    console.log(resourcePublicID);
    cloudinary.api.resources_by_ids(resourcePublicID, (error, result) => {
      if(error) {
        return reject(error);
      }
      console.log(result);
      return resolve("OK");
    });
  });
}

async function deleteFile(fileName) {
  return new Promise((resolve, reject) => {
    const resourcePublicID = `${cloudinaryFolderName}/${fileName}`;
    cloudinary.uploader.destroy(resourcePublicID, (error, result) => {
      if(error) {
        return reject(error);
      } 
      return result.result === "not found" ? reject({message:result.result}) : resolve(result);
    });
  });
}

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile
};