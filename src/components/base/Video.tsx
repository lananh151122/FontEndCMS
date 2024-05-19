
import React, { ReactNode } from 'react';

interface VideoBackgroundProps {
  videoUrl?: string;
  children?: ReactNode;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl, children }) => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <video
        id='login-video'
        autoPlay
        loop
        muted
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1, // Send the video to the background
        }}
      >
        <source src={videoUrl || 'bg-login.mp4'} type="video/mp4" />
      </video>
      {children}
    </div>
  );
};

export default VideoBackground;
