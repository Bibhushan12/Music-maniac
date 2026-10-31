import React from 'react';
import { Play, Pause, Heart, Search as SearchIcon } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';

export const SearchView = () => {
  const {
    songs,
    playlists,
    searchQuery,
    setSearchQuery,
    currentTrack,
    isPlaying,
    playTrack,
    navigateToPlaylist,
    toggleLike,
    isLiked,
    setSelectedGenre
  } = usePlayer();

  const genreCards = [
    { title: 'Synthwave', color: 'linear-gradient(135deg, #8a2387, #e94057, #f27121)', genre: 'Synthwave' },
    { title: 'Lo-Fi Beats', color: 'linear-gradient(135deg, #11998e, #38ef7d)', genre: 'Lo-Fi' },
    { title: 'Electronic', color: 'linear-gradient(135deg, #fc4a1a, #f7b733)', genre: 'Electronic' },
    { title: 'Ambient', color: 'linear-gradient(135deg, #00c6ff, #0072ff)', genre: 'Ambient' },
    { title: 'Pop Hits', color: 'linear-gradient(135deg, #ff0844, #ffb199)', genre: 'Pop' },
    { title: 'Rock Classics', color: 'linear-gradient(135deg, #654ea3, #eaafc8)', genre: 'Rock' },
    { title: 'Chillout', color: 'linear-gradient(135deg, #2c3e50, #4ca1af)', genre: 'Lo-Fi' },
    { title: 'Focus Flow', color: 'linear-gradient(135deg, #1f4037, #99f2c8)', genre: 'Ambient' },
  ];

  // Filter songs based on search
  const query = searchQuery.trim().toLowerCase();
  const matchedSongs = query
    ? songs.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.artist.toLowerCase().includes(query) ||
        s.album.toLowerCase().includes(query) ||
        s.genre.toLowerCase().includes(query)
      )
    : [];

  const matchedPlaylists = query
    ? playlists.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    : [];

  const topResult = matchedSongs[0] || null;

  return (
    <div style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      {/* If Search Query is present */}
      {query ? (
        matchedSongs.length > 0 || matchedPlaylists.length > 0 ? (
          <>
            {/* Top Result + Songs Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: topResult ? '2fr 3fr' : '1fr',
              gap: '24px'
            }}>
              {/* Top Result Box */}
              {topResult && (
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
                    Top result
                  </h2>
                  <div
                    onClick={() => playTrack(topResult, matchedSongs, 0)}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '8px',
                      padding: '24px',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      transition: 'background-color 0.25s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                      const btn = e.currentTarget.querySelector('.top-result-play');
                      if (btn) btn.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                      const btn = e.currentTarget.querySelector('.top-result-play');
                      if (btn) btn.style.opacity = '0';
                    }}
                  >
                    <img
                      src={topResult.cover}
                      alt={topResult.title}
                      style={{
                        width: '92px',
                        height: '92px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
                      }}
                    />
                    <div>
                      <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                        {topResult.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-subdued)' }}>
                        <span style={{ color: '#ffffff', fontWeight: 600 }}>{topResult.artist}</span>
                        <span>•</span>
                        <span style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          padding: '3px 10px',
                          borderRadius: '500px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#ffffff'
                        }}>
                          Song
                        </span>
                      </div>
                    </div>

                    {/* Green Play Button */}
                    <div
                      className="top-result-play play-btn-circle"
                      style={{
                        position: 'absolute',
                        bottom: '24px',
                        right: '24px',
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)',
                        opacity: currentTrack?.id === topResult.id && isPlaying ? 1 : 0,
                        transition: 'opacity 0.2s, transform 0.15s'
                      }}
                    >
                      {currentTrack?.id === topResult.id && isPlaying ? (
                        <Pause size={24} fill="#000" color="#000" />
                      ) : (
                        <Play size={24} fill="#000" color="#000" style={{ marginLeft: '3px' }} />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Matching Songs List */}
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
                  Songs
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {matchedSongs.slice(0, 4).map((track, idx) => {
                    const isCurrent = currentTrack?.id === track.id;
                    const isThisPlaying = isCurrent && isPlaying;
                    const liked = isLiked(track.id);

                    return (
                      <div
                        key={track.id}
                        className="track-row"
                        onClick={() => playTrack(track, matchedSongs, idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ position: 'relative', width: '42px', height: '42px', flexShrink: 0 }}>
                            <img
                              src={track.cover}
                              alt={track.title}
                              style={{ width: '100%', height: '100%', borderRadius: '4px', objectFit: 'cover' }}
                            />
                            {isThisPlaying && (
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px'
                              }}>
                                <div className="equalizer">
                                  <div className="eq-bar" />
                                  <div className="eq-bar" />
                                  <div className="eq-bar" />
                                  <div className="eq-bar" />
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: isCurrent ? 'var(--primary-green-bright)' : '#ffffff'
                            }}>
                              {track.title}
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-subdued)' }}>
                              {track.artist}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                          >
                            <Heart size={16} fill={liked ? 'var(--primary-green-bright)' : 'none'} />
                          </button>
                          <span style={{ fontSize: '13px', color: 'var(--text-subdued)' }}>
                            {track.durationFormatted}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Matching Playlists if any */}
            {matchedPlaylists.length > 0 && (
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
                  Playlists
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '20px'
                }}>
                  {matchedPlaylists.map(pl => (
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
                        gap: '12px'
                      }}
                    >
                      <img
                        src={pl.cover}
                        alt={pl.name}
                        style={{
                          width: '100%',
                          aspectRatio: '1/1',
                          borderRadius: '6px',
                          objectFit: 'cover'
                        }}
                      />
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }} className="line-clamp-1">
                        {pl.name}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-subdued)' }} className="line-clamp-2">
                        {pl.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 0',
            color: 'var(--text-subdued)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <SearchIcon size={48} strokeWidth={1.5} color="var(--text-muted)" />
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>
              No results found for "{searchQuery}"
            </h3>
            <p style={{ fontSize: '14px' }}>
              Please check your spelling or try searching for another artist, song, or genre.
            </p>
          </div>
        )
      ) : (
        /* Empty Query: Browse All Categories */
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '20px' }}>
            Browse all
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px'
          }}>
            {genreCards.map(card => (
              <div
                key={card.title}
                onClick={() => {
                  setSelectedGenre(card.genre);
                  setSearchQuery(card.title);
                }}
                style={{
                  background: card.color,
                  height: '180px',
                  borderRadius: '10px',
                  padding: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                  transition: 'transform 0.2s cubic-bezier(0.3, 0, 0, 1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                  lineHeight: '1.2'
                }}>
                  {card.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
