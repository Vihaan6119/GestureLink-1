export interface HandLandmark {
  x: number;
  y: number;
}

export interface DetectedSign {
  sign: string;
  confidence: number;
}

// Simple gesture detection using canvas and image processing
export class HandGestureDetector {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private previousFrame: ImageData | null = null;
  private gestureHistory: string[] = [];
  private isInitialized = false;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async initialize(): Promise<void> {
    this.canvas.width = 640;
    this.canvas.height = 480;
    this.isInitialized = true;
  }

  detectSigns(videoElement: HTMLVideoElement): DetectedSign | null {
    if (!this.isInitialized || !videoElement.videoWidth) {
      return null;
    }

    try {
      // Draw video frame to canvas
      this.canvas.width = videoElement.videoWidth;
      this.canvas.height = videoElement.videoHeight;
      this.ctx.drawImage(videoElement, 0, 0);

      // Get image data for processing
      const currentFrame = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      
      if (!this.previousFrame) {
        this.previousFrame = currentFrame;
        return null;
      }

      // Simple motion detection
      const motionLevel = this.calculateMotion(currentFrame, this.previousFrame);
      this.previousFrame = currentFrame;

      // Detect basic gestures based on motion patterns
      const detectedGesture = this.analyzeMotion(motionLevel);
      
      if (detectedGesture) {
        // Add to history for stability
        this.gestureHistory.push(detectedGesture.sign);
        if (this.gestureHistory.length > 5) {
          this.gestureHistory.shift();
        }

        // Check for consistent detection
        const consistentGestures = this.gestureHistory.filter(g => g === detectedGesture.sign);
        if (consistentGestures.length >= 3) {
          return detectedGesture;
        }
      }

      return null;
    } catch (error) {
      console.error('Error in gesture detection:', error);
      return null;
    }
  }

  private calculateMotion(current: ImageData, previous: ImageData): number {
    let totalDiff = 0;
    const pixels = current.data.length;

    for (let i = 0; i < pixels; i += 4) {
      const rDiff = Math.abs(current.data[i] - previous.data[i]);
      const gDiff = Math.abs(current.data[i + 1] - previous.data[i + 1]);
      const bDiff = Math.abs(current.data[i + 2] - previous.data[i + 2]);
      totalDiff += (rDiff + gDiff + bDiff) / 3;
    }

    return totalDiff / (pixels / 4);
  }

  private analyzeMotion(motionLevel: number): DetectedSign | null {
    // Simple gesture recognition based on motion patterns
    if (motionLevel > 50 && motionLevel < 100) {
      return { sign: "Hello", confidence: 0.7 };
    } else if (motionLevel > 100 && motionLevel < 150) {
      return { sign: "Thank you", confidence: 0.75 };
    } else if (motionLevel > 150 && motionLevel < 200) {
      return { sign: "Please", confidence: 0.8 };
    } else if (motionLevel > 200 && motionLevel < 250) {
      return { sign: "Yes", confidence: 0.85 };
    } else if (motionLevel > 250 && motionLevel < 300) {
      return { sign: "No", confidence: 0.8 };
    } else if (motionLevel > 300) {
      return { sign: "I love you", confidence: 0.9 };
    }

    return null;
  }

  cleanup(): void {
    this.isInitialized = false;
    this.previousFrame = null;
    this.gestureHistory = [];
  }
}