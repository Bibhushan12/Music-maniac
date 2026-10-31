import React from 'react';
import { Play, Pause, Heart, Clock, PlusCircle } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';

export const HomeView = () => {
  const {
    songs,
    playlists,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    navigateToPlaylist,
    toggleLike,
    isLiked,
    setShowAddToPlaylistModal,
    setTrackForPlaylist,
    selectedGenre
  } = usePlayer();

  // Dynamic greeting initialized once
  const [greeting] = React.useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  // Filter songs if genre is active
  const filteredSongs = selectedGenre === 'All'
    ? songs
    : songs.filter(s => s.genre.toLowerCase() === selectedGenre.toLowerCase());

  // Quick picks (first 6 items)
  const quickPicks = songs.slice(0, 6);

  return (
    <div style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      {/* 1. Header Greeting */}
      <div>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-1px',
          marginBottom: '20px'
        }}>
          {greeting}
        </h1>

        {/* Quick Picks 2x3 or 3x2 Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px'
        }}>
          {quickPicks.map(track => {
            const isCurrent = currentTrack?.id === track.id;
            const isThisPlaying = isCurrent && isPlaying;

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, songs)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.2s',
                  height: '64px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  const btn = e.currentTarget.querySelector('.quick-play-btn');
                  if (btn) btn.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  const btn = e.currentTarget.querySelector('.quick-play-btn');
                  if (btn) btn.style.opacity = '0';
                }}
              >
                <img
                  src={track.cover}
                  alt={track.title}
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <div style={{
                  padding: '0 16px',
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: isCurrent ? 'var(--primary-green-bright)' : '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {track.title}
                  </span>

                  {/* Hover Play Button */}
                  <div
                    className="quick-play-btn play-btn-circle"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                      opacity: isThisPlaying ? 1 : 0,
                      transition: 'opacity 0.2s, transform 0.15s',
                      flexShrink: 0
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrent) {
                        togglePlay();
                      } else {
                        playTrack(track, songs);
                      }
                    }}
                  >
                    {isThisPlaying ? (
                      <Pause size={18} fill="#000000" color="#000000" />
                    ) : (
                      <Play size={18} fill="#000000" color="#000000" style={{ marginLeft: '2px' }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Featured Playlists Section */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px' }}>
            Featured Playlists
          </h2>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-subdued)', cursor: 'pointer' }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Show all
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '20px'
        }}>
          {playlists.map(pl => (
            <div
              key={pl.id}
              className="spotify-card"
              onClick={() => navigateToPlaylist(pl.id)}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative'
              }}
            >
              <div style={{ position: 'relative', width: '100%', paddingBottom: '100%', borderRadius: '6px', overflow: 'hidden' }}>
                <img
                  src={pl.cover}
                  alt={pl.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
                  }}
                />
                {/* Floating Play Button */}
                <div
                  className="hover-play play-btn-circle"
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.6)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pl.tracks && pl.tracks.length > 0) {
                      playTrack(pl.tracks[0], pl.tracks);
                    }
                  }}
                >
                  <Play size={22} fill="#000000" color="#000000" style={{ marginLeft: '3px' }} />
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '6px'
                }} className="line-clamp-1">
                  {pl.name}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-subdued)',
                  lineHeight: '1.4'
                }} className="line-clamp-2">
                  {pl.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Trending Tracks Section */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px' }}>
            {selectedGenre === 'All' ? 'Popular on Music maniac' : `${selectedGenre} Hits`}
          </h2>
        </div>

        {/* Tracks Table */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
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
          {filteredSongs.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            const isThisPlaying = isCurrent && isPlaying;
            const liked = isLiked(track.id);

            return (
              <div
                key={track.id}
                className={`track-row ${isCurrent ? 'active' : ''}`}
                onClick={() => playTrack(track, filteredSongs, idx)}
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
                <div style={{
                  color: 'var(--text-subdued)',
                  fontSize: '13px'
                }}>
                  {track.plays}
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
                      color: liked ? 'var(--primary-green-bright)' : 'var(--text-subdued)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={liked ? 'Unlike' : 'Like'}
                  >
                    <Heart size={16} fill={liked ? 'var(--primary-green-bright)' : 'none'} />
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
      </div>
    </div>
  );
};
