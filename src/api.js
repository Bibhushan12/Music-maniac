// Frontend API client to communicate with Node/Express backend

const API_BASE = '/api';

export const api = {
  // Songs
  async getSongs(genre = '', search = '') {
    const params = new URLSearchParams();
    if (genre && genre !== 'All') params.append('genre', genre);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/songs?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch songs');
    const json = await res.json();
    return json.data;
  },

  async getSongById(id) {
    const res = await fetch(`${API_BASE}/songs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch song');
    const json = await res.json();
    return json.data;
  },

  // Playlists
  async getPlaylists() {
    const res = await fetch(`${API_BASE}/playlists`);
    if (!res.ok) throw new Error('Failed to fetch playlists');
    const json = await res.json();
    return json.data;
  },

  async getPlaylistById(id) {
    const res = await fetch(`${API_BASE}/playlists/${id}`);
    if (!res.ok) throw new Error('Failed to fetch playlist');
    const json = await res.json();
    return json.data;
  },

  // Genres
  async getGenres() {
    const res = await fetch(`${API_BASE}/genres`);
    if (!res.ok) throw new Error('Failed to fetch genres');
    const json = await res.json();
    return json.data;
  },

  // Search
  async search(query) {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search');
    const json = await res.json();
    return json.data;
  },

  // Liked songs
  async getLikedSongs() {
    const res = await fetch(`${API_BASE}/user/liked`);
    if (!res.ok) throw new Error('Failed to fetch liked songs');
    const json = await res.json();
    return json;
  },

  async toggleLike(trackId) {
    const res = await fetch(`${API_BASE}/user/liked/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackId })
    });
    if (!res.ok) throw new Error('Failed to toggle like');
    return await res.json();
  },

  // User playlists
  async getUserPlaylists() {
    const res = await fetch(`${API_BASE}/user/playlists`);
    if (!res.ok) throw new Error('Failed to fetch user playlists');
    const json = await res.json();
    return json.data;
  },

  async createUserPlaylist(name, description) {
    const res = await fetch(`${API_BASE}/user/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    if (!res.ok) throw new Error('Failed to create playlist');
    const json = await res.json();
    return json.data;
  },

  async addTrackToPlaylist(playlistId, trackId) {
    const res = await fetch(`${API_BASE}/user/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackId })
    });
    if (!res.ok) throw new Error('Failed to add track to playlist');
    const json = await res.json();
    return json.data;
  },

  async removeTrackFromPlaylist(playlistId, trackId) {
    const res = await fetch(`${API_BASE}/user/playlists/${playlistId}/tracks/${trackId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to remove track');
    const json = await res.json();
    return json.data;
  },

  async deleteUserPlaylist(playlistId) {
    const res = await fetch(`${API_BASE}/user/playlists/${playlistId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete playlist');
    return await res.json();
  }
};
