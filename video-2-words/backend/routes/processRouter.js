import express from "express";
import { v4 as uuidv4 } from "uuid";
import { s3,transcribeService,translateService,bucketName } from '../config/awsConfig.js';
import { allSupportedLanguages } from '../constants/supportedLanguages.js';

const processRouter=express.Router();

processRouter.post("/transcript", async (req, res) => {
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
        SourceLanguageCode: detectedLanguage,
        TargetLanguageCode: targetLanguage, // Target language specified by the user
      };
  
      const translationResponse = await translateService.translateText(translateParams).promise();
      const translatedTranscript = translationResponse.TranslatedText;
  
      const filesToDelete = [
        ".write_access_check_file.temp",    
        `${transcriptionJobName}.json`,    
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

export default processRouter;