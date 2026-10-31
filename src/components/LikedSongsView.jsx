import React from 'react';
import { Play, Pause, Heart, Clock, PlusCircle } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';

export const LikedSongsView = () => {
  const {
    songs,
    likedIds,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    toggleLike,
    setShowAddToPlaylistModal,
    setTrackForPlaylist,
    navigateToHome
  } = usePlayer();

  // Resolve liked tracks
  const likedTracks = songs.filter(s => likedIds.has(s.id));
  const isLikedPlaying = isPlaying && likedTracks.some(t => t.id === currentTrack?.id);

  const totalSeconds = likedTracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 1. Hero Header */}
      <div style={{
        background: 'linear-gradient(180deg, #4b2382 0%, rgba(18, 18, 18, 0.95) 100%)',
        padding: '60px 32px 24px 32px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '24px'
      }}>
        <div style={{
          width: '232px',
          height: '232px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #450af5, #8e8ee5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
          flexShrink: 0
        }}>
          <Heart size={84} color="#ffffff" fill="#ffffff" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#ffffff'
          }}>
            Playlist
          </span>
          <h1 style={{
            fontSize: '56px',
            fontWeight: 900,
            letterSpacing: '-2px',
            color: '#ffffff',
            lineHeight: '1.1',
            margin: '4px 0 12px 0'
          }}>
            Liked Songs
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#ffffff',
            marginTop: '8px'
          }}>
            <span>Maniac</span>
            <span>•</span>
            <span>{likedTracks.length} {likedTracks.length === 1 ? 'song' : 'songs'}</span>
            {likedTracks.length > 0 && (
              <>
                <span>•</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>about {totalMinutes} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Controls */}
      <div style={{
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px'
      }}>
        {likedTracks.length > 0 && (
          <button
            onClick={() => {
              if (isLikedPlaying) {
                togglePlay();
              } else {
                playTrack(likedTracks[0], likedTracks, 0);
              }
            }}
            className="play-btn-circle"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-green)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)'
            }}
            title={isLikedPlaying ? 'Pause' : 'Play liked songs'}
          >
            {isLikedPlaying ? (
              <Pause size={24} fill="#000000" color="#000000" />
            ) : (
              <Play size={24} fill="#000000" color="#000000" style={{ marginLeft: '4px' }} />
            )}
          </button>
        )}
      </div>

      {/* 3. Tracklist */}
      <div style={{ padding: '0 32px 32px 32px' }}>
        {likedTracks.length === 0 ? (
          <div style={{
            padding: '48px 0',
            textAlign: 'center',
            color: 'var(--text-subdued)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Heart size={48} strokeWidth={1.5} color="var(--text-muted)" />
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>Songs you like will appear here</h3>
            <p style={{ fontSize: '14px' }}>Save songs by tapping the heart icon on any track.</p>
            <button
              onClick={navigateToHome}
              style={{
                marginTop: '12px',
                padding: '10px 24px',
                borderRadius: '500px',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Find songs
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 4fr 3fr 100px',
              padding: '8px 16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-subdued)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              <span>#</span>
              <span>Title</span>
              <span>Album</span>
              <span style={{ textAlign: 'right' }}><Clock size={16} style={{ verticalAlign: 'middle' }} /></span>
            </div>

            {/* Table Rows */}
            {likedTracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              const isThisPlaying = isCurrent && isPlaying;

              return (
                <div
                  key={track.id}
                  className={`track-row ${isCurrent ? 'active' : ''}`}
                  onClick={() => playTrack(track, likedTracks, idx)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 4fr 3fr 100px',
                    padding: '10px 16px',
                    alignItems: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: isCurrent ? 'var(--primary-green-bright)' : 'var(--text-base)'
                  }}
                >
                  {/* Index / Play / Equalizer */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isThisPlaying ? (
                      <div className="equalizer">
                        <div className="eq-bar" />
                        <div className="eq-bar" />
                        <div className="eq-bar" />
                        <div className="eq-bar" />
                      </div>
                    ) : (
                      <>
                        <span className="row-index" style={{ color: 'var(--text-subdued)' }}>
                          {idx + 1}
                        </span>
                        <span className="row-play-btn">
                          <Play size={14} fill="#ffffff" color="#ffffff" />
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title & Artist */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <img
                      src={track.cover}
                      alt={track.title}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '4px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                      <span style={{
                        fontWeight: 600,
                        color: isCurrent ? 'var(--primary-green-bright)' : '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {track.title}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: 'var(--text-subdued)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {track.artist}
                      </span>
                    </div>
                  </div>

                  {/* Album */}
                  <div style={{
                    color: 'var(--text-subdued)',
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    paddingRight: '12px'
                  }}>
                    {track.album}
                  </div>

                  {/* Duration & Like Button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '12px'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-green-bright)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Unlike"
                    >
                      <Heart size={16} fill="var(--primary-green-bright)" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTrackForPlaylist(track);
                        setShowAddToPlaylistModal(true);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-subdued)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Add to playlist"
                    >
                      <PlusCircle size={16} />
                    </button>

                    <span style={{ color: 'var(--text-subdued)', fontSize: '13px', minWidth: '35px', textAlign: 'right' }}>
                      {track.durationFormatted}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
