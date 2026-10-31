import React from 'react';
import { X, Mic2 } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';

export const LyricsPanel = () => {
  const { currentTrack, showLyrics, setShowLyrics } = usePlayer();

  if (!showLyrics) return null;

  const lyrics = currentTrack?.lyrics || [
    "Instrumental track",
    "Enjoy the rhythm and vibe with Music maniac..."
  ];

  return (
    <aside style={{
      width: '320px',
      backgroundColor: 'var(--bg-base)',
      borderRadius: '8px',
      margin: '8px 8px 8px 0',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      height: 'calc(100vh - var(--player-height) - 16px)',
      boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.4)',
      overflow: 'hidden',
      flexShrink: 0
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mic2 size={18} color="var(--primary-green-bright)" />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Lyrics</h3>
        </div>
        <button
          onClick={() => setShowLyrics(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-subdued)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Track Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={currentTrack?.cover}
          alt={currentTrack?.title}
          style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }} className="line-clamp-1">
            {currentTrack?.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-subdued)' }} className="line-clamp-1">
            {currentTrack?.artist}
          </div>
        </div>
      </div>

      {/* Lyrics lines */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingRight: '6px',
        paddingTop: '8px'
      }}>
        {lyrics.map((line, idx) => {
          // Clean timestamp tag if present e.g. [00:15.00]
          const cleanText = line.replace(/\[.*?\]/g, '').trim();
          return (
            <p
              key={idx}
              style={{
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: '1.4',
                color: idx === 1 || idx === 2 ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary-green-bright)'}
              onMouseLeave={(e) => {
                e.target.style.color = idx === 1 || idx === 2 ? '#ffffff' : 'rgba(255, 255, 255, 0.65)';
              }}
            >
              {cleanText}
            </p>
          );
        })}
      </div>
    </aside>
  );
};
