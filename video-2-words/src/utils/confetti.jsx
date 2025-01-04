import { useEffect } from "react";
import confetti from "canvas-confetti";

const Confetti = ({ isVisible, duration = 400 }) => {
  useEffect(() => {

    const end = Date.now() + duration;
    const colors = ["#00fff6", "#ff0066", "#ffdd00", "#ffffff"]; 

    const fireConfetti = () => {
      confetti({
        particleCount: Math.random() * 50 + 50, 
        startVelocity: Math.random() * 20 + 30,
        angle: Math.random() * 360, 
        spread: Math.random() * 120 + 60, 
        origin: {
          x: Math.random(), 
          y: Math.random() - 0.2, 
        },
        colors,
        scalar: Math.random() * 0.7 + 0.6, 
      });
    };

    (function frame() {
      fireConfetti();
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    return () => confetti.reset(); 
  }, [isVisible, duration]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: isVisible ? 1 : 0, 
        transition: "opacity 0.3s ease-in-out", 
      }}
    ></div>
  );
};

export default Confetti;
