import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Play, Square, Download, Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface TranscriptionResult {
  text: string;
  confidence: number;
  language: string;
  duration: number;
  words: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}

const VoiceInputPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [copied, setCopied] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone.",
      });
      
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      toast({
        title: "Recording Stopped",
        description: "Processing your audio...",
      });
      
      // Simulate processing
      setIsProcessing(true);
      setTimeout(() => {
        simulateTranscription();
      }, 2000);
    }
  };

  const simulateTranscription = () => {
    // Simulate different transcriptions based on recording time
    const sampleTranscriptions = [
      {
        text: "Hello, I'm Ravi from Mumbai. I'm looking for a mentor to help me with React development. I have some experience with JavaScript and would like to improve my frontend skills. Can anyone help me with this?",
        confidence: 0.94,
        language: "en-IN",
        duration: recordingTime,
        words: [
          { word: "Hello", start: 0, end: 0.5, confidence: 0.98 },
          { word: "I'm", start: 0.6, end: 0.8, confidence: 0.95 },
          { word: "Ravi", start: 0.9, end: 1.2, confidence: 0.92 },
          { word: "from", start: 1.3, end: 1.5, confidence: 0.96 },
          { word: "Mumbai", start: 1.6, end: 2.0, confidence: 0.89 }
        ]
      },
      {
        text: "Hi everyone! I'm Anjali, a UI/UX designer from Bangalore. I'm interested in collaborating on community projects and would love to help NGOs with their design needs. Please reach out if you need any design assistance.",
        confidence: 0.91,
        language: "en-IN",
        duration: recordingTime,
        words: [
          { word: "Hi", start: 0, end: 0.3, confidence: 0.97 },
          { word: "everyone", start: 0.4, end: 0.8, confidence: 0.93 },
          { word: "I'm", start: 0.9, end: 1.1, confidence: 0.95 },
          { word: "Anjali", start: 1.2, end: 1.6, confidence: 0.88 },
          { word: "a", start: 1.7, end: 1.8, confidence: 0.96 }
        ]
      },
      {
        text: "This is Neha from Delhi. I'm a content writer and I'm looking for opportunities to write for social impact projects. I have experience in SEO and digital marketing content. Would love to connect with NGOs or companies that need content help.",
        confidence: 0.89,
        language: "en-IN",
        duration: recordingTime,
        words: [
          { word: "This", start: 0, end: 0.4, confidence: 0.94 },
          { word: "is", start: 0.5, end: 0.6, confidence: 0.96 },
          { word: "Neha", start: 0.7, end: 1.0, confidence: 0.91 },
          { word: "from", start: 1.1, end: 1.3, confidence: 0.95 },
          { word: "Delhi", start: 1.4, end: 1.8, confidence: 0.87 }
        ]
      }
    ];
    
    const randomIndex = Math.floor(Math.random() * sampleTranscriptions.length);
    const result = sampleTranscriptions[randomIndex];
    
    setTranscription(result);
    setIsProcessing(false);
    
    toast({
      title: "Transcription Complete!",
      description: `Confidence: ${(result.confidence * 100).toFixed(0)}%`,
    });
  };

  const copyToClipboard = async () => {
    if (transcription) {
      try {
        await navigator.clipboard.writeText(transcription.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        toast({
          title: "Copied to Clipboard",
          description: "Transcription text has been copied.",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Please copy the text manually.",
          variant: "destructive"
        });
      }
    }
  };

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-input-${new Date().toISOString().slice(0, 19)}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Audio Downloaded",
        description: "Your recording has been saved.",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'Excellent';
    if (confidence >= 0.7) return 'Good';
    return 'Fair';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Voice Input
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Use your voice to create tasks, provide feedback, or communicate with the Tympact community. 
            Our advanced voice recognition system supports Indian English and regional accents.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recording Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mic className="h-5 w-5 mr-2" />
                Voice Recording
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recording Status */}
              <div className="text-center">
                {isRecording ? (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 mb-4"
                  >
                    <MicOff className="h-8 w-8 text-red-600" />
                  </motion.div>
                ) : (
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <Mic className="h-8 w-8 text-gray-600" />
                  </div>
                )}
                
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {isRecording ? 'Recording...' : 'Ready to Record'}
                </h3>
                
                {isRecording && (
                  <div className="text-2xl font-mono text-red-600 mb-4">
                    {formatTime(recordingTime)}
                  </div>
                )}
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRecording 
                    ? 'Speak clearly into your microphone'
                    : 'Click the button below to start recording'
                  }
                </p>
              </div>

              {/* Recording Controls */}
              <div className="flex justify-center space-x-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Mic className="h-5 w-5 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    size="lg"
                    variant="destructive"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop Recording
                  </Button>
                )}
              </div>

              {/* Processing Status */}
              {isProcessing && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Processing audio and generating transcription...
                  </p>
                </div>
              )}

              {/* Audio Playback */}
              {audioUrl && !isRecording && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Audio Preview</h4>
                  <audio controls className="w-full" src={audioUrl} />
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadAudio}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Audio
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transcription Results */}
          {transcription && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Transcription Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Confidence Score */}
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getConfidenceColor(transcription.confidence)}`}>
                      {(transcription.confidence * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getConfidenceLabel(transcription.confidence)} Accuracy
                    </div>
                  </div>

                  {/* Language and Duration */}
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Language: </span>
                      <Badge variant="outline">{transcription.language.toUpperCase()}</Badge>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Duration: </span>
                      <span className="font-medium">{formatTime(transcription.duration)}</span>
                    </div>
                  </div>

                  {/* Transcribed Text */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Transcribed Text</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {transcription.text}
                      </p>
                    </div>
                  </div>

                  {/* Word-level Analysis */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Word Analysis</h4>
                    <div className="flex flex-wrap gap-1">
                      {transcription.words.slice(0, 10).map((word, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={`text-xs ${
                            word.confidence >= 0.9 ? 'border-green-200 text-green-700' :
                            word.confidence >= 0.7 ? 'border-yellow-200 text-yellow-700' :
                            'border-red-200 text-red-700'
                          }`}
                        >
                          {word.word}
                        </Badge>
                      ))}
                      {transcription.words.length > 10 && (
                        <Badge variant="outline" className="text-xs">
                          +{transcription.words.length - 10} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={copyToClipboard}
                      className="flex-1"
                      variant={copied ? "default" : "outline"}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Text
                        </>
                      )}
                    </Button>
                    <Button variant="outline">
                      Use for Task
                    </Button>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Tips for Better Recognition
                        </h5>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Speak clearly and at a moderate pace</li>
                          <li>• Minimize background noise</li>
                          <li>• Use a good quality microphone</li>
                          <li>• Our system adapts to Indian English accents</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceInputPage; 