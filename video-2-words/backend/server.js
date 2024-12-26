// Import the AWS SDK
import express from 'express';
import dotenv from "dotenv";
import multer from "multer";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import core from "cors";
import bodyParser from "body-parser";

dotenv.config();


const app = express();
const port = process.env.PORT || 5000;

app.use(core());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Middleware to parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Configure the AWS SDK with your credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  region: process.env.AWS_REGION, 
});


const s3 = new AWS.S3();
const transcribeService = new AWS.TranscribeService();
const translateService = new AWS.Translate();

// S3 Bucket Name
const bucketName = process.env.S3_BUCKET_NAME;

// Multer configuration for file uploads
const upload = multer({ dest: "uploads/" });


// 1. Upload File Endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
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
      res.status(200).json({ message: "File uploaded successfully", s3Key: s3Key, url: response.Location });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });
  
//Supported Languages 

const allSupportedLanguages = [
  "af-ZA", "ar-AE", "ar-SA", "da-DK", "de-CH", "de-DE", "en-AB", "en-AU", "en-GB", "en-IE", 
  "en-IN", "en-US", "en-WL", "es-ES", "es-US", "fa-IR", "fr-CA", "fr-FR", "he-IL", "hi-IN", 
  "id-ID", "it-IT", "ja-JP", "ko-KR", "ms-MY", "nl-NL", "pt-BR", "pt-PT", "ru-RU", "ta-IN", 
  "te-IN", "tr-TR", "zh-CN", "zh-TW"
];

  // 2. Process Uploaded File Endpoint
app.post("/process", async (req, res) => {
    try {
      const { s3Key, targetLanguage } = req.body;
      // Start Transcription Job
      const transcriptionJobName = `transcription-job-${uuidv4()}`;
      const transcriptionParams = {
        TranscriptionJobName: transcriptionJobName,
        Media: { MediaFileUri: `s3://${bucketName}/${s3Key}` },
        OutputBucketName: bucketName, // Where the transcription result will be stored
        IdentifyLanguage: true, // Enable automatic language identification
        LanguageOptions: allSupportedLanguages, // Use all supported languages explicitly
      };
  
      await transcribeService.startTranscriptionJob(transcriptionParams).promise();
  
      // Wait for Transcription Job to Complete
      let transcriptionJob;
      do {
        transcriptionJob = await transcribeService
          .getTranscriptionJob({ TranscriptionJobName: transcriptionJobName })
          .promise();
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before checking again
      } while (transcriptionJob.TranscriptionJob.TranscriptionJobStatus === "IN_PROGRESS");
  
      if (transcriptionJob.TranscriptionJob.TranscriptionJobStatus !== "COMPLETED") {
        throw new Error("Transcription job failed");
      }
  
      // Get the Transcript URL
      const transcriptFileUri = transcriptionJob.TranscriptionJob.Transcript.TranscriptFileUri;
  
      // Fetch the Transcript from S3
      const transcriptResponse = await fetch(transcriptFileUri);
      const transcriptData = await transcriptResponse.json();
      const originalTranscript = transcriptData.results.transcripts[0].transcript;
  
      // Get the Detected Language
      const detectedLanguage = transcriptionJob.TranscriptionJob.LanguageCode; // Language detected by Transcribe
      console.log(detectedLanguage);

      // Translate the Transcript into Target Language
      const translateParams = {
        Text: originalTranscript,
        SourceLanguageCode: detectedLanguage, // Default source language (English)
        TargetLanguageCode: targetLanguage, // Target language specified by the user
      };
  
      const translationResponse = await translateService.translateText(translateParams).promise();
      const translatedTranscript = translationResponse.TranslatedText;
  
      const filesToDelete = [
        ".write_access_check_file.temp",    // Replace with the actual path if needed
        `${transcriptionJobName}.json`,    // Replace with the actual path if needed
      ];

      for (const fileKey of filesToDelete) {
        await s3
          .deleteObject({
            Bucket: bucketName,
            Key: fileKey, // File path in S3 bucket
          })
          .promise();
      }

      res.status(200).json({
        message:"success",
        originalTranscript,
        translatedTranscript,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      res.status(500).json({ error: "Failed to process file" });
    }
  });
  
  // Start the Server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });