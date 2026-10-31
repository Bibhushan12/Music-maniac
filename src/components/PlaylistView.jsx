import React from 'react';
import { Play, Pause, Heart, Clock, Trash2, PlusCircle } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';

export const PlaylistView = () => {
  const {
    selectedPlaylistId,
    playlists,
    userPlaylists,
    songs,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    toggleLike,
    isLiked,
    removeTrackFromPlaylist,
    setShowAddToPlaylistModal,
    setTrackForPlaylist,
    navigateToHome
  } = usePlayer();

  // Find playlist from curated or user playlists
  const playlist = [...playlists, ...userPlaylists].find(p => p.id === selectedPlaylistId);
  const isUserPlaylist = userPlaylists.some(p => p.id === selectedPlaylistId);

  if (!playlist) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-subdued)' }}>
        <h2>Playlist not found</h2>
        <button
          onClick={navigateToHome}
          style={{
            marginTop: '16px',
            padding: '8px 24px',
            borderRadius: '500px',
            backgroundColor: '#ffffff',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Resolve tracks for this playlist
  const playlistTracks = (playlist.trackIds || [])
    .map(id => songs.find(s => s.id === id))
    .filter(Boolean);

  const isCurrentPlaylistPlaying = isPlaying && playlistTracks.some(t => t.id === currentTrack?.id);

  // Total duration calculation
  const totalSeconds = playlistTracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 1. Hero Header with Dynamic Gradient */}
      <div style={{
        background: `linear-gradient(180deg, ${playlist.accentColor || '#385170'} 0%, rgba(18, 18, 18, 0.95) 100%)`,
        padding: '60px 32px 24px 32px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '24px'
      }}>
        <img
          src={playlist.cover}
          alt={playlist.name}
          style={{
            width: '232px',
            height: '232px',
            borderRadius: '8px',
            objectFit: 'cover',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
            flexShrink: 0
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#ffffff'
          }}>
            {isUserPlaylist ? 'Custom Playlist' : 'Public Playlist'}
          </span>
          <h1 style={{
            fontSize: '56px',
            fontWeight: 900,
            letterSpacing: '-2px',
            color: '#ffffff',
            lineHeight: '1.1',
            margin: '4px 0 12px 0'
          }}>
            {playlist.name}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', maxWidth: '600px' }}>
            {playlist.description}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#ffffff',
            marginTop: '8px'
          }}>
            <span>{playlist.curator || 'Music maniac'}</span>
            <span>•</span>
            <span>{playlistTracks.length} {playlistTracks.length === 1 ? 'song' : 'songs'}</span>
            {playlistTracks.length > 0 && (
              <>
                <span>•</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>about {totalMinutes} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Action Controls Bar */}
      <div style={{
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px'
      }}>
        {/* Big Master Play Button */}
        {playlistTracks.length > 0 && (
          <button
            onClick={() => {
              if (isCurrentPlaylistPlaying) {
                togglePlay();
              } else {
                playTrack(playlistTracks[0], playlistTracks, 0);
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
            title={isCurrentPlaylistPlaying ? 'Pause' : 'Play playlist'}
          >
            {isCurrentPlaylistPlaying ? (
              <Pause size={24} fill="#000000" color="#000000" />
            ) : (
              <Play size={24} fill="#000000" color="#000000" style={{ marginLeft: '4px' }} />
            )}
          </button>
        )}
      </div>

      {/* 3. Playlist Tracks Table */}
      <div style={{ padding: '0 32px 32px 32px' }}>
        {playlistTracks.length === 0 ? (
          <div style={{
            padding: '48px 0',
            textAlign: 'center',
            color: 'var(--text-subdued)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <p style={{ fontSize: '16px', fontWeight: 600 }}>This playlist is empty.</p>
            <p style={{ fontSize: '14px' }}>Browse songs or search to add music to this playlist!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 4fr 3fr 2fr 100px',
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
              <span>Plays</span>
              <span style={{ textAlign: 'right' }}><Clock size={16} style={{ verticalAlign: 'middle' }} /></span>
            </div>

            {/* Table Rows */}
            {playlistTracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              const isThisPlaying = isCurrent && isPlaying;
              const liked = isLiked(track.id);

              return (
                <div
                  key={track.id}
                  className={`track-row ${isCurrent ? 'active' : ''}`}
                  onClick={() => playTrack(track, playlistTracks, idx)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 4fr 3fr 2fr 100px',
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

                  {/* Plays */}
                  <div style={{ color: 'var(--text-subdued)', fontSize: '13px' }}>
                    {track.plays}
                  </div>

                  {/* Duration & Actions */}
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
                        color: liked ? 'var(--primary-green-bright)' : 'var(--text-subdued)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title={liked ? 'Unlike' : 'Like'}
                    >
                      <Heart size={16} fill={liked ? 'var(--primary-green-bright)' : 'none'} />
                    </button>

                    {isUserPlaylist ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTrackFromPlaylist(playlist.id, track.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-subdued)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Remove from this playlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
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
                        title="Add to another playlist"
                      >
                        <PlusCircle size={16} />
                      </button>
                    )}

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
