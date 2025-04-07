import React, { createContext, useContext, useRef, useState } from 'react';

// Create a context for video
const VideoContext = createContext();

const useVideo = () => {
  return useContext(VideoContext);
};

const VideoProvider = ({ children }) => {
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <VideoContext.Provider value={{ videoRef, isVideoPlaying, setIsVideoPlaying }}>
      {children}
    </VideoContext.Provider>
  );
};

export { useVideo, VideoProvider }