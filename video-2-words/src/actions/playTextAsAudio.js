export const playTextAsAudio = (
    transcriptType,
    originalTranscript,
    translatedTranscript,
    setShowOriginalTranscript,
    setShowTranslatedTranscript,
    isPlaying,
    playingAudio,
    utteranceRef,
    detectedLanguage,
    selectedLanguage,
    setHighlightedIndex,
    setIsPlaying,
    setPlayingAudio,
    timeoutsRef
) => {
    const transcript =
      transcriptType === "original" ? originalTranscript : translatedTranscript;
  
    if (transcriptType === "original" && !isPlaying) {
      setShowOriginalTranscript(true);
    } else if (!isPlaying) {
      setShowTranslatedTranscript(true);
    }
  
    const words = transcript.split(" ");
  
    // If already playing the same transcript, stop it
    if (isPlaying && playingAudio === transcriptType) {
      stopAudio(
        setIsPlaying,
        timeoutsRef,
        setHighlightedIndex,
        setPlayingAudio
      );
      return;
    }
  
    // If another transcript is playing, stop it first
    if (isPlaying && playingAudio !== transcriptType) {
        stopAudio(
            setIsPlaying,
            timeoutsRef,
            setHighlightedIndex,
            setPlayingAudio
          );
    }
  
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(transcript);
    utteranceRef.current = utterance;
  
    // Set language and speech rate
    utterance.lang =
      transcriptType === "original" ? detectedLanguage : selectedLanguage;
    utterance.rate =
      transcriptType === "original" && detectedLanguage === "ta-IN"
        ? 1
        : selectedLanguage === "ta-IN"
        ? 1
        : 1;
  
    const baseSpeed =
      transcriptType === "original" && detectedLanguage === "ta-IN"
        ? 350
        : transcriptType != "original" && selectedLanguage === "ta-IN"
        ? 350
        : 250;
  
    // Calculate approximate timings for each word, adjusting for punctuation
    let currentTime = 0;
    const wordDurations = words.map((word) => {
      const hasPunctuation = /[.,?]/.test(word); 
      const durationFactor = hasPunctuation ? 2 : 1; 
      const duration = (word.length / 5) * (baseSpeed / utterance.rate) * durationFactor; 
      return duration;
    });
  
    words.forEach((_, index) => {
      const timeoutId = setTimeout(() => {
        setHighlightedIndex(index); 
      }, currentTime);
      timeoutsRef.current.push(timeoutId);
      currentTime += wordDurations[index];
    });
  
    // Clear highlight and reset at the end of the speech
    const endTimeout = setTimeout(() => {
      setHighlightedIndex(-1);
      setIsPlaying(false); 
      setPlayingAudio("none");
    }, currentTime);
    timeoutsRef.current.push(endTimeout); 
  
    utterance.onend = () => {
        stopAudio(
            setIsPlaying,
            timeoutsRef,
            setHighlightedIndex,
            setPlayingAudio
          ); 
    };
  
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setPlayingAudio(transcriptType); 
  };
  

  const stopAudio = (
    setIsPlaying,
    timeoutsRef,
    setHighlightedIndex,
    setPlayingAudio
  ) => {

    speechSynthesis.cancel();

    timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutsRef.current = []; 

    setIsPlaying(false);
    setHighlightedIndex(-1);
    setPlayingAudio("none");
  };
