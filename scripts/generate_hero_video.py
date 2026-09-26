import os
import subprocess
import numpy as np
from PIL import Image
import imageio_ffmpeg

def main():
    frames_dir = os.path.join("public", "hero", "sequence")
    out_dir = os.path.join("public", "hero")
    os.makedirs(out_dir, exist_ok=True)
    
    mp4_path = os.path.join(out_dir, "sky-laban-hero.mp4")
    webm_path = os.path.join(out_dir, "sky-laban-hero.webm")
    
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    print(f"Using FFmpeg: {ffmpeg_exe}")
    
    # 24 fps cinematic
    fps = 24
    
    # Load all 240 frames
    frame_files = [f"ezgif-frame-{i:03d}.jpg" for i in range(1, 241)]
    print(f"Reading {len(frame_files)} frames...")
    
    first_frame = Image.open(os.path.join(frames_dir, frame_files[0])).convert("RGB")
    width, height = first_frame.size
    print(f"Frame resolution: {width}x{height}")
    
    first_np = np.array(first_frame, dtype=np.float32)
    last_frame = Image.open(os.path.join(frames_dir, frame_files[-1])).convert("RGB")
    last_np = np.array(last_frame, dtype=np.float32)
    
    # Hold final hero product frame for 36 frames (~1.5s)
    hold_count = 36
    # Smooth crossfade to frame 1 over 24 frames (1.0s)
    fade_count = 24
    
    total_frames = len(frame_files) + hold_count + fade_count
    print(f"Total video frames: {total_frames} (~{total_frames / fps:.1f}s)")
    
    # Generator for raw bytes
    def frame_bytes_generator():
        # 1. Main cinematic sequence (001 to 240)
        for i, fname in enumerate(frame_files):
            fpath = os.path.join(frames_dir, fname)
            img = Image.open(fpath).convert("RGB")
            yield img.tobytes()
            if (i + 1) % 40 == 0:
                print(f"  Processed {i + 1}/{len(frame_files)} sequence frames")
        
        # 2. Hold final hero product shot
        last_bytes = last_frame.tobytes()
        for _ in range(hold_count):
            yield last_bytes
        print(f"  Processed {hold_count} hold frames")
        
        # 3. Seamless subtle crossfade to opening frame
        for i in range(1, fade_count + 1):
            alpha = i / (fade_count + 1.0)
            blended = (1.0 - alpha) * last_np + alpha * first_np
            blended_img = Image.fromarray(np.clip(blended, 0, 255).astype(np.uint8))
            yield blended_img.tobytes()
        print(f"  Processed {fade_count} crossfade frames")

    # Generate MP4 (H.264)
    print(f"Encoding MP4: {mp4_path}...")
    cmd_mp4 = [
        ffmpeg_exe,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{width}x{height}",
        "-pix_fmt", "rgb24",
        "-r", str(fps),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        mp4_path
    ]
    
    pipe_mp4 = subprocess.Popen(cmd_mp4, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    for b in frame_bytes_generator():
        pipe_mp4.stdin.write(b)
    pipe_mp4.stdin.close()
    _, stderr_mp4 = pipe_mp4.communicate()
    
    if pipe_mp4.returncode != 0:
        print("MP4 encoding error:", stderr_mp4.decode("utf-8", errors="ignore"))
    else:
        file_size_mb = os.path.getsize(mp4_path) / (1024 * 1024)
        print(f"MP4 created successfully: {file_size_mb:.2f} MB")

    # Generate WebM (VP9)
    print(f"Encoding WebM: {webm_path}...")
    cmd_webm = [
        ffmpeg_exe,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{width}x{height}",
        "-pix_fmt", "rgb24",
        "-r", str(fps),
        "-i", "-",
        "-c:v", "libvpx-vp9",
        "-b:v", "0",
        "-crf", "28",
        "-pix_fmt", "yuv420p",
        "-deadline", "good",
        "-cpu-used", "2",
        webm_path
    ]
    
    pipe_webm = subprocess.Popen(cmd_webm, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    for b in frame_bytes_generator():
        pipe_webm.stdin.write(b)
    pipe_webm.stdin.close()
    _, stderr_webm = pipe_webm.communicate()
    
    if pipe_webm.returncode != 0:
        print("WebM encoding error:", stderr_webm.decode("utf-8", errors="ignore"))
    else:
        file_size_mb = os.path.getsize(webm_path) / (1024 * 1024)
        print(f"WebM created successfully: {file_size_mb:.2f} MB")

if __name__ == "__main__":
    main()
