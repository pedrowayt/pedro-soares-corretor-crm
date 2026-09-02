"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function LakeVillageAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.22;
    }
  }, []);

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  return (
    <div className="lake-audio-control">
      <audio ref={audioRef} loop preload="metadata" src="/audio/lake-village-lake-ambience.mp3" />
      <button
        type="button"
        className="lake-audio-button"
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pausar som do lago" : "Ouvir som do lago"}
        onClick={toggleAudio}
      >
        {isPlaying ? <Volume2 size={17} /> : <VolumeX size={17} />}
        <span>{isPlaying ? "Som do lago ligado" : "Ouvir som do lago"}</span>
      </button>
    </div>
  );
}
