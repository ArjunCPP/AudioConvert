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
    options: { volume: number; speed: number; eq: { bass: number; mid: number; treble: number } },
    onProgress?: (progress: number) => void
): Promise<Blob> => {
    const ffmpeg = await loadFFmpeg();
    const inputName = 'input_audio';
    const outputName = 'output_processed.mp3';

    await ffmpeg.writeFile(inputName, await fetchFile(audioBlob));

    if (onProgress) {
        ffmpeg.on('progress', ({ progress }) => {
            onProgress(progress * 100);
        });
    }

    // Construct Fileter Chain
    // Volume: volume=1.5
    // Speed: atempo=1.2 (atempo filter accepts 0.5 to 100.0)
    // EQ: equalizer=f=100:width_type=h:width=200:g=-10, equalizer=f=1000:width_type=h:width=200:g=0...
    // Simplification for 3-band EQ:
    // Bass: lowshelf (f ~ 100Hz)
    // Mid: trigger generally ~1kHz (peaking)
    // Treble: highshelf (f ~ 10kHz)

    const filters: string[] = [];

    // Volume (converted from % to multiplier)
    if (options.volume !== 100) {
        filters.push(`volume=${options.volume / 100}`);
    }

    // Speed
    if (options.speed !== 1) {
        filters.push(`atempo=${options.speed}`);
    }

    // EQ
    // Bass (Low Shelf at 100Hz)
    if (options.eq.bass !== 0) {
        filters.push(`equalizer=f=100:width_type=h:width=200:g=${options.eq.bass}`);
        // Or simpler: bass=g=...
    }
    // Mid (Peaking at 1000Hz)
    if (options.eq.mid !== 0) {
        filters.push(`equalizer=f=1000:width_type=h:width=200:g=${options.eq.mid}`);
    }
    // Treble (High Shelf at 10000Hz)
    if (options.eq.treble !== 0) {
        filters.push(`equalizer=f=10000:width_type=h:width=200:g=${options.eq.treble}`);
    }

    const filterGraph = filters.length > 0 ? filters.join(',') : null;

    const args = [
        '-i', inputName,
        '-ss', start.toString(),
        '-to', end.toString()
    ];

    if (filterGraph) {
        args.push('-af', filterGraph);
    }

    args.push('-c:a', 'libmp3lame', '-q:a', '2', outputName);

    // Run FFmpeg
    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile(outputName);

    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    return new Blob([data as any], { type: 'audio/mp3' });
};

const fetchFile = async (file: File | Blob): Promise<Uint8Array> => {
    return new Uint8Array(await file.arrayBuffer());
};
