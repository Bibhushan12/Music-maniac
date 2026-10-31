import React from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { usePlayer } from './context/usePlayer';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { PlayerBar } from './components/PlayerBar';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { PlaylistView } from './components/PlaylistView';
import { LikedSongsView } from './components/LikedSongsView';
import { LyricsPanel } from './components/LyricsPanel';
import { QueuePanel } from './components/QueuePanel';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';

const MainContent = () => {
  const { currentView } = usePlayer();

  return (
    <div style={{
      display: 'flex',
      flex: 1,
      height: 'calc(100vh - var(--player-height))',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 1. Left Sidebar */}
      <Sidebar />

      {/* 2. Scrollable Center Main View */}
      <main style={{
        flex: 1,
        backgroundColor: 'var(--bg-base)',
        borderRadius: '8px',
        margin: '8px 8px 8px 0',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        position: 'relative',
        minWidth: 0
      }}>
        {/* Top Navbar */}
        <TopNav />

        {/* Dynamic Route View */}
        <div style={{ flex: 1, paddingBottom: '32px' }}>
          {currentView === 'home' && <HomeView />}
          {currentView === 'search' && <SearchView />}
          {currentView === 'playlist' && <PlaylistView />}
          {currentView === 'liked' && <LikedSongsView />}
        </div>
      </main>

      {/* 3. Optional Right Panels: Lyrics or Queue */}
      <LyricsPanel />
      <QueuePanel />
    </div>
  );
};

export default function App() {
  return (
    <PlayerProvider>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-black)',
        overflow: 'hidden'
      }}>
        <MainContent />
        <PlayerBar />

        {/* Global Modals */}
        <CreatePlaylistModal />
        <AddToPlaylistModal />
      </div>
    </PlayerProvider>
  );
}
