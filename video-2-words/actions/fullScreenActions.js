export const enterFullScreen = (element, setViewMode) => {
    
    setViewMode("full-screen");
    
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // For Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // For Chrome, Safari, and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // For IE/Edge
      element.msRequestFullscreen();
    }

  };
  


export const exitFullScreen = (setViewMode) => {

    console.log("Exiting fullscreen...");
    setViewMode("side-by-side");

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // For Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // For Chrome, Safari, and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // For IE/Edge
      document.msExitFullscreen();
    }
  };