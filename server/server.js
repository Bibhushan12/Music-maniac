import express from 'express';
import cors from 'cors';
import { songs, playlists, genres } from './data/songs.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory user data store
let userLikedSongIds = new Set(["track-1", "track-3"]);
let userPlaylists = [
  {
    id: "user-pl-1",
    name: "My Chill Vibes",
    description: "Personal favorites for relaxing and chilling",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    trackIds: ["track-2", "track-4"],
    curator: "You",
    createdAt: new Date().toISOString()
  }
];

// Helper: resolve tracks array from IDs
const resolveTracks = (trackIds) => {
  return trackIds
    .map(id => songs.find(s => s.id === id))
    .filter(Boolean);
};

// 1. Get all songs with optional filters
app.get('/api/songs', (req, res) => {
  const { genre, search } = req.query;
  let result = [...songs];

  if (genre && genre.toLowerCase() !== 'all') {
    result = result.filter(s => s.genre.toLowerCase() === genre.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: result.length,
    data: result
  });
});

// 2. Get single song
app.get('/api/songs/:id', (req, res) => {
  const song = songs.find(s => s.id === req.params.id);
  if (!song) {
    return res.status(404).json({ success: false, message: 'Song not found' });
  }
  res.json({ success: true, data: song });
});

// 3. Get all curated playlists
app.get('/api/playlists', (req, res) => {
  const populated = playlists.map(pl => ({
    ...pl,
    tracks: resolveTracks(pl.trackIds),
    trackCount: pl.trackIds.length
  }));
  res.json({ success: true, data: populated });
});

// 4. Get single playlist
app.get('/api/playlists/:id', (req, res) => {
  // Check curated playlists
  let pl = playlists.find(p => p.id === req.params.id);
  if (pl) {
    return res.json({
      success: true,
      data: {
        ...pl,
        tracks: resolveTracks(pl.trackIds),
        trackCount: pl.trackIds.length
      }
    });
  }

  // Check user playlists
  pl = userPlaylists.find(p => p.id === req.params.id);
  if (pl) {
    return res.json({
      success: true,
      data: {
        ...pl,
        tracks: resolveTracks(pl.trackIds),
        trackCount: pl.trackIds.length
      }
    });
  }

  res.status(404).json({ success: false, message: 'Playlist not found' });
});

// 5. Get genres
app.get('/api/genres', (req, res) => {
  res.json({ success: true, data: genres });
});

// 6. Search across songs, artists, and playlists
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  if (!q) {
    return res.json({
      success: true,
      data: { songs: [], playlists: [] }
    });
  }

  const matchedSongs = songs.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.artist.toLowerCase().includes(q) ||
    s.album.toLowerCase().includes(q) ||
    s.genre.toLowerCase().includes(q)
  );

  const matchedPlaylists = [...playlists, ...userPlaylists].filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.description && p.description.toLowerCase().includes(q))
  ).map(pl => ({
    ...pl,
    tracks: resolveTracks(pl.trackIds),
    trackCount: pl.trackIds.length
  }));

  res.json({
    success: true,
    query: q,
    data: {
      songs: matchedSongs,
      playlists: matchedPlaylists
    }
  });
});

// 7. Liked songs API
app.get('/api/user/liked', (req, res) => {
  const likedTracks = songs.filter(s => userLikedSongIds.has(s.id));
  res.json({
    success: true,
    ids: Array.from(userLikedSongIds),
    tracks: likedTracks
  });
});

app.post('/api/user/liked/toggle', (req, res) => {
  const { trackId } = req.body;
  if (!trackId) {
    return res.status(400).json({ success: false, message: 'trackId is required' });
  }

  const isLiked = userLikedSongIds.has(trackId);
  if (isLiked) {
    userLikedSongIds.delete(trackId);
  } else {
    userLikedSongIds.add(trackId);
  }

  res.json({
    success: true,
    isLiked: !isLiked,
    likedIds: Array.from(userLikedSongIds)
  });
});

// 8. User custom playlists API
app.get('/api/user/playlists', (req, res) => {
  const populated = userPlaylists.map(pl => ({
    ...pl,
    tracks: resolveTracks(pl.trackIds),
    trackCount: pl.trackIds.length
  }));
  res.json({ success: true, data: populated });
});

app.post('/api/user/playlists', (req, res) => {
  const { name, description } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Playlist name is required' });
  }

  const newPlaylist = {
    id: `user-pl-${Date.now()}`,
    name: name.trim(),
    description: description ? description.trim() : 'Created with Music maniac',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    trackIds: [],
    curator: 'You',
    createdAt: new Date().toISOString()
  };

  userPlaylists.unshift(newPlaylist);
  res.status(201).json({
    success: true,
    data: {
      ...newPlaylist,
      tracks: [],
      trackCount: 0
    }
  });
});

app.post('/api/user/playlists/:id/tracks', (req, res) => {
  const { trackId } = req.body;
  const pl = userPlaylists.find(p => p.id === req.params.id);
  if (!pl) {
    return res.status(404).json({ success: false, message: 'Playlist not found' });
  }

  if (!trackId) {
    return res.status(400).json({ success: false, message: 'trackId is required' });
  }

  if (!pl.trackIds.includes(trackId)) {
    pl.trackIds.push(trackId);
  }

  res.json({
    success: true,
    data: {
      ...pl,
      tracks: resolveTracks(pl.trackIds),
      trackCount: pl.trackIds.length
    }
  });
});

app.delete('/api/user/playlists/:id/tracks/:trackId', (req, res) => {
  const pl = userPlaylists.find(p => p.id === req.params.id);
  if (!pl) {
    return res.status(404).json({ success: false, message: 'Playlist not found' });
  }

  pl.trackIds = pl.trackIds.filter(id => id !== req.params.trackId);
  res.json({
    success: true,
    data: {
      ...pl,
      tracks: resolveTracks(pl.trackIds),
      trackCount: pl.trackIds.length
    }
  });
});

app.delete('/api/user/playlists/:id', (req, res) => {
  const index = userPlaylists.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Playlist not found' });
  }

  userPlaylists.splice(index, 1);
  res.json({ success: true, message: 'Playlist deleted' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Music maniac Backend', time: new Date() });
});

app.listen(PORT, () => {
  console.log(`🎵 Music maniac API server running on http://localhost:${PORT}`);
});
