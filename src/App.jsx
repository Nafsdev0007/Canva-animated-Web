import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import React, { useRef, useEffect } from "react";

function App() {
  const frames = {
    currentIndex: 0,
    finalIndex: 382,
  };
  const canvaRef = useRef();
  console.log(canvaRef.current);
  
  let images = [];
  let imagesLoaded = 0;

  function preloadImages() {
    for (let i = 1; i <= frames.finalIndex; i++) {
      const imageURL = `../compresesd_images/frame_${i.toString().padStart(4,'0')}.jpeg`;
      
      const img = new Image();

      img.src = imageURL;
      img.onload = () => {
        imagesLoaded += 1;
        if (imagesLoaded === frames.finalIndex) {
          loadImage(frames.currentIndex);
          ultimateAnim()
        }
      };

      images.push(img);
    }
  }

  function loadImage(index) {
    if (index >= 0 && index <= frames.finalIndex) {
      const img = images[index];
      const canvas = canvaRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      const scale = Math.max(scaleX, scaleY);

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      const offsetX = (canvas.width - newWidth) / 2;
      const offsetY = (canvas.height - newHeight) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(img, offsetX, offsetY, newWidth, newHeight);

      frames.currentIndex = index;
    }
  }

  function ultimateAnim() {
    const tl = gsap.timeline({
      scrollTrigger:{
        trigger:".parent",
        end:'bottom bottom',
        start:'top top',
        scrub:2,
      }
    });

    tl.to(frames,{
      currentIndex : frames.finalIndex,
      onUpdate: function(){
        loadImage(Math.floor(frames.currentIndex));
      }
    })
  }

  useEffect(() => {
    preloadImages();
  }, []);

  return (
    <div className="w-full">
      <div className="parent h-[800vh] w-full bg-black relative top-0 left-0">
        <div className="chld w-full anim_box h-screen sticky top-0 left-0">
          <canvas ref={canvaRef} id="frame" className="w-full h-full"></canvas>
        </div>
      </div>
    </div>
  );
}

export default App;