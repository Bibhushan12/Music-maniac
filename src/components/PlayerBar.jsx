import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Mic2,
  ListMusic,
  PlusCircle
} from 'lucide-react';
import { usePlayer } from '../context/usePlayer';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const PlayerBar = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    showLyrics,
    showQueue,
    togglePlay,
    seek,
    changeVolume,
    toggleMute,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    setShowLyrics,
    setShowQueue,
    setShowAddToPlaylistModal,
    setTrackForPlaylist
  } = usePlayer();

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentVolume = isMuted ? 0 : volume;
  const volumePercent = currentVolume * 100;
  const trackLiked = currentTrack ? isLiked(currentTrack.id) : false;

  return (
    <footer style={{
      height: 'var(--player-height)',
      backgroundColor: 'var(--bg-black)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0 16px',
      display: 'grid',
      gridTemplateColumns: '30% 40% 30%',
      alignItems: 'center',
      zIndex: 20,
      userSelect: 'none'
    }}>
      {/* 1. Left Section: Track Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        {currentTrack ? (
          <>
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '4px',
                objectFit: 'cover',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)'
              }}
            />
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <span style={{
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                {currentTrack.title}
              </span>
              <span style={{
                color: 'var(--text-subdued)',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = 'underline';
                e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = 'none';
                e.target.style.color = 'var(--text-subdued)';
              }}
              >
                {currentTrack.artist}
              </span>
            </div>

            {/* Like Heart Button */}
            <button
              onClick={() => toggleLike(currentTrack.id)}
              style={{
                background: 'none',
                border: 'none',
                color: trackLiked ? 'var(--primary-green-bright)' : 'var(--text-subdued)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s, color 0.15s'
              }}
              title={trackLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
                if (!trackLiked) e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                if (!trackLiked) e.currentTarget.style.color = 'var(--text-subdued)';
              }}
            >
              <Heart size={18} fill={trackLiked ? 'var(--primary-green-bright)' : 'none'} />
            </button>

            {/* Add to Playlist Button */}
            <button
              onClick={() => {
                setTrackForPlaylist(currentTrack);
                setShowAddToPlaylistModal(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-subdued)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s, color 0.15s'
              }}
              title="Add to playlist"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.color = 'var(--text-subdued)';
              }}
            >
              <PlusCircle size={18} />
            </button>
          </>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            No song loaded
          </div>
        )}
      </div>

      {/* 2. Middle Section: Player Controls & Timeline */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        maxWidth: '722px',
        width: '100%',
        margin: '0 auto'
      }}>
        {/* Buttons Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            title={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
            style={{
              background: 'none',
              border: 'none',
              color: isShuffle ? 'var(--primary-green-bright)' : 'var(--text-subdued)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Shuffle size={18} />
            {isShuffle && (
              <span style={{
                position: 'absolute',
                bottom: '-6px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-green-bright)'
              }} />
            )}
          </button>

          {/* Previous */}
          <button
            onClick={prevTrack}
            title="Previous"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-subdued)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-subdued)'}
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          {/* Master Play/Pause */}
          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            className="play-btn-circle"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: 'none',
              color: '#000000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
            }}
          >
            {isPlaying ? (
              <Pause size={18} fill="#000000" />
            ) : (
              <Play size={18} fill="#000000" style={{ marginLeft: '2px' }} />
            )}
          </button>

          {/* Next */}
          <button
            onClick={nextTrack}
            title="Next"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-subdued)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-subdued)'}
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            title={`Repeat: ${repeatMode}`}
            style={{
              background: 'none',
              border: 'none',
              color: repeatMode !== 'off' ? 'var(--primary-green-bright)' : 'var(--text-subdued)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            {repeatMode !== 'off' && (
              <span style={{
                position: 'absolute',
                bottom: '-6px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-green-bright)'
              }} />
            )}
          </button>
        </div>

        {/* Timeline Scrubber Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-subdued)', minWidth: '35px', textAlign: 'right' }}>
            {formatTime(currentTime)}
          </span>

          <div
            className="range-container"
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {/* Filled progress bar background indicator */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                height: '4px',
                borderRadius: '2px',
                width: `${progressPercent}%`,
                backgroundColor: 'var(--primary-green-bright)',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.5"
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              aria-label="Seek track"
            />
          </div>

          <span style={{ fontSize: '11px', color: 'var(--text-subdued)', minWidth: '35px' }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 3. Right Section: Utilities & Volume */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '16px'
      }}>
        {/* Lyrics Button */}
        <button
          onClick={() => setShowLyrics(prev => !prev)}
          title="Lyrics"
          style={{
            background: 'none',
            border: 'none',
            color: showLyrics ? 'var(--primary-green-bright)' : 'var(--text-subdued)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            transition: 'color 0.15s, transform 0.15s'
          }}
          onMouseEnter={(e) => {
            if (!showLyrics) e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            if (!showLyrics) e.currentTarget.style.color = 'var(--text-subdued)';
          }}
        >
          <Mic2 size={18} />
        </button>

        {/* Queue Button */}
        <button
          onClick={() => setShowQueue(prev => !prev)}
          title="Queue"
          style={{
            background: 'none',
            border: 'none',
            color: showQueue ? 'var(--primary-green-bright)' : 'var(--text-subdued)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            transition: 'color 0.15s, transform 0.15s'
          }}
          onMouseEnter={(e) => {
            if (!showQueue) e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            if (!showQueue) e.currentTarget.style.color = 'var(--text-subdued)';
          }}
        >
          <ListMusic size={19} />
        </button>

        {/* Volume Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '130px' }}>
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            style={{
              background: 'none',
              border: 'none',
              color: isMuted ? 'var(--primary-green-bright)' : 'var(--text-subdued)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
            onMouseEnter={(e) => {
              if (!isMuted) e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              if (!isMuted) e.currentTarget.style.color = 'var(--text-subdued)';
            }}
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={18} />
            ) : volume < 0.5 ? (
              <Volume1 size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>

          <div
            className="range-container"
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                height: '4px',
                borderRadius: '2px',
                width: `${volumePercent}%`,
                backgroundColor: isMuted ? '#6a6a6a' : 'var(--primary-green-bright)',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={currentVolume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
