"use client";

import React, { useEffect, useRef, useState } from "react";

export default function LivenessDetectionStep() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Liveness detection
      </h2>

      <p className="text-sm text-muted-foreground mb-6">
        Please position your face within the frame and follow the on-screen
        instructions to complete the liveness verification.
      </p>

      <div
        className="
          relative
          w-full h-56
          bg-muted/40
          border border-border
          rounded-sm
          overflow-hidden
          shadow-sm
          ring-1 ring-black/5
        "
      >
        <video
          ref={videoRef}
          muted
          playsInline
          className="w-full h-full object-cover scale-x-[-1]"
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-40 h-52 border-2 border-white/70 rounded-full" />
        </div>

        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/60">
            <span className="text-sm text-muted-foreground">
              Initializing camera…
            </span>
          </div>
        )}
      </div>

      <div className="pt-6">
        <button
          type="button"
          className="
            w-full bg-primary text-primary-foreground
            py-2 rounded
            hover:bg-primary/90
            transition-colors
          "
        >
          Start validation
        </button>
      </div>
    </>
  );
}
