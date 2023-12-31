const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const User = require("../../users/model/userModel");
const { cloudinary } = require("../config/cloudinary");

class StorageService {
  constructor() {
    this.FOLDER_PATH = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "data-app",
      "user",
      "photos"
    );
    this.validExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  }
  isFileImage(file) {
    if (!file || file.length === 0) {
      return false;
    }
    const originalFilename = file.originalname;
    const extension = path.extname(originalFilename).toLowerCase();
    return this.validExtensions.includes(extension);
  }
  async uploadImageToFileSystem(file) {
    const filePath = path.join(this.FOLDER_PATH, file.originalname);
    try {
      if (!this.isFileImage(file)) {
        return "";
      }
      await fs.mkdir(this.FOLDER_PATH, { recursive: true });
      await fs.writeFile(filePath, file.buffer);
      return filePath;
    } catch (error) {
      console.error(error);
      return "";
    }
  }
  // async uploadImageToFileSystem({ file }) {
  //     console.log(file);
  //     try {
  //         const result = await cloudinary.uploader.upload(file.path, {
  //             upload_preset: 'user_photos'
  //         });
  //         console.log(result);
  //         return result.secure_url;
  //     } catch (error) {
  //         return new DataResponse(500, 'Internal server error.', error);
  //     }
  // }

  async loadImageFromFileSystem(username) {
    const user = await User.findOne({ username });
    console.log(user);
    if (!user || !user.photos || user.photos.length === 0) {
      return null;
    }
    const filePath = user.photos;
    try {
      return await fs.readFile(filePath);
    } catch (error) {
      console.error(error);
      return Buffer.from("Not Found");
    }
  }
}
module.exports = { StorageService };
