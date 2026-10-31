import React from 'react';
import { X, Plus, Check } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';

export const AddToPlaylistModal = () => {
  const {
    showAddToPlaylistModal,
    setShowAddToPlaylistModal,
    trackForPlaylist,
    setTrackForPlaylist,
    userPlaylists,
    addTrackToPlaylist,
    setShowCreatePlaylistModal
  } = usePlayer();

  if (!showAddToPlaylistModal || !trackForPlaylist) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}
    onClick={() => {
      setShowAddToPlaylistModal(false);
      setTrackForPlaylist(null);
    }}
    >
      <div
        style={{
          backgroundColor: '#282828',
          borderRadius: '8px',
          padding: '24px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>Add to playlist</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-subdued)', marginTop: '2px' }}>
              Select a playlist for "{trackForPlaylist.title}"
            </p>
          </div>
          <button
            onClick={() => {
              setShowAddToPlaylistModal(false);
              setTrackForPlaylist(null);
            }}
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

        {/* Create New Playlist option button */}
        <button
          onClick={() => {
            setShowAddToPlaylistModal(false);
            setShowCreatePlaylistModal(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background-color 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Plus size={20} />
          </div>
          <span>New playlist</span>
        </button>

        {/* Existing User Playlists List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          maxHeight: '260px',
          overflowY: 'auto',
          paddingRight: '4px'
        }}>
          {userPlaylists.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-subdued)', padding: '12px 0', textAlign: 'center' }}>
              No custom playlists created yet.
            </p>
          ) : (
            userPlaylists.map(playlist => {
              const alreadyIn = playlist.trackIds?.includes(trackForPlaylist.id);

              return (
                <div
                  key={playlist.id}
                  onClick={() => {
                    if (!alreadyIn) {
                      addTrackToPlaylist(playlist.id, trackForPlaylist.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: alreadyIn ? 'default' : 'pointer',
                    backgroundColor: 'transparent',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    if (!alreadyIn) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (!alreadyIn) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <img
                      src={playlist.cover}
                      alt={playlist.name}
                      style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }} className="line-clamp-1">
                        {playlist.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-subdued)' }}>
                        {playlist.trackIds?.length || 0} songs
                      </div>
                    </div>
                  </div>

                  {alreadyIn ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--primary-green-bright)' }}>
                      <Check size={16} /> Added
                    </span>
                  ) : (
                    <button
                      style={{
                        padding: '6px 14px',
                        borderRadius: '500px',
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
