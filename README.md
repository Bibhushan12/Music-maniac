# 🎵 Music maniac — Spotify Clone Web Player

A full-stack, responsive Spotify clone built with a **React** frontend and a **Node.js / Express** backend, featuring real audio streaming playback, animated equalizers, full player controls, playlist management, instant search, and dynamic themes.

---

## 🚀 Features

### 🎧 Web Player Experience
- **Real Audio Playback**: Working HTML5 Audio streaming with royalty-free tracks across Synthwave, Lo-Fi, Electronic, Ambient, Pop, and Rock.
- **Full Player Controls**: Play / Pause, Next, Previous, Shuffle, and 3-mode Repeat (Off, All, Repeat-1).
- **Timeline & Seek Bar**: Interactive scrubber with real-time timestamps, smooth seek drag, and hover glow.
- **Volume & Mute**: Volume slider with dynamic volume icons (`Volume2`, `Volume1`, `VolumeX`) and one-click mute/unmute.
- **Animated Equalizers**: Live bouncing equalizer bars on currently playing songs in lists, tables, and player cards.

### 🧭 Navigation & Views
- **Sidebar**:
  - Music maniac branding with glowing disc icon.
  - Quick navigation (Home, Search, Your Library).
  - Quick-access **Liked Songs** tile with purple gradient and track counter.
  - Scrollable list of curated playlists and custom user-created playlists.
- **Top Bar**:
  - Time-based dynamic greeting (*"Good morning"*, *"Good afternoon"*, *"Good evening"*).
  - Back/Forward navigation controls.
  - Real-time search input with instant results.
  - Genre quick-filter chips (*All*, *Synthwave*, *Lo-Fi*, *Electronic*).
- **Home View**:
  - Quick-access 6-item play grid with hover play buttons.
  - Featured Playlists showcase cards.
  - Popular tracks table with plays counter, duration, and like toggles.
- **Search View**:
  - Real-time instant search across songs, artists, albums, and playlists.
  - Spotlight "Top Result" card with one-click play.
  - Browse All colored genre category cards.
- **Playlist View**:
  - Dynamic ambient header gradient matching playlist artwork.
  - Big master green play button.
  - Track list table with album, duration, and quick-add actions.
- **Liked Songs View**:
  - Special Indigo-to-Black gradient header with heart artwork.
  - Saved tracks collection synced with backend.
- **Side Panels**:
  - **Lyrics Drawer**: Synchronized karaoke-style lyric lines.
  - **Queue Drawer**: Now playing view with upcoming tracks in order.
- **Modals**:
  - **Create Playlist Modal**: Name and describe custom playlists.
  - **Add to Playlist Modal**: One-click addition of any song to user playlists.

### ⌨️ Keyboard Shortcuts
- `Space`: Play / Pause toggle
- `M`: Mute / Unmute audio
- `Shift + →`: Next track
- `Shift + ←`: Previous track

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19
  - Vite 8
  - Lucide React (Spotify aesthetic iconography)
  - Pure Modern CSS with CSS variables, Glassmorphism, and responsive CSS Grid/Flexbox
- **Backend**:
  - Node.js (v24+)
  - Express
  - CORS
  - RESTful API endpoints for songs, playlists, search, and user state

---

## 🏃 Running the Application

### 1. Run Both Backend & Frontend Together (Recommended)
```bash
npm run dev
```
This runs the Node.js API server on `http://localhost:5001` and the Vite React frontend on `http://localhost:5173` concurrently.

### 2. Run Independently
- **Start Backend API only**:
  ```bash
  npm run dev:server
  ```
  *(Runs on http://localhost:5001)*

- **Start Frontend Vite client only**:
  ```bash
  npm run dev:client
  ```
  *(Runs on http://localhost:5173 with API proxy to port 5001)*

### 3. Build for Production
```bash
npm run build
```

### 4. Run Linter
```bash
npm run lint
```

---

## 📡 API Endpoints (Backend)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/songs` | Get all songs or filter with `?genre=...&search=...` |
| `GET` | `/api/songs/:id` | Get details of a single track |
| `GET` | `/api/playlists` | Get all curated playlists with resolved tracks |
| `GET` | `/api/playlists/:id` | Get single playlist details |
| `GET` | `/api/genres` | Get available music genres |
| `GET` | `/api/search?q=...` | Search songs and playlists |
| `GET` | `/api/user/liked` | Get list of liked songs |
| `POST` | `/api/user/liked/toggle` | Toggle like status of a song (`{ trackId }`) |
| `GET` | `/api/user/playlists` | Get user custom playlists |
| `POST` | `/api/user/playlists` | Create a new user playlist (`{ name, description }`) |
| `POST` | `/api/user/playlists/:id/tracks` | Add track to playlist (`{ trackId }`) |
| `DELETE` | `/api/user/playlists/:id/tracks/:trackId` | Remove track from playlist |
