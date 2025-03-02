"use client";
import React, { useEffect, useRef, useState } from "react";
import getUserMedia from "getusermedia"; // Import getUserMedia library

const CameraFeed = () => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);  // Client-side detection

  useEffect(() => {
    // Ensure the component is rendered on the client-side
    setIsClient(true);

    // Request camera access using the getUserMedia helper
    getUserMedia({ video: true, audio: false }, (err, stream) => {
      if (err) {
        console.error("Error accessing camera: " + err.message);
        setHasError(true);
        setIsLoading(false);
      } else {
        // Attach the video stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsLoading(false);
      }
    });
  }, []);

  if (!isClient) {
    return null;  // Prevent rendering on the server side
  }

  if (isLoading) {
    return (
      <div style={{ border: "1px solid black", padding: "10px", marginTop: "10px" }}>
        <h3>📹 Camera Feed</h3>
        <p>Loading camera feed...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div style={{ border: "1px solid black", padding: "10px", marginTop: "10px" }}>
        <h3>📹 Camera Feed</h3>
        <p>There was an error accessing the camera. Please ensure your browser supports camera access and that you are using HTTPS.</p>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid black", padding: "10px", marginTop: "10px" }}>
      <h3>📹 Camera Feed</h3>
      <video ref={videoRef} autoPlay width="640" height="480" />
    </div>
  );
};

export default CameraFeed;
