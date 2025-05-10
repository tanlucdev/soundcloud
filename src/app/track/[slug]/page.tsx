'use client';
import WaveTrack from '@/components/track/wave.track';
import { useSearchParams } from 'next/navigation'

const DetailTrack = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('audio');
  return (
    <div>
      <WaveTrack />
    </div>
  );
}
export default DetailTrack;