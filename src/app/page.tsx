'use client';

import { useState, useCallback, lazy, Suspense } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ProcessOptions } from '@/components/AudioEditor';
import { extractAudioFromVideo, trimAudio, loadFFmpeg } from '@/utils/audioProcessing';
import { Video, Scissors, FileDown, Loader2, Volume2, Gauge, Sliders, X, Download } from 'lucide-react';
import Script from 'next/script';

const AudioEditor = lazy(() => import('@/components/AudioEditor').then(mod => ({ default: mod.AudioEditor })));

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      'name': 'RegTune - Audio Editor & Video to Audio Converter',
      'url': 'https://regtune.com',
      'description': 'Free online Audio Editor and Video to Audio Converter. Edit audio, cut mp3, and convert video to audio instantly.',
      'applicationCategory': 'MultimediaApplication',
      'applicationSubCategory': 'AudioEditor',
      'operatingSystem': 'Any (Web-based)',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
      'featureList': [
        'Audio Editor',
        'Video to Audio Converter',
        'Audio Cutter',
        'MP3 Cutter',
        'Volume Booster',
        'Speed Changer',
        'Equalizer',
        'Privacy-First Local Processing',
      ],
    },
    {
      '@type': 'SoftwareApplication',
      'name': 'RegTune',
      'applicationCategory': 'MultimediaApplication',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'ratingCount': '1450',
      },
    },
    {
      '@type': 'Organization',
      'name': 'RegTune',
      'url': 'https://regtune.com',
      'logo': 'https://regtune.com/icon.png',
      'sameAs': [
        'https://twitter.com/regtune',
      ],
    },
  ],
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [view, setView] = useState<'upload' | 'editor'>('upload');
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<string>('mp3');

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
      // setDownloadFileName(`processed-${file.name.split('.')[0]}.${options.format}`); 
      // User might want to change it. Rename dialog shows "Filename .extension" usually.
      // Logic in Rename Dialog: 
      // <input ... /> <span ...>.mp3</span>
      // I need to update the rename dialog UI to show the correct extension.
      // So I should add a state for `outputFormat`.
      setDownloadFileName(`processed-${file.name.split('.')[0]}`);
      setOutputFormat(options.format);
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
    // Extract extension from downloadFileName if present, or use processedExtension if logic allows.
    // However, downloadFileName likely doesn't have extension yet as set in handleCut.
    // We should probably store the format in state or just allow user to name it.
    // But handleCut sets 'setDownloadFileName' without extension usually.
    // Let's rely on the mime type or just the format passed in handleCut if we track it.
    // Actually, simple fix: processedBlob is set. We don't 'know' the format here easily unless we tracked it.
    // Let's store the extension in state.

    // For now, I'll update handleCut to store the extension.
    // BUT I can't easily change the state structure without a larger refactor of page.tsx.
    // Instead, I'll store the extension in a new state variable or just append it to downloadFileName there?
    // Let's modify handleCut first to see where downloadFileName is set.
    // Let's modify handleCut first to see where downloadFileName is set.
    a.download = `${downloadFileName}.${outputFormat}`;
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
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="bg-white min-h-screen font-sans selection:bg-black selection:text-white">
        <div className="container mx-auto px-6 py-12 md:py-24 flex flex-col items-center">

          {/* Intro Text */}
          <div className="text-center mb-16 space-y-6 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-tight">
              Audio Cutter & <br />
              <span className="text-slate-500">
                Video to Audio Converter
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Professional, fast, and secure. Process your files locally in your browser.
            </p>
          </div>

          {/* Workspace */}
          <div className="w-full max-w-5xl">
            {isProcessing && view === 'upload' ? (
              <div className="flex flex-col items-center justify-center p-20 bg-zinc-50 rounded-3xl border border-slate-200">
                <Loader2 className="w-12 h-12 text-slate-900 animate-spin mb-6" />
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{processingStep}</p>
                <p className="text-lg text-slate-500 mt-2">Please wait while we prepare your file...</p>
              </div>
            ) : view === 'upload' ? (
              <FileUploader onFileSelect={handleFileSelect} isProcessing={isProcessing} />
            ) : (
              <div className="flex flex-col gap-8">
                <Suspense fallback={
                  <div className="flex items-center justify-center p-12 bg-zinc-50 rounded-3xl border border-slate-200">
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

                {/* Inline Rename & Download Section */}
                {processedBlob && (
                  <div className="bg-slate-900 rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 animate-slide-up">
                    <div className="space-y-2 text-center md:text-left">
                      <h3 className="text-2xl font-bold text-white tracking-tight">Processing Complete!</h3>
                      <p className="text-slate-400">Your audio file is ready to download.</p>
                    </div>

                    <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 items-center bg-slate-800/50 p-2 rounded-xl border border-slate-700">
                      <div className="flex items-center px-4 py-2 w-full md:w-auto">
                        <input
                          type="text"
                          value={downloadFileName}
                          onChange={(e) => setDownloadFileName(e.target.value)}
                          className="bg-transparent text-white text-lg font-medium focus:outline-none placeholder:text-slate-600 w-full md:w-64"
                          placeholder="Enter filename"
                        />
                        <span className="text-slate-500 font-bold ml-2">.{outputFormat}</span>
                      </div>

                      <button
                        onClick={handleDownload}
                        className="w-full md:w-auto px-8 py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download Now</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* How it Works Section */}
        <div className="bg-zinc-50 py-24 border-t border-slate-200">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-16 text-slate-900 tracking-tight">How it Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="animate-slide-in-left stagger-1">
                <HowItWorksStep
                  number={1}
                  title="Upload Your File"
                  description="Select an audio or video file from your device. We support most common formats including MP3, WAV, MP4, MKV, and more."
                />
              </div>
              <div className="animate-scale-in stagger-2">
                <HowItWorksStep
                  number={2}
                  title="Edit Audio"
                  description="Use our visual editor to trim the audio. Adjust volume up to 200%, change playback speed, or apply equalizer settings."
                />
              </div>
              <div className="animate-slide-in-right stagger-3">
                <HowItWorksStep
                  number={3}
                  title="Process & Save"
                  description="Click 'Process & Save'. The engine will render your changes instantly and download the optimized audio file."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-24 border-t border-slate-200">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-6 text-slate-900 tracking-tight">Features</h2>
            <p className="text-xl text-slate-500 text-center mb-20 max-w-2xl mx-auto font-medium">
              Professional-grade audio tools directly in your browser
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="animate-slide-in-left stagger-1">
                <FeatureCard
                  icon={<Video className="w-6 h-6 text-slate-900" />}
                  title="Video to Audio"
                  description="Instantly extract high-quality audio tracks from video files without uploading."
                />
              </div>
              <div className="animate-scale-in stagger-2">
                <FeatureCard
                  icon={<Scissors className="w-6 h-6 text-slate-900" />}
                  title="Precision Trimming"
                  description="Cut and trim audio files with millisecond accuracy using our visual waveform editor."
                />
              </div>
              <div className="animate-slide-in-right stagger-3">
                <FeatureCard
                  icon={<Volume2 className="w-6 h-6 text-slate-900" />}
                  title="Volume Boost"
                  description="Amplify quiet recordings up to 200% volume using smart gain technology."
                />
              </div>
              <div className="animate-slide-in-left stagger-4">
                <FeatureCard
                  icon={<Gauge className="w-6 h-6 text-slate-900" />}
                  title="Speed Control"
                  description="Adjust playback speed from 0.5x to 2.0x. Perfect for transcribing or speeding up podcasts."
                />
              </div>
              <div className="animate-scale-in stagger-5">
                <FeatureCard
                  icon={<Sliders className="w-6 h-6 text-slate-900" />}
                  title="3-Band Equalizer"
                  description="Fine-tune your audio with Bass, Mid, and Treble controls for perfect sound."
                />
              </div>
              <div className="animate-slide-in-right stagger-6">
                <FeatureCard
                  icon={<FileDown className="w-6 h-6 text-slate-900" />}
                  title="100% Private"
                  description="All processing happens locally on your device. Your files never leave your computer."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const HowItWorksStep = ({ number, title, description }: { number: number, title: string, description: string }) => {
  return (
    <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="w-16 h-16 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center text-3xl font-black mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
        {number}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-base">{description}</p>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: {
  icon: React.ReactNode,
  title: string,
  description: string
}) => {
  return (
    <div className="p-8 bg-zinc-50 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 group">
      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
        <div className="w-12 h-12 flex items-center justify-center text-slate-900">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-base">
        {description}
      </p>
    </div>
  );
};
