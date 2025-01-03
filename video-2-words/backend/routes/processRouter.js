import express from "express";
import { v4 as uuidv4 } from "uuid";
import { s3,transcribeService,translateService,bucketName } from '../config/awsConfig.js';
import { allSupportedLanguages } from '../constants/supportedLanguages.js';

const processRouter=express.Router();

processRouter.post("/transcript", async (req, res) => {
  try {
    console.log("Processing transcription...");
    const { s3Key, targetLanguage } = req.body;

    // Step 1: Start Transcription Job
    const transcriptionJobName = `transcription-job-${uuidv4()}`;
    const transcriptionParams = {
      TranscriptionJobName: transcriptionJobName,
      Media: { MediaFileUri: `s3://${bucketName}/${s3Key}` },
      OutputBucketName: bucketName,
      IdentifyLanguage: true,
      LanguageOptions: allSupportedLanguages, 
    };

    await transcribeService.startTranscriptionJob(transcriptionParams).promise();

    // Step 2: Wait for Transcription Job Completion (Optimized Polling with Backoff)
    let transcriptionJob;
    let waitTime = 5000;
    const maxRetries = 10;
    let retries = 0;

    do {
      if (retries > maxRetries) throw new Error("Transcription job timed out");
      transcriptionJob = await transcribeService
        .getTranscriptionJob({ TranscriptionJobName: transcriptionJobName })
        .promise();
      if (transcriptionJob.TranscriptionJob.TranscriptionJobStatus === "COMPLETED") break;
      if (transcriptionJob.TranscriptionJob.TranscriptionJobStatus === "FAILED")
        throw new Error("Transcription job failed");
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      waitTime *= 2;
      retries++;
    } while (true);

    // Step 3: Fetch Transcript from S3
    const transcriptFileUri = transcriptionJob.TranscriptionJob.Transcript.TranscriptFileUri;
    const transcriptResponse = await fetch(transcriptFileUri);
    const transcriptData = await transcriptResponse.json();
    const originalTranscript = transcriptData.results.transcripts[0].transcript;


    // Step 4: Translate Transcript
    const detectedLanguage = transcriptionJob.TranscriptionJob.LanguageCode;

    const translateParams = {
      Text: originalTranscript,
      SourceLanguageCode: detectedLanguage,
      TargetLanguageCode: targetLanguage,
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
          Key: fileKey, 
        })
        .promise();
    }
    
    // Step 5: Send Response with Both Transcripts
    res.status(200).json({
      message: "Successfully Transcribed and Translated...",
      originalTranscript,
      translatedTranscript,
      detectedLanguage
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
});


export default processRouter;