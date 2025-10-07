// src/utils/useFlickity.js
import { useEffect } from "react";
import Flickity from "flickity";
import "flickity/css/flickity.css";

const useFlickity = (ref, options = {}) => {
  useEffect(() => {
    // Capture the element from the ref at the start of the effect.
    const carouselElement = ref.current;
    
    // Early exit if the element doesn't exist when the effect runs.
    if (!carouselElement) return;

    // Initialize Flickity on the captured element.
    const flickityInstance = new Flickity(carouselElement, {
      wrapAround: true,
      prevNextButtons: false,
      pageDots: false,
      draggable: true,
      freeScroll: true,
      autoPlay: false,
      imagesLoaded: true,
      cellAlign: "left",
      ...options,
    });

    let animationFrame;
    let isHovered = false;

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };

    // Add event listeners to the captured element.
    carouselElement.addEventListener("mouseenter", handleMouseEnter);
    carouselElement.addEventListener("mouseleave", handleMouseLeave);

    const ticker = () => {
      if (!flickityInstance.isDragging && !isHovered) {
        // Use the speed from options, defaulting to 0.5
        const speed = options.speed || 0.5;
        flickityInstance.x = (flickityInstance.x - speed) % flickityInstance.slideableWidth;
        flickityInstance.updateSelectedSlide();
        flickityInstance.settle(flickityInstance.x);
      }
      animationFrame = requestAnimationFrame(ticker);
    };
    ticker();

    // The Cleanup Function
    return () => {
      cancelAnimationFrame(animationFrame);
      flickityInstance.destroy();
      
      // Use the SAME captured element for cleanup, which is 100% safe.
      carouselElement.removeEventListener("mouseenter", handleMouseEnter);
      carouselElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, options]); // Dependencies
};

export default useFlickity;