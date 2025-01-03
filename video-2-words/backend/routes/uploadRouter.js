import express from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import upload from '../config/multerConfig.js';
import { s3,bucketName } from "../config/awsConfig.js";
import ffmpeg from "fluent-ffmpeg";

const uploadRouter=express.Router();

uploadRouter.post("/video", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const inputFilePath = file.path;
    const outputFilePath = `uploads/processed-${file.originalname}`; 

    // Use FFmpeg to reduce video quality to 240p while keeping the original audio quality
    ffmpeg(inputFilePath)
      .videoCodec("libx264") 
      .size("426x240") 
      .audioCodec("copy") 
      .output(outputFilePath)
      .on("end", async () => {
        console.log("Video processing complete.");

        const fileStream = fs.createReadStream(outputFilePath);
        const s3Key = `${uuidv4()}-${file.originalname}`;
        const params = {
          Bucket: bucketName,
          Key: s3Key,
          Body: fileStream,
        };

        const response = await s3.upload(params).promise();

        fs.unlink(inputFilePath, (err) => {
          if (err) console.error("Error deleting the original file:", err);
          else console.log("Original file deleted successfully.");
        });
        fs.unlink(outputFilePath, (err) => {
          if (err) console.error("Error deleting the processed file:", err);
          else console.log("Processed file deleted successfully.");
        });

        res.status(200).json({
          message: "File uploaded successfully",
          s3Key: s3Key,
          url: response.Location,
        });
      })
      .on("error", (err) => {
        console.error("Error processing video:", err);
        res.status(500).json({ error: "Failed to process video" });
      })
      .run();
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

  export default uploadRouter;
  

