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
            setDuration(ws.getDuration());

            wsRegions.addRegion({
                start: 0,
                end: ws.getDuration(),
                color: 'rgba(0, 0, 0, 0.05)', // Subtle dark overlay
                drag: true,
                resize: true,
            });

            setRegionStart(0);
            setRegionEnd(ws.getDuration());

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
            // We set the media element volume to 1 (max) and control actual volume via GainNode
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

    const togglePlay = () => {
        wavesurfer.current?.playPause();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 10);
        return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
    };

    if (!audioUrl) return null;

    return (
        <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">

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
                <button onClick={onReset} className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors text-sm">
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Reset</span>
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-center space-x-1 p-2 bg-white border-b border-slate-200">
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
            <div className="relative p-8 bg-white min-h-[200px]">
                <div ref={containerRef} className="w-full" />
                <div ref={timelineRef} className="w-full mt-1" />

                {/* Selection Info Overlay */}
                <div className="absolute top-4 right-4 flex flex-col items-end pointer-events-none">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Selection</span>
                    <div className="flex items-center space-x-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded border border-slate-200 shadow-sm">
                        <span className="font-mono text-slate-800 text-sm">{formatTime(regionStart)}</span>
                        <span className="text-slate-400 text-xs">-</span>
                        <span className="font-mono text-slate-800 text-sm">{formatTime(regionEnd)}</span>
                    </div>
                </div>
            </div>

            {/* Contextual Controls & Playback */}
            <div className="bg-slate-50 border-t border-slate-200">

                {/* Dynamic Control Panel */}
                <div className="px-6 py-6 border-b border-slate-200 min-h-[100px] flex items-center justify-center">
                    {activeTool === 'trim' && (
                        <div className="text-center text-slate-500 text-sm max-w-md">
                            <p>Drag the handles on the timeline to select the part of the audio you want to keep.</p>
                        </div>
                    )}

                    {activeTool === 'volume' && (
                        <div className="w-full max-w-md space-y-3">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Volume</span>
                                <span className="font-mono text-slate-900 font-bold">{volume}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="200"
                                step="10"
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                                className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    )}

                    {activeTool === 'speed' && (
                        <div className="w-full max-w-md space-y-3">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Playback Speed</span>
                                <span className="font-mono text-slate-900 font-bold">{speed}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="2.0"
                                step="0.1"
                                value={speed}
                                onChange={(e) => setSpeed(Number(e.target.value))}
                                className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    )}

                    {activeTool === 'eq' && (
                        <div className="flex space-x-8 w-full max-w-lg justify-center">
                            <EQSlider label="Bass" value={eq.bass} onChange={(v) => setEq({ ...eq, bass: v })} />
                            <EQSlider label="Mid" value={eq.mid} onChange={(v) => setEq({ ...eq, mid: v })} />
                            <EQSlider label="Treble" value={eq.treble} onChange={(v) => setEq({ ...eq, treble: v })} />
                        </div>
                    )}
                </div>

                {/* Bottom Action Bar */}
                <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center justify-center w-full md:w-auto">
                        <button
                            onClick={togglePlay}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-900 text-white hover:scale-105 transition-transform shadow-lg shadow-slate-900/20"
                        >
                            {isPlaying ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current w-5 h-5 ml-1" />}
                        </button>
                    </div>

                    <div className="w-full md:w-auto flex justify-center">
                        <button
                            onClick={() => onCut(regionStart, regionEnd, { volume, speed, eq })}
                            disabled={isProcessing}
                            className={cn(
                                "group relative overflow-hidden rounded-full px-8 py-3 font-semibold text-white shadow-lg transition-all active:scale-95 w-full md:w-auto",
                                isProcessing
                                    ? "bg-slate-400 cursor-not-allowed"
                                    : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/20"
                            )}
                        >
                            <span className="relative flex items-center justify-center space-x-2">
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Scissors className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                                        <span>Process & Save</span>
                                    </>
                                )}
                            </span>
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
                "flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all min-w-[80px]",
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
