import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

// Configure the AWS SDK with  credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  region: process.env.AWS_REGION, 
});

//Setup S3 Bucket
const s3 = new AWS.S3();

//Setup AWS Transcribe Service
const transcribeService = new AWS.TranscribeService();

//Setup AWS Translate Service
const translateService = new AWS.Translate();

// S3 Bucket Name
const bucketName = process.env.S3_BUCKET_NAME;


export {s3,transcribeService,translateService,bucketName};