'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, FileVideo } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    className?: string;
    isProcessing?: boolean;
}

export function FileUploader({ onFileSelect, className, isProcessing = false }: FileUploaderProps) {
    const [dragActive, setDragActive] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'audio/*': [],
            'video/*': [],
        },
        maxFiles: 1,
        disabled: isProcessing,
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'relative flex flex-col items-center justify-center w-full h-80 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden group bg-zinc-50 hover:bg-white',
                isDragActive
                    ? 'border-slate-900 bg-slate-50 scale-[1.01]'
                    : 'border-slate-300 hover:border-slate-900 shadow-sm hover:shadow-md',
                isProcessing && 'pointer-events-none opacity-50',
                className
            )}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center justify-center space-y-6 text-center z-10 p-8">
                <div className={cn(
                    "p-5 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-slate-300",
                    isDragActive && "bg-slate-900 border-slate-900"
                )}>
                    {isDragActive ? (
                        <Upload className="w-10 h-10 text-white" />
                    ) : (
                        <div className="flex space-x-2 text-slate-700">
                            <FileAudio className="w-8 h-8" />
                            <FileVideo className="w-8 h-8 opacity-50" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        {isDragActive ? 'Drop the file here' : 'Click to upload or drag and drop'}
                    </h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                        Support for Audio (MP3, WAV, AAC) and Video (MP4, MKV, MOV) conversion to audio.
                    </p>
                </div>

                <button className="px-8 py-2.5 rounded-lg bg-slate-900 hover:bg-black text-white font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 text-sm">
                    Select File
                </button>
            </div>
        </div>
    );
}
