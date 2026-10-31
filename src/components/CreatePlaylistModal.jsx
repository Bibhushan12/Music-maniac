import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';

export const CreatePlaylistModal = () => {
  const { showCreatePlaylistModal, setShowCreatePlaylistModal, createPlaylist } = usePlayer();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!showCreatePlaylistModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    await createPlaylist(name.trim(), description.trim());
    setSubmitting(false);
    setName('');
    setDescription('');
  };

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
    onClick={() => setShowCreatePlaylistModal(false)}
    >
      <div
        style={{
          backgroundColor: '#282828',
          borderRadius: '8px',
          padding: '24px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>Edit details</h2>
          <button
            onClick={() => setShowCreatePlaylistModal(false)}
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '6px' }}>
              Name
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="My Playlist"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid transparent',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ffffff'}
              onBlur={(e) => e.target.style.borderColor = 'transparent'}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Give your playlist a catchy description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid transparent',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ffffff'}
              onBlur={(e) => e.target.style.borderColor = 'transparent'}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => setShowCreatePlaylistModal(false)}
              style={{
                padding: '12px 24px',
                borderRadius: '500px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="play-btn-circle"
              style={{
                padding: '12px 32px',
                borderRadius: '500px',
                backgroundColor: '#ffffff',
                border: 'none',
                color: '#000000',
                fontSize: '14px',
                fontWeight: 700,
                cursor: submitting || !name.trim() ? 'not-allowed' : 'pointer',
                opacity: submitting || !name.trim() ? 0.6 : 1
              }}
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
