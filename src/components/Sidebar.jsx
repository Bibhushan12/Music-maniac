import React from 'react';
import { Home, Search, Library, Plus, Heart, Disc } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';

export const Sidebar = () => {
  const {
    currentView,
    selectedPlaylistId,
    playlists,
    userPlaylists,
    likedIds,
    navigateToHome,
    navigateToSearch,
    navigateToPlaylist,
    navigateToLiked,
    setShowCreatePlaylistModal
  } = usePlayer();

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--bg-black)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '8px',
      height: 'calc(100vh - var(--player-height))',
      flexShrink: 0
    }}>
      {/* Top Box: Brand & Main Navigation */}
      <div style={{
        backgroundColor: 'var(--bg-base)',
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Brand / Logo */}
        <div 
          onClick={navigateToHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            paddingBottom: '4px'
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1db954, #1ed760)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(29, 185, 84, 0.4)'
          }}>
            <Disc size={22} color="#000" strokeWidth={2.4} />
          </div>
          <span style={{
            fontSize: '19px',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(90deg, #ffffff, #dcdcdc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            Music maniac
            <span style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-green-bright)'
            }} />
          </span>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <button
            onClick={navigateToHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'none',
              border: 'none',
              color: currentView === 'home' ? 'var(--text-base)' : 'var(--text-subdued)',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'color 0.2s',
              textAlign: 'left',
              padding: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => {
              if (currentView !== 'home') e.currentTarget.style.color = 'var(--text-subdued)';
            }}
          >
            <Home size={22} strokeWidth={currentView === 'home' ? 2.8 : 2} />
            Home
          </button>

          <button
            onClick={() => navigateToSearch()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'none',
              border: 'none',
              color: currentView === 'search' ? 'var(--text-base)' : 'var(--text-subdued)',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'color 0.2s',
              textAlign: 'left',
              padding: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => {
              if (currentView !== 'search') e.currentTarget.style.color = 'var(--text-subdued)';
            }}
          >
            <Search size={22} strokeWidth={currentView === 'search' ? 2.8 : 2} />
            Search
          </button>
        </nav>
      </div>

      {/* Bottom Box: Library & Playlists */}
      <div style={{
        backgroundColor: 'var(--bg-base)',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0
      }}>
        {/* Library Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'none',
            border: 'none',
            color: 'var(--text-subdued)',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-subdued)'}
          >
            <Library size={22} />
            Your Library
          </button>

          <button
            onClick={() => setShowCreatePlaylistModal(true)}
            title="Create playlist"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-subdued)',
              cursor: 'pointer',
              transition: 'background-color 0.2s, color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-highlight)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-subdued)';
            }}
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Liked Songs Entry */}
        <div
          onClick={navigateToLiked}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: currentView === 'liked' ? 'var(--bg-highlight)' : 'transparent',
            transition: 'background-color 0.2s',
            marginBottom: '8px'
          }}
          onMouseEnter={(e) => {
            if (currentView !== 'liked') e.currentTarget.style.backgroundColor = 'var(--bg-card)';
          }}
          onMouseLeave={(e) => {
            if (currentView !== 'liked') e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, #450af5, #8e8ee5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Heart size={20} color="#ffffff" fill="#ffffff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: currentView === 'liked' ? 'var(--primary-green-bright)' : '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Liked Songs
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-subdued)' }}>
              Playlist • {likedIds.size} {likedIds.size === 1 ? 'song' : 'songs'}
            </div>
          </div>
        </div>

        {/* Scrollable Playlists List */}
        <div style={{
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          paddingRight: '4px'
        }}>
          {/* User Playlists */}
          {userPlaylists.map(playlist => {
            const isActive = currentView === 'playlist' && selectedPlaylistId === playlist.id;
            return (
              <div
                key={playlist.id}
                onClick={() => navigateToPlaylist(playlist.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-highlight)' : 'transparent',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <img
                    src={playlist.cover}
                    alt={playlist.name}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '4px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: isActive ? 'var(--primary-green-bright)' : '#ffffff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {playlist.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-subdued)' }}>
                      Playlist • {playlist.trackIds?.length || 0} songs
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Curated Playlists */}
          {playlists.map(playlist => {
            const isActive = currentView === 'playlist' && selectedPlaylistId === playlist.id;
            return (
              <div
                key={playlist.id}
                onClick={() => navigateToPlaylist(playlist.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-highlight)' : 'transparent',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <img
                  src={playlist.cover}
                  alt={playlist.name}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '4px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: isActive ? 'var(--primary-green-bright)' : '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {playlist.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-subdued)' }}>
                    Playlist • {playlist.trackIds?.length || 0} songs
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
