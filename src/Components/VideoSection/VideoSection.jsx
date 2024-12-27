// VideoSection.js
import React from 'react';
import './VideoSection.css';

function VideoSection() {
  return (
    <div className="video-section">
      <video
        src="./images/tkr.mp4"
        autoPlay
        loop
        muted
        className="video"
        style={{ boxShadow: '0px 0px 20px rgb(255, 255, 255)' }}
      ></video>
    </div>
  );
}

export default VideoSection;