import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, CameraOff, Play, Square, Mic, MicOff, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { HandGestureDetector, DetectedSign } from '@/utils/handGestureDetection';

interface SignLanguageDetectorProps {
  onTranslation: (text: string, sender: 'sign' | 'speech') => void;
  speechRate: number;
  textSize: number;
}

const SignLanguageDetector: React.FC<SignLanguageDetectorProps> = ({
  onTranslation,
  speechRate,
  textSize
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState('');
  const [signLanguage, setSignLanguage] = useState('asl');
  const [spokenLanguage, setSpokenLanguage] = useState('en-US');
  const [mode, setMode] = useState<'sign-to-text' | 'speech-to-sign'>('sign-to-text');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [cvDetector, setCvDetector] = useState<HandGestureDetector | null>(null);
  const [isInitializingCV, setIsInitializingCV] = useState(false);
  const [lastDetectedSign, setLastDetectedSign] = useState<string>('');
  const [detectionConfidence, setDetectionConfidence] = useState<number>(0);

  useEffect(() => {
    return () => {
      stopCamera();
      stopDetection();
      stopSpeechRecognition();
      if (cvDetector) {
        cvDetector.cleanup();
      }
    };
  }, []);

  const initializeComputerVision = async () => {
    if (cvDetector) return;
    setIsInitializingCV(true);
    try {
      const detector = new HandGestureDetector();
      await detector.initialize();
      setCvDetector(detector);
      toast.success('Hand gesture detection initialized successfully');
    } catch (error) {
      console.error('Failed to initialize gesture detection:', error);
      toast.error('Failed to initialize AI detection.');
    } finally {
      setIsInitializingCV(false);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      toast.success('Camera started successfully');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    toast.info('Camera stopped');
  };

  const startDetection = async () => {
    if (!stream) {
      toast.error('Please start the camera first');
      return;
    }
    // Initialize computer vision if not already done
    if (!cvDetector) {
      await initializeComputerVision();
    }
    setIsDetecting(true);
    setCurrentTranslation('Detecting signs...');

    if (cvDetector && videoRef.current) {
      cvDetector.start(videoRef.current, (detectedSign: DetectedSign) => {
        if (detectedSign && detectedSign.sign !== lastDetectedSign) {
          setLastDetectedSign(detectedSign.sign);
          setDetectionConfidence(detectedSign.confidence);
          setCurrentTranslation(detectedSign.sign);
          onTranslation(detectedSign.sign, 'sign');

          // Speak the translation
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(detectedSign.sign);
            utterance.rate = speechRate;
            utterance.lang = spokenLanguage;
            window.speechSynthesis.speak(utterance);
          }
          toast.success(`Detected: ${detectedSign.sign} (${Math.round(detectedSign.confidence * 100)}%)`);
        }
      });
      toast.success('AI sign language detection started');
    }
  };

  const stopDetection = () => {
    setIsDetecting(false);
    setCurrentTranslation('');
    if (cvDetector) {
      cvDetector.stop();
    }
    toast.info('Sign language detection stopped');
  };

  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition =
      (window as Window & typeof globalThis & {
        SpeechRecognition?: typeof SpeechRecognition;
        webkitSpeechRecognition?: typeof SpeechRecognition;
      }).SpeechRecognition ||
      (window as Window & typeof globalThis & {
        webkitSpeechRecognition?: typeof SpeechRecognition;
      }).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.lang = spokenLanguage;
    recognitionInstance.interimResults = true;
    recognitionInstance.continuous = true;

    recognitionInstance.onstart = () => {
      setIsRecording(true);
      setCurrentTranslation('Listening...');
      toast.success('Speech recognition started');
    };

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setCurrentTranslation(finalTranscript + interimTranscript);

      if (finalTranscript) {
        onTranslation(finalTranscript, 'speech');
      }
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      toast.error('Speech recognition error: ' + event.error);
      setIsRecording(false);
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
      setCurrentTranslation('');
      toast.info('Speech recognition stopped');
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);
  };

  const stopSpeechRecognition = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setIsRecording(false);
    setCurrentTranslation('');
  };

  return (
    <div className="space-y-4">
      {/* Camera Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Camera Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full rounded-lg bg-black aspect-video object-cover"
            />
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Camera not started</p>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={stream ? stopCamera : startCamera} className="flex-1">
              {stream ? <CameraOff className="h-4 w-4 mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
              {stream ? 'Stop Camera' : 'Start Camera'}
            </Button>
            {!cvDetector && (
              <Button
                onClick={initializeComputerVision}
                variant="outline"
                disabled={isInitializingCV}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isInitializingCV ? 'Initializing AI...' : 'Initialize AI'}
              </Button>
            )}
          </div>
          {cvDetector && (
            <div className="mt-2 text-center">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                AI Detection Ready
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Translation Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={mode === 'sign-to-text' ? 'default' : 'outline'}
              onClick={() => setMode('sign-to-text')}
              className="flex-1"
            >
              Sign to Text
            </Button>
            <Button
              variant={mode === 'speech-to-sign' ? 'default' : 'outline'}
              onClick={() => setMode('speech-to-sign')}
              className="flex-1"
            >
              Speech to Sign
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Sign Language</label>
              <Select value={signLanguage} onValueChange={setSignLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asl">American Sign Language (ASL)</SelectItem>
                  <SelectItem value="bsl">British Sign Language (BSL)</SelectItem>
                  <SelectItem value="fsl">French Sign Language (FSL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Spoken Language</label>
              <Select value={spokenLanguage} onValueChange={setSpokenLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            {mode === 'sign-to-text' ? (
              <Button
                onClick={isDetecting ? stopDetection : startDetection}
                className="w-full"
                disabled={!stream}
              >
                {isDetecting ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isDetecting ? 'Stop Detection' : 'Start Detection'}
              </Button>
            ) : (
              <Button
                onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}
                className="w-full"
              >
                {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Translation */}
      {currentTranslation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Current Translation
              <Badge variant="secondary">
                {mode === 'sign-to-text' ? 'Sign' : 'Speech'}
              </Badge>
              {detectionConfidence > 0 && (
                <Badge variant="outline" className="ml-2">
                  {Math.round(detectionConfidence * 100)}% confidence
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className="text-lg leading-relaxed p-4 bg-gray-50 rounded-lg"
              style={{ fontSize: `${textSize}px` }}
            >
              {currentTranslation}
            </p>
            {cvDetector && mode === 'sign-to-text' && (
              <div className="mt-3 text-sm text-gray-600">
                <p>
                  <strong>Supported Signs:</strong> Hello, Thank you, Yes, No, I love you
                </p>
                <p className="text-xs mt-1">
                  Show your hand gestures in front of the camera for real-time translation.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SignLanguageDetector;