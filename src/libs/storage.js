const cloudinary = require("cloudinary").v2;
const {
  cloudinaryCloudName,
  cloudinaryAPIKey,
  cloudinaryAPISecret,
  cloudinaryFolderName
} = require("../config");
const https = require("https");

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

function getResourceURL(fileName) {
  return new Promise((resolve, reject) => {
    const resourcePublicID = `${cloudinaryFolderName}/${fileName}`;
    cloudinary.api.resources_by_ids(resourcePublicID, (error, result) => {
      if(error) {
        return reject(error);
      }

      const resourceURL = result.resources[0]?.secure_url;
      if(!resourceURL) {
        return reject({message:"Resource not Found"});
      }
      return resolve(resourceURL);
    });
  });
}

function getResourceStream(resourceURL) {
  return new Promise((resolve, reject) => {
    https.get(resourceURL, function(response) {
      if(response.statusCode === 200) {
        return resolve(response);
      }
      return reject({message:"Resource not Found"});
    });
  });
}

async function downloadFile(fileName, res) {
  try {
    const resourceURL = await getResourceURL(fileName);
    const resourceStream = await getResourceStream(resourceURL);
    resourceStream.pipe(res);
  } catch(error) {
    return res.status(400).json({
      success:false,
      message:error.message
    });
  }
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