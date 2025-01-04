 export const handleConfirmationAction= (
    isConfirmed,
    setUserConfirmed,
    setConfirmationVisible,
    actionType,
    setTranscriptionReady,
    showToast,
    setUploadProgress,
    setUploadedVideo,
    setActionType
 ) => {
    setUserConfirmed(isConfirmed);
    setConfirmationVisible(false); 

    if (isConfirmed) {
      if (actionType === "retranscript") {

        setTranscriptionReady(false);
        showToast("Ready to Transcript", "info");

      } else if (actionType === "reupload") {
        setUploadProgress(0);
        setUploadedVideo(null);
        setTranscriptionReady(false);
        showToast("Ready to Re-upload", "info");
      }
    } else {
      showToast("Action canceled", "warn");
    }
    setActionType("");
  };