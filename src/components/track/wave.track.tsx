'use client'
import { Box, Button, Container, Tooltip, Typography } from "@mui/material";
import { useWavesurfer } from '@wavesurfer/react';
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";
import './wave.scss';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const WaveTrack = () => {
  const searchParams = useSearchParams();
  const fileName = searchParams.get('audio');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [time, setTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const hoverRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

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
      height: 100,
      barWidth: 3,
      url: `/api?audio=${fileName}`
    }

  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secondsRemainder = Math.round(seconds) % 60
    const paddedSeconds = `0${secondsRemainder}`.slice(-2)
    return `${minutes}:${paddedSeconds}`
  }

  const renderFunction = useCallback(
    (peaks: (Float32Array | number[])[], ctx: CanvasRenderingContext2D) => {
      const { width, height } = ctx.canvas;
      const barWidth = 2;
      const gap = 1;
      const step = barWidth + gap;
      const totalBars = Math.floor(width / step);
      const data = peaks[0];
      const scale = data.length / totalBars;

      // Split heights
      const topPartHeight = height * 0.7;
      const bottomPartHeight = height * 0.3;

      const currentTime = wavesurferRef.current?.getCurrentTime?.() ?? 0;
      const duration = wavesurferRef.current?.getDuration?.() ?? 1;
      const playedRatio = currentTime / duration;

      // Clear canvas (transparent background)
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < totalBars; i++) {
        const index = Math.floor(i * scale);
        const value = Math.abs(data[index] ?? 0);

        // Bar heights for top and bottom
        const barHeightTop = value * topPartHeight;
        const barHeightBottom = value * bottomPartHeight;

        const x = i * step;
        const yTop = topPartHeight - barHeightTop;
        const yBottom = topPartHeight;

        // Played or unplayed color for wave bars only
        ctx.fillStyle = i / totalBars < playedRatio ? "#ff8800" : "#b0b0b0";

        // Top bar (70%)
        ctx.fillRect(x, yTop, barWidth, barHeightTop);

        // Bottom mirrored bar (30%)
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x, yBottom, barWidth, barHeightBottom);
        ctx.globalAlpha = 1.0;
      }

      // Baseline
      ctx.fillStyle = "#00000055";
      ctx.fillRect(0, topPartHeight - 0.5, width, 1);
    },
    []
  )

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    ...options,
    renderFunction,
  });

  useEffect(() => {
    if (wavesurfer) {
      wavesurferRef.current = wavesurfer
    }
  }, [wavesurfer])

  wavesurfer?.once('interaction', () => {
    wavesurfer.play();
  })

  if (containerRef.current) {
    containerRef.current.addEventListener('pointermove', (e) => {
      if (hoverRef.current) {
        hoverRef.current.style.width = `${e.offsetX}px`;
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

  const arrComments = [
    {
      id: 1,
      avatar: "http://localhost:8000/images/chill1.png",
      moment: 10,
      user: "username 1",
      content: "just a comment1"
    },
    {
      id: 2,
      avatar: "http://localhost:8000/images/chill1.png",
      moment: 30,
      user: "username 2",
      content: "just a comment3"
    },
    {
      id: 3,
      avatar: "http://localhost:8000/images/chill1.png",
      moment: 50,
      user: "username 3",
      content: "just a comment3"
    },
  ]

  const calLeft = (moment: number) => {
    const percent = (moment / 199) * 100;
    return `${percent}%`;
  }

  return (
    <Container>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '384px',
          marginLeft: '16px',
          marginRight: '16px',
          background: 'linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '32px',
            right: '32px',

          }}>
          <img style={{ height: '320px', width: '320px' }}
            src="https://anhdep.edu.vn/upload/2024/08/tai-ngay-avatar-anime-chill-lofi-8211-top-50-hinh-anh-hot-nhat-53.webp" alt="" />
        </Box>
        <Box sx={{
          position: 'absolute',
          top: '32px',
          left: '32px',
          display: 'flex',
        }}>
          <Box
            onClick={onPlayPause}
            sx={{
              borderRadius: '50%',
              background: '#F50',
              height: '50px',
              width: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {isPlaying ?
              <PauseIcon sx={{ fontSize: 30, color: 'white' }} />
              : <PlayArrowIcon sx={{ fontSize: 30, color: 'white' }} />}
          </Box>
          <Box
            sx={{
              marginLeft: '15px',
              alignItems: 'center',
            }}
          >
            <span style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#fff',
              background: 'black',
              width: '100%',
              padding: '4px 8px',
              marginBottom: '8px',
            }}>
              Lofi Chill Song
            </span>
            <br />
            <span style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#fff',
              background: 'black',
              width: '100%',
              padding: '4px 8px',
            }}>
              Kento
            </span>
          </Box>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '32px',
            left: '32px',
            width: '744px',
          }}>
          <Box ref={containerRef} id="waveform">
            <Box className="time">{time}</Box>
            <Box className="duration">{duration}</Box>
            <Box ref={hoverRef} className="hover"></Box>
            <Box sx={{
              position: 'absolute',
              height: '30px',
              width: '100%',
              bottom: '0',
              backdropFilter: 'brightness(0.5)',
            }} />
            <Box sx={{ position: 'relative' }}>
              {arrComments.map((item) => {
                return (
                  <Tooltip title={item.content} key={item.id} arrow>
                    <img
                      onPointerMove={(e) => {
                        const hover = hoverRef.current!;
                        hover.style.width = calLeft(item.moment);
                      }}
                      key={item.id}
                      style={{
                        height: '20px',
                        width: '20px',
                        position: 'absolute',
                        top: 71,
                        zIndex: 20,
                        left: calLeft(item.moment),
                      }}
                      src="http://localhost:8000/images/chill1.png" alt=""
                    />
                  </Tooltip>
                )

              })}
            </Box>
          </Box>

        </Box>

      </Box>

    </Container>
  )
}

export default WaveTrack;