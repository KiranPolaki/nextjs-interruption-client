"use client";

import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const TARGET_PARAGRAPH = "The quick brown fox jumps over the lazy dog.";
const BACKEND_URL = "http://localhost:8000";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Click 'Start Reading' to begin."
  );

  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io(BACKEND_URL);

    socketRef.current.on("connect", () => {
      console.log("Connected to backend");
    });

    // Listen for interruptions from the server
    socketRef.current.on("interruption", (data: { audio: string }) => {
      console.log("Interruption received!");
      setStatusMessage("Oops! Let's correct that.");

      // Stop recording to prevent feedback loops
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }

      // Play the corrective audio
      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
      audio.play();

      // After the correction is played, allow the user to resume
      audio.onended = () => {
        setStatusMessage("Ready to continue. Click 'Start Reading' again.");
        setIsRecording(false); // Reset the button state
        // Signal the backend that we are ready to resume
        socketRef.current?.emit("resume_reading");
      };
    });

    return () => {
      // Cleanup on component unmount
      socketRef.current?.disconnect();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && socketRef.current) {
          // Send audio chunk to the backend
          socketRef.current.emit("audio_stream", event.data);
        }
      };

      mediaRecorderRef.current.onstart = () => {
        setIsRecording(true);
        setStatusMessage("Listening... Please start reading.");
      };

      // We stop and restart the recorder every 2 seconds to send manageable chunks
      // The backend will buffer them.
      mediaRecorderRef.current.start(2000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setStatusMessage("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setStatusMessage(
      "Recording stopped. Click 'Start Reading' to begin again."
    );
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <main
      style={{ fontFamily: "sans-serif", textAlign: "center", padding: "2rem" }}
    >
      <h1>Real-time Reading Interruption AI</h1>
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <h2>Please Read This Paragraph Aloud:</h2>
        <p style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
          {TARGET_PARAGRAPH}
        </p>
      </div>
      <div style={{ margin: "2rem 0" }}>
        <button
          onClick={handleToggleRecording}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            cursor: "pointer",
            backgroundColor: isRecording ? "#e74c3c" : "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {isRecording ? "Stop Reading" : "Start Reading"}
        </button>
      </div>
      <p style={{ fontSize: "1.1rem", fontStyle: "italic" }}>
        <strong>Status:</strong> {statusMessage}
      </p>
    </main>
  );
}
