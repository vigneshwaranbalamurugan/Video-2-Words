export const enterFullScreen = (element, setViewMode) => {

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) { 
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) { 
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) { 
    element.msRequestFullscreen();
  }
  setViewMode("full-screen");

  };
  


  export const exitFullScreen = (setViewMode) => {
    console.log("Checking if in fullscreen mode...");
  
    if (
      document.fullscreenElement || 
      document.webkitFullscreenElement || 
      document.mozFullScreenElement || 
      document.msFullscreenElement 
    ) {
  
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
  
      setViewMode("side-by-side");
    } else {
      setViewMode("side-by-side");
    }
  };
  