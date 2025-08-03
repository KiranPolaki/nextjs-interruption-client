"use client";

import React, { useEffect } from "react";

const Panorama = () => {
  useEffect(() => {
    let link: HTMLLinkElement;
    let preloadLink: HTMLLinkElement;
    let script: HTMLScriptElement;
    let intervalId: NodeJS.Timeout;

    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://panorama-slider.uiinitiative.com/assets/index.c1d53924.css";
    document.head.appendChild(link);

    preloadLink = document.createElement("link");
    preloadLink.rel = "modulepreload";
    preloadLink.href =
      "https://panorama-slider.uiinitiative.com/assets/vendor.dba6b2d2.js";
    document.head.appendChild(preloadLink);

    script = document.createElement("script");
    script.type = "module";
    script.crossOrigin = "anonymous";
    script.src =
      "https://panorama-slider.uiinitiative.com/assets/index.d2ce9dca.js";

    const initializeAutoscroll = () => {
      setTimeout(() => {
        const swiperContainer = document.querySelector(".swiper");
        if (swiperContainer) {
          const swiperInstance = (swiperContainer as any).swiper;

          if (swiperInstance) {
            console.log("Found existing swiper instance, enabling autoplay");

            if (swiperInstance.autoplay) {
              swiperInstance.autoplay.start();
            } else {
              let currentSlide = 0;
              const totalSlides =
                document.querySelectorAll(".swiper-slide").length;

              const autoSlide = () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                swiperInstance.slideTo(currentSlide);
              };

              intervalId = setInterval(autoSlide, 3000);

              swiperContainer.addEventListener("mouseenter", () => {
                if (intervalId) clearInterval(intervalId);
              });

              swiperContainer.addEventListener("mouseleave", () => {
                intervalId = setInterval(autoSlide, 3000);
              });
            }
          } else {
            const allGlobals = Object.keys(window);
            console.log(
              "Available globals:",
              allGlobals.filter(
                (key) =>
                  key.toLowerCase().includes("swiper") ||
                  key.toLowerCase().includes("slide") ||
                  key.toLowerCase().includes("panorama")
              )
            );

            // Manual slide progression as fallback
            let currentSlide = 0;
            const slides = document.querySelectorAll(".swiper-slide");
            const totalSlides = slides.length;

            if (totalSlides > 0) {
              const autoSlide = () => {
                // Remove active class from current slide
                slides.forEach((slide) =>
                  slide.classList.remove("swiper-slide-active")
                );

                // Add active class to next slide
                currentSlide = (currentSlide + 1) % totalSlides;
                slides[currentSlide].classList.add("swiper-slide-active");

                // Update transform for 3D effect (if applicable)
                const wrapper = document.querySelector(".swiper-wrapper");
                if (wrapper) {
                  (wrapper as HTMLElement).style.transform = `translate3d(-${
                    currentSlide * 100
                  }%, 0px, 0px)`;
                }
              };

              intervalId = setInterval(autoSlide, 3000);

              // Pause on hover
              swiperContainer.addEventListener("mouseenter", () => {
                if (intervalId) clearInterval(intervalId);
              });

              swiperContainer.addEventListener("mouseleave", () => {
                intervalId = setInterval(autoSlide, 3000);
              });
            }
          }
        } else {
          console.log("Swiper container not found, retrying...");
          setTimeout(initializeAutoscroll, 500);
        }
      }, 1000);
    };

    script.onload = () => {
      console.log("Panorama script loaded");
      initializeAutoscroll();
    };

    script.onerror = () => {
      console.error("Failed to load panorama script");
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }

      if (link && document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (preloadLink && document.head.contains(preloadLink)) {
        document.head.removeChild(preloadLink);
      }
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <div className="panorama-slider">
        <div className="swiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <img
                className="slide-image"
                src="https://cdn.pixabay.com/photo/2023/07/19/12/16/car-8136751_1280.jpg"
                alt="Car"
              />
            </div>
            <div className="swiper-slide">
              <img
                className="slide-image"
                src="https://cdn.pixabay.com/photo/2023/03/22/07/52/lizard-7868932_1280.jpg"
                alt="Lizard"
              />
            </div>
            <div className="swiper-slide">
              <img
                className="slide-image"
                src="https://cdn.pixabay.com/photo/2016/11/14/04/45/elephant-1822636_1280.jpg"
                alt="Elephant"
              />
            </div>
            <div className="swiper-slide">
              <img
                className="slide-image"
                src="https://cdn.pixabay.com/photo/2023/10/19/21/08/ai-generated-8327632_1280.jpg"
                alt="AI Generated"
              />
            </div>
            <div className="swiper-slide">
              <img
                className="slide-image"
                src="https://cdn.pixabay.com/photo/2016/05/18/10/52/buick-1400243_1280.jpg"
                alt="Buick"
              />
            </div>
            <div className="swiper-slide">
              <img
                className="slide-image"
                src="https://cdn.pixabay.com/photo/2023/03/27/08/53/woman-7880177_1280.jpg"
                alt="Woman"
              />
            </div>
            <div className="swiper-slide">
              <img
                className="slide-image"
                src="https://cdn.pixabay.com/photo/2019/08/08/23/33/car-4393990_1280.jpg"
                alt="Car"
              />
            </div>
            <div className="swiper-slide">
              <img
                className="slide-image"
                src="https://cdn.pixabay.com/photo/2019/09/04/02/52/forest-4450611_1280.jpg"
                alt="Forest"
              />
            </div>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </>
  );
};

export default Panorama;
