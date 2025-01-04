import { API_Get_Transcript } from "@apirequest/apiUrls";

const handleGetTranscriptRequest = async(
  uploadProgress,
  s3Key,
  selectedLanguage,
  setOriginalTranscript,
  setTranslatedTranscript,
  setTranscriptionReady,
  setdetectedLanguage,
  showToast
) =>{
    if(uploadProgress!=100)
    {
      showToast("Upload Video to Continue!", "warn");
      return;
    }
    try {
        const response = await fetch(`${API_Get_Transcript}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            s3Key:s3Key,
            targetLanguage:selectedLanguage,
          }),
        });
  
        if (response.ok) {
          const data = await response.json(); 
          showToast(data.message,"success");
          setOriginalTranscript(data.originalTranscript);
          setTranslatedTranscript(data.translatedTranscript);
          setdetectedLanguage(data.detectedLanguage);
          setTranscriptionReady(true);

        } else {
          const errorData = await response.json(); 
          showToast(errorData.message,"error");
        }
      } catch (err) {
        showToast("Failed to connect to the server. Please try again.!", "error");
      } 
  }


  export default handleGetTranscriptRequest;