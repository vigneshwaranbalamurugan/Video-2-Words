import express from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import upload from '../config/multerConfig.js';
import { s3,bucketName } from "../config/awsConfig.js";

const uploadRouter=express.Router();

uploadRouter.post("/video", upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      const fileStream = fs.createReadStream(file.path);
      const s3Key = `${uuidv4()}-${file.originalname}`;
      const params = {
        Bucket: bucketName,
        Key: s3Key,
        Body: fileStream,
      };
  
      const response = await s3.upload(params).promise();

      fs.unlink(file.path, (err) => {
        if (err) {
          console.error("Error deleting the file:", err);
          return res.status(500).json({ error: "Failed to delete local file" });
        }
        console.log("Local file deleted successfully.");
      });

      res.status(200).json({ message: "File uploaded successfully", s3Key: s3Key, url: response.Location });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  export default uploadRouter;
  