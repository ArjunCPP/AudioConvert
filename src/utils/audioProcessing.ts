import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const loadFFmpeg = async () => {
    if (ffmpeg) return ffmpeg;

    ffmpeg = new FFmpeg();

    // Load ffmpeg.wasm from a CDN
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    return ffmpeg;
};

export const extractAudioFromVideo = async (videoFile: File, onProgress?: (progress: number) => void): Promise<Blob> => {
    const ffmpeg = await loadFFmpeg();
    const inputName = 'input_video';
    const outputName = 'output_audio.mp3';

    await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

    if (onProgress) {
        ffmpeg.on('progress', ({ progress }) => {
            onProgress(progress * 100);
        });
    }

    // Extract audio: -vn (no video) -acodec libmp3lame -q:a 2 (high quality)
    await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-q:a', '2', outputName]);

    const data = await ffmpeg.readFile(outputName);

    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    return new Blob([data as any], { type: 'audio/mp3' });
};

export const trimAudio = async (
    audioBlob: Blob | File,
    start: number,
    end: number,
    options: {
        volume: number;
        speed: number;
        eq: { bass: number; mid: number; treble: number };
        format: string;
        fade: { in: boolean; out: boolean; duration: number };
        mode: 'extract' | 'delete';
        totalDuration?: number; // Required for delete mode
    },
    onProgress?: (progress: number) => void
): Promise<Blob> => {
    const ffmpeg = await loadFFmpeg();
    const inputName = 'input_audio';
    const outputName = `output_processed.${options.format}`;

    await ffmpeg.writeFile(inputName, await fetchFile(audioBlob));

    if (onProgress) {
        ffmpeg.on('progress', ({ progress }) => {
            onProgress(progress * 100);
        });
    }

    // --- Filter Chain Construction ---
    // We will build a sequential chain of filters:
    // [0:a] -> [effects] -> [trimmed] -> [faded] -> [out]

    let filterChain = "";
    let currentStream = "[0:a]"; // Start with input audio stream

    // 1. Core Effects (Volume, Speed, EQ)
    const effectFilters: string[] = [];

    // Volume
    if (options.volume !== 100) {
        effectFilters.push(`volume=${options.volume / 100}`);
    }

    // Speed (atempo filter accepts 0.5 to 2.0)
    if (options.speed !== 1) {
        effectFilters.push(`atempo=${options.speed}`);
    }

    // EQ
    if (options.eq.bass !== 0) effectFilters.push(`equalizer=f=100:width_type=h:width=200:g=${options.eq.bass}`);
    if (options.eq.mid !== 0) effectFilters.push(`equalizer=f=1000:width_type=h:width=200:g=${options.eq.mid}`);
    if (options.eq.treble !== 0) effectFilters.push(`equalizer=f=10000:width_type=h:width=200:g=${options.eq.treble}`);

    // If we have effects, apply them first
    if (effectFilters.length > 0) {
        filterChain += `${currentStream}${effectFilters.join(',')}[effects];`;
        currentStream = "[effects]";
    }

    // 2. Cut/Trigger Logic
    // Apply logic to 'currentStream'
    if (options.mode === 'delete' && options.totalDuration) {
        // DELETE MODE: Keep [0...start] AND [end...totalDuration]
        // Note: We use 'atrim' combined with 'asetpts' to reset timestamps.

        // Part 1: Start to 'start'
        filterChain += `${currentStream}atrim=start=0:end=${start},asetpts=PTS-STARTPTS[part1];`;

        // Part 2: 'end' to 'totalDuration'
        // If end >= totalDuration, this part might be empty or error, so we handle standard case.
        // atrim=start=end implies until end of file if 'end' param is omitted.
        filterChain += `${currentStream}atrim=start=${end},asetpts=PTS-STARTPTS[part2];`;

        // Concatenate
        filterChain += `[part1][part2]concat=n=2:v=0:a=1[trimmed];`;
        currentStream = "[trimmed]";

    } else {
        // EXTRACT MODE: Keep [start...end] (Default)
        filterChain += `${currentStream}atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS[trimmed];`;
        currentStream = "[trimmed]";
    }

    // 3. Fade Effects
    // Applied to the [trimmed] stream

    // Calculate duration of the resulting file for fade out
    let resultDuration = 0;
    if (options.mode === 'extract') {
        resultDuration = end - start;
    } else if (options.mode === 'delete' && options.totalDuration) {
        resultDuration = options.totalDuration - (end - start);
    }
    // Adjust duration for speed changes!
    if (options.speed !== 1) {
        resultDuration = resultDuration / options.speed;
    }

    const fadeFilters: string[] = [];
    if (options.fade.in) {
        const d = Math.min(options.fade.duration, resultDuration / 2);
        fadeFilters.push(`afade=t=in:ss=0:d=${d}`);
    }
    if (options.fade.out) {
        const d = Math.min(options.fade.duration, resultDuration / 2);
        // Start time for fade out should be duration - fadeDuration
        const startTime = Math.max(0, resultDuration - d);
        fadeFilters.push(`afade=t=out:st=${startTime}:d=${d}`);
    }

    if (fadeFilters.length > 0) {
        filterChain += `${currentStream}${fadeFilters.join(',')}[final]`;
        currentStream = "[final]";
    }

    // Remove trailing semicolon to prevent FFmpeg errors
    if (filterChain.endsWith(';')) {
        filterChain = filterChain.slice(0, -1);
    }

    // --- Construct FFmpeg Arguments ---
    const args = ['-i', inputName];

    // Logging for debugging
    ffmpeg.on('log', ({ message }) => {
        console.log('FFmpeg Log:', message);
    });

    // Determine Codec
    let codec = 'libmp3lame';
    switch (options.format) {
        case 'mp3': codec = 'libmp3lame'; break;
        case 'wav': codec = 'pcm_s16le'; break;
        case 'aac': codec = 'aac'; break;
        case 'm4a': codec = 'aac'; break;
        case 'flac': codec = 'flac'; break;
        case 'ogg': codec = 'libvorbis'; break;
        default: codec = 'libmp3lame';
    }

    // Apply Filter Complex
    if (filterChain) {
        args.push('-filter_complex', filterChain);
        // Map the final stream
        // Remove brackets for label
        const mapLabel = currentStream.replace('[', '').replace(']', '');
        if (mapLabel !== '0:a') {
            args.push('-map', `[${mapLabel}]`);
        }
    }

    args.push('-c:a', codec);

    // Format Specific Flags
    if (options.format === 'mp3') {
        args.push('-q:a', '2'); // Variable Bitrate (High Quality)
    } else if (options.format === 'm4a') {
        args.push('-movflags', '+faststart');
    }

    args.push(outputName);

    // Run FFmpeg
    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile(outputName);

    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    // Determine MIME type
    let mimeType = 'audio/mpeg';
    switch (options.format) {
        case 'mp3': mimeType = 'audio/mpeg'; break;
        case 'wav': mimeType = 'audio/wav'; break;
        case 'm4a': mimeType = 'audio/mp4'; break;
        case 'aac': mimeType = 'audio/aac'; break;
        case 'flac': mimeType = 'audio/flac'; break;
        case 'ogg': mimeType = 'audio/ogg'; break;
    }

    return new Blob([data as any], { type: mimeType });
};

const fetchFile = async (file: File | Blob): Promise<Uint8Array> => {
    return new Uint8Array(await file.arrayBuffer());
};
