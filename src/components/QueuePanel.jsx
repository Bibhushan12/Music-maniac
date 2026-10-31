import React from 'react';
import { X, ListMusic } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';

export const QueuePanel = () => {
  const { currentTrack, queue, queueIndex, showQueue, setShowQueue, playTrack, isPlaying } = usePlayer();

  if (!showQueue) return null;

  const nextTracks = queue.slice(queueIndex + 1);

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
          <ListMusic size={19} color="var(--primary-green-bright)" />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Queue</h3>
        </div>
        <button
          onClick={() => setShowQueue(false)}
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

      {/* Now Playing */}
      <div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-subdued)' }}>Now playing</span>
        {currentTrack && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            padding: '10px',
            borderRadius: '6px',
            marginTop: '8px'
          }}>
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              style={{ width: '44px', height: '44px', borderRadius: '4px', objectFit: 'cover' }}
            />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-green-bright)' }} className="line-clamp-1">
                {currentTrack.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-subdued)' }} className="line-clamp-1">
                {currentTrack.artist}
              </div>
            </div>
            {isPlaying && (
              <div className="equalizer">
                <div className="eq-bar" />
                <div className="eq-bar" />
                <div className="eq-bar" />
                <div className="eq-bar" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Next Up */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-subdued)', marginBottom: '8px' }}>
          Next from queue
        </span>

        {nextTracks.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '12px' }}>
            No more tracks in queue.
          </div>
        ) : (
          <div style={{
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            paddingRight: '4px'
          }}>
            {nextTracks.map((track, idx) => (
              <div
                key={track.id + idx}
                onClick={() => playTrack(track, queue, queueIndex + 1 + idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <img
                  src={track.cover}
                  alt={track.title}
                  style={{ width: '38px', height: '38px', borderRadius: '4px', objectFit: 'cover' }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }} className="line-clamp-1">
                    {track.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-subdued)' }} className="line-clamp-1">
                    {track.artist}
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-subdued)' }}>
                  {track.durationFormatted}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
