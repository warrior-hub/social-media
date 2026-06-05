import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

const VideoPlayer = ({ media }) => {
  const videoTag = useRef();
  const [mute, setmute] = useState(true);
  const [isPlaying, setisPlaying] = useState(true);

  const handleClick = () => {
    if (isPlaying) {
      videoTag.current.pause();
      setisPlaying(false);
    } else {
      videoTag.current.play();
      setisPlaying(true);
    }
  };

  const handleMute = (e) => {
    e.stopPropagation();
    setmute((prev) => !prev);
  };

  useEffect(() => {
    const video = videoTag.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.6,
      },
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  return (
    <div className="h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden">
      <video
        ref={videoTag}
        src={media}
        autoPlay
        loop
        muted={mute}
        className="h-[100%] max-w-full object-cover"
        onClick={handleClick}
      />

      <div
        className="absolute bottom-[10px] right-[10px] z-10"
        onClick={handleMute}
      >
        {!mute ? (
          <FiVolume2 className="w-[20px] h-[20px] text-white" />
        ) : (
          <FiVolumeX className="w-[20px] h-[20px] text-white" />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
