// Import the AWS SDK
import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import uploadRouter from './routes/uploadRouter.js';
import processRouter from './routes/processRouter.js';

dotenv.config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Middleware to parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));


// 1. Upload File Endpoint

app.use("/upload",uploadRouter);

// 2. Process Uploaded File Endpoint

app.use("/process",processRouter);

//3. General Endpoint

app.get("/", (req, res) => {
  res.send("Welcome to Video2Words Server..!");
});

  
  // Start the Server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });