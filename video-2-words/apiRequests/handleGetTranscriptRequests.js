
const handleGetTranscriptRequest = async(uploadProgress,s3Key,selectedLanguage,setOriginalTranscript,setTranslatedTranscript,setTranscriptionReady) =>{
    if(uploadProgress!=100)
    {
      alert("Upload Video");
      return;
    }
    try {
        // Sending POST request to the backend
        const response = await fetch("http://localhost:5000/process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            s3Key:s3Key,
            targetLanguage:selectedLanguage,
          }),
        });
  
        // Handling the response
        if (response.ok) {
          const data = await response.json(); 
          alert(data.message);
          setOriginalTranscript(data.originalTranscript);
          setTranslatedTranscript(data.translatedTranscript);
          setTranscriptionReady(true);
        } else {
          const errorData = await response.json(); 
          console.log(errorData);
        alert(errorData.message);
        }
      } catch (err) {
        console.log(err);
        alert("Failed to connect to the server. Please try again.");
      } 
  }


  export default handleGetTranscriptRequest;