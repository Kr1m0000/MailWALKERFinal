const UserModel = require("../models/user.model");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { uploadErrors } = require("../utils/errors.utils");

module.exports.uploadProfil = async (req, res) => {
    try {
        console.log(req.file.detectedMimeType);
      if (
        req.file.detectedMimeType != "image/jpg" &&
        req.file.detectedMimeType != "image/png" &&
        req.file.detectedMimeType != "image/jpeg"
      ) {
        throw new Error("invalid file format");
      }
  
      if (req.file.size > 500000) {
        throw new Error("file size exceeds 500 KB");
      }
  
      const fileName = req.body.name + ".jpg";
  
      await pipeline(
        req.file.stream,
        fs.createWriteStream(
          `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
      );
  
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.body.userId,
        { $set: { picture: "./uploads/profil/" + fileName } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
  
      return res.status(201).json(updatedUser); // Return the updated user data on success
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(400).json({ errors }); // Return a 400 status for client error
    }
  };
  
