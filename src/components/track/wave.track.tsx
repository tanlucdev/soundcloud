'use client'
import { use, useEffect, useMemo, useState } from "react"
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js"
import { useRef } from 'react';
import { useSearchParams } from "next/navigation";
import { useWavesurfer } from '@wavesurfer/react'

const WaveTrack = () => {
  const searchParams = useSearchParams();
  const fileName = searchParams.get('audio');
  const containerRef = useRef(null);
  const options = useMemo(() => ({
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: `/api?audio=${fileName}`,
  }), []);
  const wavesurfer = useWavesurfer({ container: containerRef, ...options });

  return (
    <div ref={containerRef}>
      Playlist
    </div>
  )
}

export default WaveTrack;