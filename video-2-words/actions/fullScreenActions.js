export const enterFullScreen = (element, setViewMode) => {

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) { // For Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) { // For Chrome, Safari, and Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) { // For IE/Edge
    element.msRequestFullscreen();
  }
  setViewMode("full-screen");

  };
  


export const exitFullScreen = (setViewMode) => {

    console.log("Exiting fullscreen...");

    if (document.exitFullscreen) {
      document.exitFullscreen();
      setViewMode("side-by-side");
    } else if (document.mozCancelFullScreen) { // For Firefox
      document.mozCancelFullScreen();
      setViewMode("side-by-side");
    } else if (document.webkitExitFullscreen) { // For Chrome, Safari, and Opera
      document.webkitExitFullscreen();
      setViewMode("side-by-side");
    } else if (document.msExitFullscreen) { // For IE/Edge
      document.msExitFullscreen();
      setViewMode("side-by-side");
    }
    
  };