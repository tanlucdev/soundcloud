'use client'
import { AppBar, Container, IconButton, Toolbar } from "@mui/material";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const Footer = () => {
  return (
    <div>
      <AppBar position="fixed" color="transparent"
        sx={{
          top: 'auto', bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f2f2f2'
        }}>
        <Container maxWidth="lg" sx={{ border: 'none', gap: 10, display: 'flex' }}>
          <AudioPlayer
            autoPlay
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
            onPlay={e => console.log("onPlay")}
            style={{
              boxShadow: 'unset',
              backgroundColor: '#f2f2f2',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              justifyContent: 'center',
              minWidth: 100
            }}>
            <div style={{ color: '#ccc' }}>Kento</div>
            <div style={{ color: 'black' }}>I love you 3000</div>
          </div>
        </Container>
      </AppBar>
    </div>
  );
}

export default Footer;