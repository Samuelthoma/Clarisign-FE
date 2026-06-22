import { useEffect, useRef, useState, useCallback } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

interface LivenessDetectionStepProps {
  onNext: (base64Image: string) => void;
  isSubmitting?: boolean;
  error?: string;
}

const RIGHT_EYE = [33, 160, 158, 133, 153, 144];
const LEFT_EYE = [362, 385, 387, 263, 373, 380];

const EAR_THRESHOLD = 0.25;
const YAW_THRESHOLD_LEFT = 0.35;
const YAW_THRESHOLD_RIGHT = 0.65;
const SMILE_THRESHOLD = 0.42;

const euclideanDistance = (p1: any, p2: any) =>
  Math.hypot(p1.x - p2.x, p1.y - p2.y);

const calculateEAR = (landmarks: any[], indices: number[]) => {
  const horizontal = euclideanDistance(
    landmarks[indices[0]],
    landmarks[indices[3]],
  );
  const v1 = euclideanDistance(landmarks[indices[1]], landmarks[indices[5]]);
  const v2 = euclideanDistance(landmarks[indices[2]], landmarks[indices[4]]);
  return (v1 + v2) / (2.0 * horizontal);
};

const calculateYawRatio = (landmarks: any[]) => {
  const nose = landmarks[1];
  const leftEdge = landmarks[234];
  const rightEdge = landmarks[454];
  const faceWidth = rightEdge.x - leftEdge.x;
  return (nose.x - leftEdge.x) / faceWidth;
};

const calculateSmileRatio = (landmarks: any[]) => {
  const leftMouth = landmarks[61];
  const rightMouth = landmarks[291];
  const leftEdge = landmarks[234];
  const rightEdge = landmarks[454];
  return (
    euclideanDistance(leftMouth, rightMouth) /
    euclideanDistance(leftEdge, rightEdge)
  );
};

const getFacePositionStatus = (landmarks: any[]) => {
  const nose = landmarks[1];
  const leftEdge = landmarks[234];
  const rightEdge = landmarks[454];
  const faceWidth = rightEdge.x - leftEdge.x;

  if (nose.x < 0.35 || nose.x > 0.65 || nose.y < 0.3 || nose.y > 0.7)
    return "Please center your face.";
  if (faceWidth < 0.3) return "Move closer to the camera.";
  if (faceWidth > 0.7) return "Move a bit further back.";
  return "good";
};

const BASE_CHALLENGES = [
  { id: "blink", text: "Please blink your eyes naturally." },
  { id: "turn", text: "Slowly turn your head to the left or right." },
  { id: "smile", text: "Look straight and give a big smile!" },
];

