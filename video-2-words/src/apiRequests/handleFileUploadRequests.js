import { API_Video_Upload } from "@apirequest/apiUrls";

const handleFileUploadRequest = async (
  e,
  setUploadProgress,
  setUploadedVideo,
  setS3url,
  sets3Key,
  showToast
) => {

    const file = e.target.files[0];
    setUploadProgress(0); 
    let interval;
    if (file) {
  
      const formData = new FormData();
      formData.append("file", file);
      const videoURL = URL.createObjectURL(file);

      try {
        interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval); 
              return prev;
            }
            return prev + 5; 
          });
        }, 1000); 
  
        const response = await fetch(`${API_Video_Upload}`, {
          method: "POST",
          body: formData,
        });

        clearInterval(interval); 
        setUploadProgress(90);
        
        if (response.ok) {
          const data = await response.json();
          setUploadedVideo(videoURL);

          setTimeout(() => {
          }, 2000);
      
          setUploadProgress(100); 
          showToast("Video Uploaded Sucessfully","success");
          setS3url(data.url);
          sets3Key(data.s3Key);

        } else {
          const error = await response.json();
          setUploadProgress(0);
          clearInterval(interval); 

          showToast("Error Uploading Video,Please try again..!","error");
        }
      } catch (error) {
        setUploadProgress(0); 
        clearInterval(interval); 

        showToast("Please try again later..!","error");
      }
    }
  };


export default handleFileUploadRequest;
