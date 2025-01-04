    
export   const convertToSRT = (text) => {
    const words = text.split(" ").filter(word => word.trim() !== '');  
    let srtContent = '';
    let index = 1;
    let startTime = 0;
    const durationPerGroup = 3; 

    for (let i = 0; i < words.length; i += 4) {
      const wordGroup = words.slice(i, i + 4); 
      const groupDuration = durationPerGroup; 

      const startMinutes = Math.floor(startTime / 60);
      const startSeconds = Math.floor(startTime % 60);
      const endTime = startTime + groupDuration;
      const endMinutes = Math.floor(endTime / 60);
      const endSeconds = Math.floor(endTime % 60);

      const startTimeStr = `${startMinutes.toString().padStart(2, '0')}:${startSeconds.toString().padStart(2, '0')},000`;
      const endTimeStr = `${endMinutes.toString().padStart(2, '0')}:${endSeconds.toString().padStart(2, '0')},000`;

      srtContent += `${index}\n${startTimeStr} --> ${endTimeStr}\n${wordGroup.join(' ')}\n\n`;

      startTime = endTime;  
      index++;  
    }

    return srtContent;
  };

export const handleDownload = (filename,Content,showToast) => {
    const srtContent=convertToSRT(Content);
    const blob = new Blob([srtContent], { type: 'text/srt' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename || 'subtitles'}.srt`;
    showToast(`${filename} saved successfully..!`,"success");
    link.click();
  };