export default function LivenessDetectionStep({
  onNext,
  isSubmitting,
  error,
}: LivenessDetectionStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [modelReady, setModelReady] = useState(false);

  const [validationStatus, setValidationStatus] = useState<
    "idle" | "validating" | "success" | "failed"
  >("idle");
  const [instruction, setInstruction] = useState(
    "Position your face within the frame and click start.",
  );
  const [extractedImage, setExtractedImage] = useState<string | null>(null);

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stepIndexRef = useRef<number>(0);
  const blinkHistoryRef = useRef<boolean>(false);
  const isTransitioningRef = useRef<boolean>(false);
  const capturedImageRef = useRef<string | null>(null);
  const activeChallengesRef = useRef<any[]>([]);
  const challengeStartTimeRef = useRef<number>(0);

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
        setInstruction("Camera access denied or unavailable.");
      }
    };
    startCamera();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  useEffect(() => {
    const initModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        );
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU",
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1,
          },
        );
        setModelReady(true);
      } catch (error) {
        console.error("Error loading model:", error);
        setInstruction("Failed to load AI model. Please refresh.");
      }
    };
    initModel();
    return () => {
      faceLandmarkerRef.current?.close();
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const captureFrame = () => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const advanceStep = () => {
    isTransitioningRef.current = true;
    setInstruction("Great! Get ready...");

    setTimeout(() => {
      stepIndexRef.current += 1;
      const nextChallenge = activeChallengesRef.current[stepIndexRef.current];

      if (nextChallenge.id === "done") {
        setValidationStatus("success");
        setInstruction(nextChallenge.instruction);
        if (capturedImageRef.current)
          setExtractedImage(capturedImageRef.current);
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
      } else {
        setInstruction(nextChallenge.instruction);
        challengeStartTimeRef.current = performance.now();
        isTransitioningRef.current = false;
      }
    }, 1500);
  };

  const failValidation = (reason: string) => {
    setValidationStatus("failed");
    setInstruction(`Failed: ${reason}`);
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
  };

  const processVideo = useCallback(() => {
    if (!videoRef.current || !faceLandmarkerRef.current) return;

    if (
      isTransitioningRef.current ||
      activeChallengesRef.current[stepIndexRef.current]?.id === "done"
    ) {
      animationFrameRef.current = requestAnimationFrame(processVideo);
      return;
    }

    const now = performance.now();
    const results = faceLandmarkerRef.current.detectForVideo(
      videoRef.current,
      now,
    );

    if (now - challengeStartTimeRef.current > 8000) {
      failValidation(
        "Time expired. You must complete the action faster to prove liveness.",
      );
      return;
    }

    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];

      const positionStatus = getFacePositionStatus(landmarks);
      if (positionStatus !== "good") {
        setInstruction(`Warning: ${positionStatus}`);
        animationFrameRef.current = requestAnimationFrame(processVideo);
        return;
      }

      const currentChallenge =
        activeChallengesRef.current[stepIndexRef.current];
      if (instruction !== currentChallenge.instruction) {
        setInstruction(currentChallenge.instruction);
      }

      if (currentChallenge.id === "blink") {
        const averageEAR =
          (calculateEAR(landmarks, LEFT_EYE) +
            calculateEAR(landmarks, RIGHT_EYE)) /
          2;
        if (averageEAR < EAR_THRESHOLD) {
          blinkHistoryRef.current = true;
        } else if (blinkHistoryRef.current) {
          capturedImageRef.current = captureFrame();
          advanceStep();
          blinkHistoryRef.current = false;
        }
      } else if (currentChallenge.id === "turn") {
        const yawRatio = calculateYawRatio(landmarks);
        if (yawRatio < YAW_THRESHOLD_LEFT || yawRatio > YAW_THRESHOLD_RIGHT)
          advanceStep();
      } else if (currentChallenge.id === "smile") {
        const smileRatio = calculateSmileRatio(landmarks);
        if (smileRatio > SMILE_THRESHOLD) advanceStep();
      }
    } else {
      setInstruction("No face detected. Please step into the frame.");
    }

    animationFrameRef.current = requestAnimationFrame(processVideo);
  }, [instruction]);

  const handleStartValidation = () => {
    if (!modelReady || !cameraReady) return;

    const shuffled = [...BASE_CHALLENGES].sort(() => Math.random() - 0.5);
    const configuredChallenges = shuffled.map((c, i) => ({
      id: c.id,
      instruction: `${i + 1}/3: ${c.text}`,
    }));
    configuredChallenges.push({
      id: "done",
      instruction: "Liveness verified successfully!",
    });

    activeChallengesRef.current = configuredChallenges;
    stepIndexRef.current = 0;
    blinkHistoryRef.current = false;
    isTransitioningRef.current = false;
    challengeStartTimeRef.current = performance.now();

    setValidationStatus("validating");
    setExtractedImage(null);
    capturedImageRef.current = null;
    setInstruction(configuredChallenges[0].instruction);

    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    processVideo();
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Liveness detection
      </h2>

      <div
        className={`text-sm mb-6 p-3 rounded-md border transition-colors ${
          validationStatus === "success"
            ? "bg-green-500/10 border-green-500/50 text-green-600 font-medium"
            : validationStatus === "failed"
              ? "bg-red-500/10 border-red-500/50 text-red-600 font-medium"
              : validationStatus === "validating"
                ? "bg-blue-500/10 border-blue-500/50 text-blue-600 font-medium"
                : "bg-muted border-border text-muted-foreground"
        }`}
      >
        {instruction}
      </div>

      <div className="relative w-full aspect-3/4 md:aspect-video min-h-[400px] bg-muted/40 border border-border rounded-sm overflow-hidden shadow-sm ring-1 ring-black/5">
        <video
          ref={videoRef}
          muted
          playsInline
          className="w-full h-full object-cover scale-x-[-1]"
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-56 h-72 border-4 rounded-[100%] transition-all duration-300 ${
              validationStatus === "success"
                ? "border-green-500 bg-green-500/10"
                : validationStatus === "failed"
                  ? "border-red-500 bg-red-500/10"
                  : validationStatus === "validating"
                    ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                    : "border-white/70"
            }`}
          />
        </div>

        {(!cameraReady || !modelReady) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-muted-foreground">
                {!cameraReady ? "Connecting camera…" : "Loading AI model..."}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 space-y-3">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-sm">
            {error}
          </div>
        )}

        {validationStatus === "idle" && (
          <button
            type="button"
            onClick={handleStartValidation}
            disabled={!cameraReady || !modelReady}
            className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start validation
          </button>
        )}

        {validationStatus === "validating" && (
          <button
            disabled
            className="w-full bg-primary/70 text-primary-foreground py-2 rounded cursor-not-allowed"
          >
            Validating...
          </button>
        )}

        {(validationStatus === "success" || validationStatus === "failed") && (
          <>
            {validationStatus === "success" && extractedImage && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => onNext(extractedImage)}
                className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting
                  ? "Uploading & Verifying..."
                  : "Continue Verification"}
              </button>
            )}
            <button
              type="button"
              onClick={handleStartValidation}
              className="w-full bg-secondary text-secondary-foreground py-2 rounded border border-border hover:bg-secondary/80 transition-colors"
            >
              Retry Validation
            </button>
          </>
        )}
      </div>
    </>
  );
}