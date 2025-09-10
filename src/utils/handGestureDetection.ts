import { Hands, Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export interface HandLandmark {
  x: number;
  y: number;
}

export interface DetectedSign {
  sign: string;
  confidence: number;
}

// --- Gesture checkers for demo mapping ---
// Each function returns true if the gesture is detected.

function isOpenPalm(landmarks: HandLandmark[]): boolean {
  // All fingers extended vertically
  return (
    landmarks[8].y < landmarks[5].y &&
    landmarks[12].y < landmarks[9].y &&
    landmarks[16].y < landmarks[13].y &&
    landmarks[20].y < landmarks[17].y
  );
}

function isPeaceSign(landmarks: HandLandmark[]): boolean {
  // Index and middle extended, ring and pinky folded
  return (
    landmarks[8].y < landmarks[6].y &&
    landmarks[12].y < landmarks[10].y &&
    landmarks[16].y > landmarks[14].y &&
    landmarks[20].y > landmarks[18].y
  );
}

function isClosedFist(landmarks: HandLandmark[]): boolean {
  // All finger tips below base joints (bent)
  return (
    landmarks[8].y > landmarks[5].y &&
    landmarks[12].y > landmarks[9].y &&
    landmarks[16].y > landmarks[13].y &&
    landmarks[20].y > landmarks[17].y
  );
}

function isOKSign(landmarks: HandLandmark[]): boolean {
  // Thumb tip and index tip close together (circle)
  const dist = Math.hypot(
    landmarks[4].x - landmarks[8].x,
    landmarks[4].y - landmarks[8].y
  );
  return dist < 0.05;
}

function isILYSign(landmarks: HandLandmark[]): boolean {
  // Thumb, index, pinky extended; middle and ring folded
  return (
    landmarks[4].y < landmarks[2].y &&
    landmarks[8].y < landmarks[6].y &&
    landmarks[20].y < landmarks[18].y &&
    landmarks[12].y > landmarks[10].y &&
    landmarks[16].y > landmarks[14].y
  );
}

function isRaisedIndex(landmarks: HandLandmark[]): boolean {
  // Index extended, others folded
  return (
    landmarks[8].y < landmarks[6].y &&
    landmarks[12].y > landmarks[10].y &&
    landmarks[16].y > landmarks[14].y &&
    landmarks[20].y > landmarks[18].y &&
    landmarks[4].y > landmarks[2].y
  );
}

function isRaisedIndexMiddle(landmarks: HandLandmark[]): boolean {
  // Index and middle extended, others folded
  return (
    landmarks[8].y < landmarks[6].y &&
    landmarks[12].y < landmarks[10].y &&
    landmarks[16].y > landmarks[14].y &&
    landmarks[20].y > landmarks[18].y &&
    landmarks[4].y > landmarks[2].y
  );
}

function isThumbsUp(landmarks: HandLandmark[]): boolean {
  // Thumb tip above thumb MCP; others folded
  return (
    landmarks[4].y < landmarks[2].y &&
    landmarks[8].y > landmarks[6].y &&
    landmarks[12].y > landmarks[10].y &&
    landmarks[16].y > landmarks[14].y &&
    landmarks[20].y > landmarks[18].y
  );
}

function isThumbsDown(landmarks: HandLandmark[]): boolean {
  // Thumb tip below thumb MCP; others folded
  return (
    landmarks[4].y > landmarks[2].y &&
    landmarks[8].y > landmarks[6].y &&
    landmarks[12].y > landmarks[10].y &&
    landmarks[16].y > landmarks[14].y &&
    landmarks[20].y > landmarks[18].y
  );
}

function isRaisedPinky(landmarks: HandLandmark[]): boolean {
  // Pinky extended, others folded
  return (
    landmarks[20].y < landmarks[18].y &&
    landmarks[8].y > landmarks[6].y &&
    landmarks[12].y > landmarks[10].y &&
    landmarks[16].y > landmarks[14].y &&
    landmarks[4].y > landmarks[2].y
  );
}

function isRaisedRing(landmarks: HandLandmark[]): boolean {
  // Ring extended, others folded
  return (
    landmarks[16].y < landmarks[14].y &&
    landmarks[8].y > landmarks[6].y &&
    landmarks[12].y > landmarks[10].y &&
    landmarks[20].y > landmarks[18].y &&
    landmarks[4].y > landmarks[2].y
  );
}

function isRaisedIndexPinky(landmarks: HandLandmark[]): boolean {
  // Index and pinky extended, others folded ("rock on" gesture)
  return (
    landmarks[8].y < landmarks[6].y &&
    landmarks[20].y < landmarks[18].y &&
    landmarks[12].y > landmarks[10].y &&
    landmarks[16].y > landmarks[14].y &&
    landmarks[4].y > landmarks[2].y
  );
}

function isRaisedIndexMiddleThumb(landmarks: HandLandmark[]): boolean {
  // Index, middle, thumb extended; others folded
  return (
    landmarks[4].y < landmarks[2].y && // Thumb
    landmarks[8].y < landmarks[6].y && // Index
    landmarks[12].y < landmarks[10].y && // Middle
    landmarks[16].y > landmarks[14].y &&
    landmarks[20].y > landmarks[18].y
  );
}

function isRaisedIndexRing(landmarks: HandLandmark[]): boolean {
  // Index and ring extended, others folded
  return (
    landmarks[8].y < landmarks[6].y &&
    landmarks[16].y < landmarks[14].y &&
    landmarks[12].y > landmarks[10].y &&
    landmarks[20].y > landmarks[18].y &&
    landmarks[4].y > landmarks[2].y
  );
}

function isRaisedIndexThumb(landmarks: HandLandmark[]): boolean {
  // Index and thumb extended, others folded (L shape)
  return (
    landmarks[8].y < landmarks[6].y &&
    landmarks[4].y < landmarks[2].y &&
    landmarks[12].y > landmarks[10].y &&
    landmarks[16].y > landmarks[14].y &&
    landmarks[20].y > landmarks[18].y
  );
}

function isRaisedIndexMiddlePinky(landmarks: HandLandmark[]): boolean {
  // Index, middle, pinky extended, others folded (three fingers up)
  return (
    landmarks[8].y < landmarks[6].y &&
    landmarks[12].y < landmarks[10].y &&
    landmarks[20].y < landmarks[18].y &&
    landmarks[4].y > landmarks[2].y &&
    landmarks[16].y > landmarks[14].y
  );
}

function isRaisedThumbPinky(landmarks: HandLandmark[]): boolean {
  // Thumb and pinky extended, others folded ("call me" gesture)
  return (
    landmarks[4].y < landmarks[2].y &&
    landmarks[20].y < landmarks[18].y &&
    landmarks[8].y > landmarks[6].y &&
    landmarks[12].y > landmarks[10].y &&
    landmarks[16].y > landmarks[14].y
  );
}

const PHRASE_GESTURE_MAP: { phrase: string; check: (landmarks: HandLandmark[]) => boolean }[] = [
  { phrase: "Hello, how are you?", check: isOpenPalm },
  { phrase: "Good morning!", check: isPeaceSign },
  { phrase: "Thank you very much.", check: isClosedFist },
  { phrase: "Please help me.", check: isRaisedRing },                 // Unique
  { phrase: "I love you.", check: isILYSign },
  { phrase: "Can you repeat that?", check: isRaisedIndex },
  { phrase: "What's your name?", check: isRaisedIndexMiddle },
  { phrase: "Nice to meet you.", check: isThumbsUp },
  { phrase: "Excuse me.", check: isRaisedPinky },
  { phrase: "I'm sorry.", check: isRaisedRing },
  { phrase: "Yes, I understand.", check: isRaisedIndexThumb },        // Unique
  { phrase: "No, I don't understand.", check: isThumbsDown },
  { phrase: "Where is the bathroom?", check: isRaisedIndexPinky },
  { phrase: "How much does this cost?", check: isRaisedIndexMiddleThumb },
  { phrase: "I need help.", check: isRaisedIndexRing },
  { phrase: "Goodbye!", check: isRaisedIndexMiddlePinky },            // Unique
  { phrase: "See you later.", check: isRaisedIndexPinky },            // Unique
  { phrase: "Have a good day!", check: isRaisedThumbPinky },          // Unique
];

export class HandGestureDetector {
  private hands: Hands | null = null;
  private camera: Camera | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private lastSign: string = '';
  private gestureHistory: string[] = [];
  private isInitialized = false;
  private _onSignDetected: ((sign: DetectedSign) => void) | null = null;

  async initialize(): Promise<void> {
    this.hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.8,
    });
    this.hands.onResults(this.onResults.bind(this));
    this.isInitialized = true;
  }

  start(videoElement: HTMLVideoElement, onSignDetected: (sign: DetectedSign) => void): void {
    if (!this.hands || !this.isInitialized) return;
    this.videoElement = videoElement;
    this._onSignDetected = onSignDetected;

    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        await this.hands!.send({ image: videoElement });
      },
      width: 640,
      height: 480,
    });
    this.camera.start();
  }

  stop(): void {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
    this.gestureHistory = [];
    this.lastSign = '';
  }

  private onResults(results: Results): void {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) return;

    const landmarks = results.multiHandLandmarks[0] as HandLandmark[];

    // --- Check each gesture ---
    let phrase = "";
    for (const entry of PHRASE_GESTURE_MAP) {
      if (entry.check(landmarks)) {
        phrase = entry.phrase;
        break;
      }
    }

    if (phrase && phrase !== this.lastSign) {
      this.lastSign = phrase;
      // Stability filter: only accept if seen 2 times in a row
      this.gestureHistory.push(phrase);
      if (this.gestureHistory.length > 5) this.gestureHistory.shift();
      const consistentGestures = this.gestureHistory.filter(g => g === phrase);
      if (consistentGestures.length >= 2 && this._onSignDetected) {
        this._onSignDetected({ sign: phrase, confidence: 0.97 });
      }
    }
  }

  cleanup(): void {
    this.stop();
    this.hands = null;
    this.isInitialized = false;
    this.videoElement = null;
    this._onSignDetected = null;
  }
}