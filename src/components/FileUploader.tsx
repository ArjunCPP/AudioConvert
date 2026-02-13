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
                'relative flex flex-col items-center justify-center w-full h-96 rounded-3xl border-4 border-dashed transition-all duration-300 cursor-pointer overflow-hidden group bg-white',
                isDragActive
                    ? 'border-black bg-slate-100 shadow-2xl scale-[1.02]'
                    : 'border-slate-900 hover:border-black hover:bg-slate-50 shadow-xl',
                isProcessing && 'pointer-events-none opacity-50',
                className
            )}
        >
            <input {...getInputProps()} />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-900/10 pointer-events-none" />

            <div className="flex flex-col items-center justify-center space-y-6 text-center z-10 p-8">
                <div className={cn(
                    "p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-black transition-all duration-300 group-hover:scale-110 shadow-2xl",
                    isDragActive && "scale-110 from-black to-slate-900"
                )}>
                    {isDragActive ? (
                        <Upload className="w-12 h-12 text-white" />
                    ) : (
                        <div className="flex space-x-2">
                            <FileAudio className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                            <FileVideo className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-900">
                        {isDragActive ? 'Drop the file here' : 'Click to upload or drag and drop'}
                    </h3>
                    <p className="text-base text-slate-700 max-w-md mx-auto font-medium">
                        Support for Audio (MP3, WAV, AAC) and Video (MP4, MKV, MOV) conversion to audio.
                    </p>
                </div>

                <button className="px-8 py-3 rounded-full bg-slate-900 hover:bg-black text-white font-bold shadow-2xl hover:shadow-slate-900/50 transition-all active:scale-95 text-base hover-scale border-2 border-slate-800">
                    Select File
                </button>
            </div>
        </div>
    );
}
