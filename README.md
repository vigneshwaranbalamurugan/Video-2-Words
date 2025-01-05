# Video2Words

**Video2Words** is a web application that allows users to upload a video file and receive a transcript of the original audio along with a translated version of the transcript in their desired language. This project leverages AWS cloud services to handle transcription, translation, and secure file storage.

---

## Features

- **Upload Video**: Upload video files directly through the web interface.
- **Audio Transcription**: Extract audio from the video and generate a transcript using AWS Transcribe.
- **Text Translation**: Translate the original transcript into the desired language using AWS Translate.
- **Secure Storage**: Store uploaded files securely in an AWS S3 bucket.

---

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend**: [Node.js](https://nodejs.org/)
- **Cloud Services**: AWS S3, AWS Transcribe, AWS Translate

---

## How to Run the Project

### 🐳 Running with Docker Compose

To run the project using Docker Compose, follow these steps:

### Step 1: Create a Docker Network (if not already created)

```bash
docker network create video2words
```
### Step 2: Run Docker Compose
```bash
docker-compose up --build
```
### Step 3: Stop Docker Containers
```bash
docker-compose down
```
---

### Running without Docker

### Prerequisites
 - Ensure Node.js and FFmpeg are installed on your system:
 - Download Node.js (LTS version) from https://nodejs.org/
 - Download FFmpeg from https://ffmpeg.org/download.html and add it to your system's PATH.

---

### Step 1: Set Up AWS Services

1. **Create an S3 Bucket**:
   - Go to the [AWS Management Console](https://aws.amazon.com/console/).
   - Navigate to **S3** and create a new bucket.
   - Note down the bucket name and region.

2. **Set Up IAM User**:
   - Go to **AWS IAM Console**.
   - Create a new IAM user.
   - Assign the following policies to the user:
     - `AmazonS3FullAccess`
     - `TranslateFullAccess`
     - `TranscribeFullAccess`
   - Download the **Access Key ID** and **Secret Access Key**.

> **Note**: If the required policies are not present, you can create them:
   - Navigate to **IAM Policies** in the AWS Console.
   - Select **Create Policy**.
   - Choose the necessary permissions for `S3`, `Translate`, and `Transcribe` services.

---

### Step 2: Configure Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/vigneshwaranbalamurugan/Video-2-Words.git
   cd video-2-words
   ```
## Step 2: Configure the Backend

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Create a `.env` file and add the following environment variables:

    ```env
    AWS_ACCESS_KEY_ID=your-access-key-id
    AWS_SECRET_ACCESS_KEY=your-secret-access-key
    AWS_REGION=your-region
    AWS_S3_BUCKET_NAME=your-bucket-name
    ```

    Use the provided `.env.example` file as a template.

3. Install backend dependencies and start the server:

    ```bash
    npm install
    npm start
    ```

---

## Step 3: Configure the Frontend

1. Navigate to the frontend directory:

    ```bash
    cd video-2-words
    ```

2. Install frontend dependencies and start the development server:

    ```bash
    npm install
    npm run dev
    ```

---

## Step 4: Access the Application

Open your browser and go to:

[http://localhost:3000](http://localhost:3000)


---

## 📄 Environment Variables Format

The `.env` file in the `backend` directory should have the following format:

```plaintext
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_S3_BUCKET_NAME=your-bucket-name
```

---



## ✨ Author

**Vigneshwaran Balamurugan**  
Feel free to connect via [LinkedIn](https://www.linkedin.com/in/vignesh-waran-bala/) or [GitHub](https://github.com/vigneshwaranbalamurugan).
