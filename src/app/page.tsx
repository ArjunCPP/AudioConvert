'use client';

import { useState, useCallback, lazy, Suspense } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ProcessOptions } from '@/components/AudioEditor';
import { extractAudioFromVideo, trimAudio, loadFFmpeg } from '@/utils/audioProcessing';
import { Video, Scissors, FileDown, Loader2, Volume2, Gauge, Sliders, X, Download } from 'lucide-react';

const AudioEditor = lazy(() => import('@/components/AudioEditor').then(mod => ({ default: mod.AudioEditor })));

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [view, setView] = useState<'upload' | 'editor'>('upload');
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string>('');

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setProcessingStep('Initializing engine...');

    try {
      await loadFFmpeg();
      const url = URL.createObjectURL(selectedFile);
      setAudioUrl(url);
      setView('editor');
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, []);

  const handleCut = useCallback(async (start: number, end: number, options: ProcessOptions) => {
    if (!audioUrl || !file) return;

    setIsProcessing(true);
    setProcessingStep('Processing audio...');

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const processedBlob = await trimAudio(blob, start, end, options);

      // Store the processed blob and show rename dialog
      setProcessedBlob(processedBlob);
      setDownloadFileName(`processed-${file.name.split('.')[0]}`);
      setShowRenameDialog(true);
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Error processing audio.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, [audioUrl, file]);

  const handleDownload = useCallback(() => {
    if (!processedBlob) return;

    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${downloadFileName}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Close dialog and reset
    setShowRenameDialog(false);
    setProcessedBlob(null);
  }, [processedBlob, downloadFileName]);

  const handleReset = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setFile(null);
    setAudioUrl(null);
    setView('upload');
    setShowRenameDialog(false);
    setProcessedBlob(null);
  }, [audioUrl]);

  return (
    <div className="bg-gradient-to-b from-white to-slate-100 min-h-screen">
      <div className="container mx-auto px-6 py-12 md:py-20 flex flex-col items-center">

        {/* Intro Text */}
        {view === 'upload' && (
          <div className="text-center mb-12 space-y-6 max-w-2xl animate-slide-down">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900">
              Audio Cutter & <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-black via-slate-800 to-black">
                Video to Audio Converter
              </span>
            </h1>
            <p className="text-xl text-slate-700 font-medium animate-fade-in stagger-1">
              Professional, fast, and secure. Process your files locally in your browser without uploading to a server.
            </p>
          </div>
        )}

        {/* Workspace */}
        <div className="w-full max-w-4xl animate-scale-in">
          {isProcessing && view === 'upload' ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-slate-900 shadow-2xl">
              <Loader2 className="w-12 h-12 text-slate-900 animate-spin mb-4" />
              <p className="text-xl font-bold text-slate-900">{processingStep}</p>
              <p className="text-base text-slate-600 mt-2">Please wait while we prepare your file...</p>
            </div>
          ) : view === 'upload' ? (
            <FileUploader onFileSelect={handleFileSelect} isProcessing={isProcessing} />
          ) : (
            <Suspense fallback={
              <div className="flex items-center justify-center p-12 bg-white rounded-3xl border-2 border-slate-900">
                <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
              </div>
            }>
              <AudioEditor
                audioUrl={audioUrl}
                fileName={file?.name || 'Audio File'}
                onCut={handleCut}
                onReset={handleReset}
                isProcessing={isProcessing}
              />
            </Suspense>
          )}
        </div>
      </div>

      {/* Rename Dialog */}
      {showRenameDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-slate-900 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-slate-900">Rename & Download</h3>
              <button
                onClick={() => setShowRenameDialog(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                File Name
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={downloadFileName}
                  onChange={(e) => setDownloadFileName(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium text-slate-900"
                  placeholder="Enter filename"
                />
                <span className="text-slate-700 font-bold">.mp3</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRenameDialog(false)}
                className="flex-1 px-6 py-3 border-2 border-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How it Works Section */}
      {view === 'upload' && (
        <div className="bg-white py-20 border-t-4 border-slate-900">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-slate-900">How it Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <HowItWorksStep
                number={1}
                title="Upload Your File"
                description="Select an audio or video file from your device. We support most common formats including MP3, WAV, MP4, MKV, and more."
              />
              <HowItWorksStep
                number={2}
                title="Edit Audio"
                description="Use our visual editor to trim the audio. Adjust volume up to 200%, change playback speed, or apply equalizer settings."
              />
              <HowItWorksStep
                number={3}
                title="Process & Save"
                description="Click 'Process & Save'. The engine will render your changes instantly and download the optimized MP3 file."
              />
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      {view === 'upload' && (
        <div className="bg-gradient-to-b from-slate-100 to-white py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-slate-900">Features</h2>
            <p className="text-xl text-slate-700 text-center mb-16 max-w-2xl mx-auto font-medium">
              Professional-grade audio tools directly in your browser
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Video className="w-8 h-8 text-white" />}
                title="Video to Audio"
                description="Instantly extract high-quality audio tracks from video files without uploading."
              />
              <FeatureCard
                icon={<Scissors className="w-8 h-8 text-white" />}
                title="Precision Trimming"
                description="Cut and trim audio files with millisecond accuracy using our visual waveform editor."
              />
              <FeatureCard
                icon={<Volume2 className="w-8 h-8 text-white" />}
                title="Volume Boost"
                description="Amplify quiet recordings up to 200% volume using smart gain technology."
              />
              <FeatureCard
                icon={<Gauge className="w-8 h-8 text-white" />}
                title="Speed Control"
                description="Adjust playback speed from 0.5x to 2.0x. Perfect for transcribing or speeding up podcasts."
              />
              <FeatureCard
                icon={<Sliders className="w-8 h-8 text-white" />}
                title="3-Band Equalizer"
                description="Fine-tune your audio with Bass, Mid, and Treble controls for perfect sound."
              />
              <FeatureCard
                icon={<FileDown className="w-8 h-8 text-white" />}
                title="100% Private"
                description="All processing happens locally on your device. Your files never leave your computer."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const HowItWorksStep = ({ number, title, description }: { number: number, title: string, description: string }) => {
  return (
    <div className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-900 shadow-xl hover-lift">
      <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-lg">
        {number}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-slate-900">{title}</h3>
      <p className="text-slate-700 leading-relaxed text-base">{description}</p>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: {
  icon: React.ReactNode,
  title: string,
  description: string
}) => {
  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 to-black rounded-2xl border-2 border-slate-800 shadow-2xl hover-lift transform transition-all duration-300">
      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 hover-scale shadow-lg">
        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-300 leading-relaxed text-base">
        {description}
      </p>
    </div>
  );
};
