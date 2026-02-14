'use client';

import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import { Play, Pause, Scissors, Volume2, RotateCcw, BoxSelect, Gauge, Sliders } from 'lucide-react';
import { cn } from '@/lib/utils';
import './audio-editor.css';

export interface ProcessOptions {
    volume: number;
    speed: number;
    eq: {
        bass: number;
        mid: number;
        treble: number;
    };
    format: string;
    fade: {
        in: boolean;
        out: boolean;
        duration: number;
    };
    mode: 'extract' | 'delete';
}

interface AudioEditorProps {
    audioUrl: string | null;
    fileName: string;
    onCut: (start: number, end: number, options: ProcessOptions) => void;
    onReset: () => void;
    isProcessing?: boolean;
}

type Tool = 'trim' | 'volume' | 'speed' | 'eq';

export function AudioEditor({ audioUrl, fileName, onCut, onReset, isProcessing = false }: AudioEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const wavesurfer = useRef<WaveSurfer | null>(null);
    const regions = useRef<RegionsPlugin | null>(null);

    // Audio Context & Gain Node Refs for Volume Amplification
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Editor State
    const [activeTool, setActiveTool] = useState<Tool>('trim');
    const [regionStart, setRegionStart] = useState(0);
    const [regionEnd, setRegionEnd] = useState(0);

    // Audio Effects State
    const [volume, setVolume] = useState(100); // percentage 0-200
    const [speed, setSpeed] = useState(1); // multiplier 0.5-2
    const [eq, setEq] = useState({ bass: 0, mid: 0, treble: 0 }); // dB -10 to +10

    // New Features State
    const [format, setFormat] = useState('mp3');
    const [cutMode, setCutMode] = useState<'extract' | 'delete'>('extract');
    const [fadeIn, setFadeIn] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    // Manual time inputs (string for easier typing)
    const [startTimeInput, setStartTimeInput] = useState('00:00.0');
    const [endTimeInput, setEndTimeInput] = useState('00:00.0');

    // Initialize WaveSurfer
    useEffect(() => {
        if (!containerRef.current || !audioUrl || !timelineRef.current) return;

        if (wavesurfer.current) {
            wavesurfer.current.destroy();
        }

        const ws = WaveSurfer.create({
            container: containerRef.current,
            waveColor: '#cbd5e1', // Slate-300
            progressColor: '#0f172a', // Slate-900 (Black-ish)
            cursorColor: '#ef4444', // Red-500
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
            height: 150,
            minPxPerSec: 0,
            url: audioUrl,
            plugins: [
                TimelinePlugin.create({
                    container: timelineRef.current,
                    style: { color: '#64748b' } // Slate-500
                }),
            ],
            normalize: true,
        });

        const wsRegions = RegionsPlugin.create();
        ws.registerPlugin(wsRegions);
        regions.current = wsRegions;

        ws.on('ready', () => {
            setIsReady(true);
            const dur = ws.getDuration();
            setDuration(dur);

            // Initial region
            const initialStart = 0;
            const initialEnd = dur;

            wsRegions.addRegion({
                start: initialStart,
                end: initialEnd,
                color: 'rgba(59, 130, 246, 0.2)', // Blue-500 with opacity (High visibility)
                drag: true,
                resize: true,
            });

            setRegionStart(initialStart);
            setRegionEnd(initialEnd);
            setStartTimeInput(formatTime(initialStart));
            setEndTimeInput(formatTime(initialEnd));

            // Setup WebAudio for Volume Amplification
            const mediaElement = ws.getMediaElement();
            if (mediaElement) {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                const ctx = new AudioContextClass();
                audioContextRef.current = ctx;

                const source = ctx.createMediaElementSource(mediaElement);
                const gainNode = ctx.createGain();
                gainNodeRef.current = gainNode;

                // Connect: Source -> Gain -> Destination
                source.connect(gainNode);
                gainNode.connect(ctx.destination);

                // Initial settings
                gainNode.gain.value = volume / 100;
            }

            // Apply initial defaults
            ws.setVolume(1);
            ws.setPlaybackRate(speed);
        });

        ws.on('timeupdate', (time) => setCurrentTime(time));
        ws.on('play', () => setIsPlaying(true));
        ws.on('pause', () => setIsPlaying(false));
        ws.on('finish', () => setIsPlaying(false));

        wsRegions.on('region-updated', (region) => {
            setRegionStart(region.start);
            setRegionEnd(region.end);
            setStartTimeInput(formatTime(region.start));
            setEndTimeInput(formatTime(region.end));
        });

        wavesurfer.current = ws;

        return () => {
            ws.destroy();
            setIsReady(false);
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(console.error);
                audioContextRef.current = null;
            }
        };
    }, [audioUrl]);

    // Apply Effects
    useEffect(() => {
        if (!wavesurfer.current || !isReady) return;

        // Volume via GainNode
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = volume / 100;
        }

        // Speed
        wavesurfer.current.setPlaybackRate(speed);

    }, [volume, speed, eq, isReady]);

    // Manual Time Update Handler
    const handleTimeInputBlur = (type: 'start' | 'end', value: string) => {
        // Parse "MM:SS.ms" or just seconds
        const parts = value.split(':');
        let seconds = 0;
        if (parts.length === 2) {
            seconds = parseInt(parts[0]) * 60 + parseFloat(parts[1]);
        } else {
            seconds = parseFloat(value);
        }

        if (isNaN(seconds)) return;

        // Clamp values
        if (type === 'start') {
            seconds = Math.max(0, Math.min(seconds, regionEnd - 0.1));
            setRegionStart(seconds);
            setStartTimeInput(formatTime(seconds));
        } else {
            seconds = Math.max(regionStart + 0.1, Math.min(seconds, duration));
            setRegionEnd(seconds);
            setEndTimeInput(formatTime(seconds));
        }

        // Update functionality
        const regionsPlugin = regions.current;
        if (regionsPlugin) {
            const region = regionsPlugin.getRegions()[0];
            if (region) {
                region.setOptions({
                    start: type === 'start' ? seconds : regionStart,
                    end: type === 'end' ? seconds : regionEnd
                });
            }
        }
    };

    const togglePlay = () => {
        wavesurfer.current?.playPause();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 10);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
    };

    if (!audioUrl) return null;

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">

            {/* Main Editor Section */}
            <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-200 rounded-lg text-slate-700">
                            <Volume2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-800 truncate max-w-xs" title={fileName}>{fileName}</h3>
                            <div className="text-xs text-slate-500 font-mono">
                                {formatTime(currentTime)} <span className="text-slate-400">/</span> {formatTime(duration)}
                            </div>
                        </div>
                    </div>
                    <button onClick={onReset} className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
                        <RotateCcw className="w-4 h-4" />
                        <span className="hidden sm:inline">Reset</span>
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-center space-x-2 p-3 bg-white border-b border-slate-200">
                    <ToolButton
                        icon={<BoxSelect className="w-4 h-4" />}
                        label="Trim"
                        active={activeTool === 'trim'}
                        onClick={() => setActiveTool('trim')}
                    />
                    <ToolButton
                        icon={<Volume2 className="w-4 h-4" />}
                        label="Volume"
                        active={activeTool === 'volume'}
                        onClick={() => setActiveTool('volume')}
                    />
                    <ToolButton
                        icon={<Gauge className="w-4 h-4" />}
                        label="Speed"
                        active={activeTool === 'speed'}
                        onClick={() => setActiveTool('speed')}
                    />
                    <ToolButton
                        icon={<Sliders className="w-4 h-4" />}
                        label="Equalizer"
                        active={activeTool === 'eq'}
                        onClick={() => setActiveTool('eq')}
                    />
                </div>

                {/* Main Editor Area */}
                <div className="relative p-8 bg-zinc-50 min-h-[220px]">
                    <div ref={containerRef} className="w-full" />
                    <div ref={timelineRef} className="w-full mt-2" />
                </div>

                {/* Contextual Controls Panel */}
                <div className="bg-white border-t border-slate-200 px-6 py-8 min-h-[140px] flex items-center justify-center">
                    {activeTool === 'trim' && (
                        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                            {/* 1. Time Selection */}
                            <div className="flex flex-col items-center">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Time Range</h4>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={startTimeInput}
                                        onChange={(e) => setStartTimeInput(e.target.value)}
                                        onBlur={(e) => handleTimeInputBlur('start', e.target.value)}
                                        className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-center font-mono text-slate-900 font-bold focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm"
                                    />
                                    <span className="text-slate-300 text-sm">-</span>
                                    <input
                                        type="text"
                                        value={endTimeInput}
                                        onChange={(e) => setEndTimeInput(e.target.value)}
                                        onBlur={(e) => handleTimeInputBlur('end', e.target.value)}
                                        className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-center font-mono text-slate-900 font-bold focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* 2. Mode */}
                            <div className="flex flex-col items-center border-l border-r border-slate-100 px-4">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Action Mode</h4>
                                <div className="flex bg-slate-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setCutMode('extract')}
                                        className={cn("px-4 py-1.5 rounded-md text-xs font-bold transition-all", cutMode === 'extract' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900")}
                                    >
                                        Extract
                                    </button>
                                    <button
                                        onClick={() => setCutMode('delete')}
                                        className={cn("px-4 py-1.5 rounded-md text-xs font-bold transition-all", cutMode === 'delete' ? "bg-white text-red-600 shadow-sm" : "text-slate-500 hover:text-red-600")}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* 3. Fade */}
                            <div className="flex flex-col items-center">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Effects</h4>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors bg-white", fadeIn ? "bg-slate-900 border-slate-900" : "border-slate-300 group-hover:border-slate-400")}>
                                            {fadeIn && <div className="w-2 h-1 border-l-2 border-b-2 border-white rotate-[-45deg] mb-0.5" />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={fadeIn} onChange={(e) => setFadeIn(e.target.checked)} />
                                        <span className={cn("text-xs font-bold transition-colors", fadeIn ? "text-slate-900" : "text-slate-500")}>Fade In</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors bg-white", fadeOut ? "bg-slate-900 border-slate-900" : "border-slate-300 group-hover:border-slate-400")}>
                                            {fadeOut && <div className="w-2 h-1 border-l-2 border-b-2 border-white rotate-[-45deg] mb-0.5" />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={fadeOut} onChange={(e) => setFadeOut(e.target.checked)} />
                                        <span className={cn("text-xs font-bold transition-colors", fadeOut ? "text-slate-900" : "text-slate-500")}>Fade Out</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTool === 'volume' && (
                        <div className="w-full max-w-md space-y-4">
                            <div className="flex justify-between text-base text-slate-600">
                                <span className="font-medium">Volume Boost</span>
                                <span className="font-mono text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded">{volume}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="200"
                                step="10"
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                                className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer hover:bg-slate-300 transition-colors"
                            />
                        </div>
                    )}

                    {activeTool === 'speed' && (
                        <div className="w-full max-w-md space-y-4">
                            <div className="flex justify-between text-base text-slate-600">
                                <span className="font-medium">Playback Speed</span>
                                <span className="font-mono text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded">{speed}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="2.0"
                                step="0.1"
                                value={speed}
                                onChange={(e) => setSpeed(Number(e.target.value))}
                                className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer hover:bg-slate-300 transition-colors"
                            />
                        </div>
                    )}

                    {activeTool === 'eq' && (
                        <div className="flex space-x-12 w-full max-w-lg justify-center">
                            <EQSlider label="Bass" value={eq.bass} onChange={(v) => setEq({ ...eq, bass: v })} />
                            <EQSlider label="Mid" value={eq.mid} onChange={(v) => setEq({ ...eq, mid: v })} />
                            <EQSlider label="Treble" value={eq.treble} onChange={(v) => setEq({ ...eq, treble: v })} />
                        </div>
                    )}
                </div>

                {/* Footer: Format & Export */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Format Selector */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Format:</span>
                        <div className="flex flex-wrap gap-1">
                            {['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'].map((fmt) => (
                                <button
                                    key={fmt}
                                    onClick={() => setFormat(fmt)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all border",
                                        format === fmt
                                            ? "bg-slate-900 text-white border-slate-900"
                                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                                    )}
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={togglePlay}
                            className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-white text-slate-900 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all shadow-sm"
                            title="Play/Pause"
                        >
                            {isPlaying ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current w-5 h-5 ml-0.5" />}
                        </button>

                        <button
                            onClick={() => onCut(regionStart, regionEnd, {
                                volume,
                                speed,
                                eq,
                                format,
                                fade: { in: fadeIn, out: fadeOut, duration: 3 },
                                mode: cutMode,
                                totalDuration: duration
                            })}
                            disabled={isProcessing}
                            className={cn(
                                "flex-1 md:flex-none rounded-xl px-8 py-3 font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2",
                                isProcessing
                                    ? "bg-slate-400 cursor-not-allowed"
                                    : "bg-slate-900 hover:bg-black hover:shadow-xl"
                            )}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Scissors className="w-4 h-4" />
                                    <span>Export {format.toUpperCase()}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToolButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-150 min-w-[80px]",
                active
                    ? "bg-slate-100 text-slate-900 font-semibold shadow-inner border border-slate-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            )}
        >
            <div className="mb-1">{icon}</div>
            <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
        </button>
    );
}

function EQSlider({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
    return (
        <div className="flex flex-col items-center space-y-3">
            <div className="h-32 bg-slate-200 w-10 rounded-full relative p-1 flex justify-center shadow-inner">
                <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-24 h-8 bg-transparent appearance-none cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90"
                    style={{ accentColor: '#0f172a' }} // Slate-900
                />
                <div className="absolute inset-x-0 bottom-0 bg-slate-900/10 rounded-b-full pointer-events-none" style={{ height: `${((value + 10) / 20) * 100}%` }}></div>
            </div>
            <div className="text-center">
                <span className="block text-xs font-bold text-slate-600">{label}</span>
                <span className="block text-[10px] font-mono text-slate-900">{value > 0 ? `+${value}` : value}dB</span>
            </div>
        </div>
    );
}
