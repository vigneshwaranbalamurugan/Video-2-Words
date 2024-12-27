import { API_Video_Upload } from "./apiUrl";

const handleFileUploadRequest = async (e,setUploadProgress,setUploadedVideo,setS3url,sets3Key) => {

    const file = e.target.files[0];
    setUploadProgress(0); 
  
    if (file) {
  
      const formData = new FormData();
      formData.append("file", file);
      const videoURL = URL.createObjectURL(file);

      try {
        // Simulate progress for the UI while uploading
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval); 
              return prev;
            }
            return prev + 5; 
          });
        }, 1000); 
  
        // Send the file to the backend
        const response = await fetch(`${API_Video_Upload}`, {
          method: "POST",
          body: formData,
        });
  
        clearInterval(interval); 
  
        if (response.ok) {
          const data = await response.json();
          setUploadedVideo(videoURL);

          setUploadProgress(100); 
  
          setS3url(data.url);
          sets3Key(data.s3Key);

          alert(`Upload successful: ${data.message}`);
        } else {
          const error = await response.json();
          setUploadProgress(0);
          alert(`Upload failed: ${error.message}`);
        }
      } catch (error) {
        setUploadProgress(0); 
        console.error("Error uploading file:", error);
        alert("An error occurred while uploading.");
      }
    }
  };


  export default handleFileUploadRequest;