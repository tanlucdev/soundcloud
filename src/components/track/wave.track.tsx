'use client'
import { Container } from "@mui/material";
import { useWavesurfer } from '@wavesurfer/react';
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import './wave.scss';

const WaveTrack = () => {
  const searchParams = useSearchParams();
  const fileName = searchParams.get('audio');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [time, setTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const hover = useRef<HTMLDivElement | null>(null);

  const options = useMemo((): Omit<WaveSurferOptions, 'container'> => {
    let gradient, progressGradient;
    if (typeof window !== 'undefined') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // Define the waveform gradient
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
      gradient.addColorStop(0, '#656666') // Top color
      gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
      gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
      gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
      gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
      gradient.addColorStop(1, '#B1B1B1') // Bottom color

      // Define the progress gradient
      progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
      progressGradient.addColorStop(0, '#EE772F') // Top color
      progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
      progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
      progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
      progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
      progressGradient.addColorStop(1, '#F6B094') // Bottom color
    }

    return {
      waveColor: gradient,
      progressColor: progressGradient,
      height: 150,
      barWidth: 2,
      url: `/api?audio=${fileName}`
    }

  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secondsRemainder = Math.round(seconds) % 60
    const paddedSeconds = `0${secondsRemainder}`.slice(-2)
    return `${minutes}:${paddedSeconds}`
  }
  const { wavesurfer, isPlaying } = useWavesurfer({ container: containerRef, ...options });

  if (containerRef.current) {
    containerRef.current.addEventListener('pointermove', (e) => {
      if (hover.current) {
        hover.current.style.width = `${e.offsetX}px`;
      }
    });
  }

  if (wavesurfer) {
    wavesurfer.on('decode', (duration) => setDuration(formatTime(duration)))
    wavesurfer.on('timeupdate', (currentTime) => setTime(formatTime(currentTime)))
  }

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause()
  }, [wavesurfer]);

  return (
    <Container>
      <div ref={containerRef} id="waveform">
        <div className="time">{time}</div>
        <div className="duration">{duration}</div>
        <div ref={hover} className="hover"></div>
      </div>
      <button onClick={onPlayPause} style={{ minWidth: '5em' }}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </Container>
  )
}

export default WaveTrack;