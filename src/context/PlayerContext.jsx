import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { PlayerContext } from './PlayerContextInstance';

export const PlayerProvider = ({ children }) => {
  // Navigation & View state
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'search' | 'playlist' | 'liked'
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Playback state
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'

  // Queue state
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  // App Data
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Panels & Modals
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [trackForPlaylist, setTrackForPlaylist] = useState(null);

  // Initial Load from Backend API
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [songsData, playlistsData, userPlaylistsData, genresData, likedData] = await Promise.all([
          api.getSongs(),
          api.getPlaylists(),
          api.getUserPlaylists(),
          api.getGenres(),
          api.getLikedSongs()
        ]);

        if (!isMounted) return;

        setSongs(songsData || []);
        setPlaylists(playlistsData || []);
        setUserPlaylists(userPlaylistsData || []);
        setGenres(genresData || []);
        setLikedIds(new Set(likedData.ids || []));

        // Default initial track
        if (songsData && songsData.length > 0) {
          setCurrentTrack(songsData[0]);
          setQueue(songsData);
          setQueueIndex(0);
        }
      } catch (err) {
        console.error('Failed to load initial data from backend:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Play / Pause Track Function
  const playTrack = (track, newQueue = null, startIndex = -1) => {
    if (!track) return;

    if (newQueue) {
      setQueue(newQueue);
      const idx = startIndex >= 0 ? startIndex : newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    }

    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    setCurrentTrack(track);
    const audio = audioRef.current;
    audio.src = track.audioUrl;
    audio.currentTime = 0;
    setCurrentTime(0);

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.warn('Playback error:', err);
      setIsPlaying(false);
    });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentTrack) {
      if (songs.length > 0) {
        playTrack(songs[0], songs, 0);
      }
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.warn('Play error:', err));
    }
  };

  const seek = (time) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeVolume = (newVol) => {
    const vol = Math.max(0, Math.min(1, newVol));
    setVolume(vol);
    if (vol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume || 0.5);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
    }
  };

  // Next / Previous Track
  const nextTrack = () => {
    if (queue.length === 0) return;

    if (isShuffle) {
      const randIdx = Math.floor(Math.random() * queue.length);
      setQueueIndex(randIdx);
      playTrack(queue[randIdx]);
      return;
    }

    const nextIdx = (queueIndex + 1) % queue.length;
    setQueueIndex(nextIdx);
    playTrack(queue[nextIdx]);
  };

  const prevTrack = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (queue.length === 0) return;
    const prevIdx = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIdx);
    playTrack(queue[prevIdx]);
  };

  const handleNextTrackAuto = () => {
    if (repeatMode === 'one') {
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play();
      return;
    }

    if (repeatMode === 'off' && queueIndex === queue.length - 1 && !isShuffle) {
      setIsPlaying(false);
      return;
    }

    nextTrack();
  };

  // Ref to hold latest auto-advance callback
  const autoNextRef = useRef(handleNextTrackAuto);
  useEffect(() => {
    autoNextRef.current = handleNextTrackAuto;
  });

  // Audio Event Listeners setup
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentTrack?.duration || 0);
    };

    const handleEnded = () => {
      autoNextRef.current?.();
    };

    const handleError = (e) => {
      console.warn('Audio playback error or source unavailable:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack]);

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  // Likes handling
  const toggleLike = async (trackId) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });

    try {
      const res = await api.toggleLike(trackId);
      if (res && res.likedIds) {
        setLikedIds(new Set(res.likedIds));
      }
    } catch (err) {
      console.error('Failed to toggle like on server:', err);
    }
  };

  const isLiked = (trackId) => likedIds.has(trackId);

  // Custom Playlists Handling
  const createPlaylist = async (name, description) => {
    try {
      const created = await api.createUserPlaylist(name, description);
      setUserPlaylists(prev => [created, ...prev]);
      setShowCreatePlaylistModal(false);
      navigateToPlaylist(created.id);
      return created;
    } catch (err) {
      console.error('Failed to create playlist:', err);
    }
  };

  const addTrackToPlaylist = async (playlistId, trackId) => {
    try {
      const updated = await api.addTrackToPlaylist(playlistId, trackId);
      setUserPlaylists(prev => prev.map(p => p.id === playlistId ? updated : p));
      setShowAddToPlaylistModal(false);
      setTrackForPlaylist(null);
    } catch (err) {
      console.error('Failed to add track to playlist:', err);
    }
  };

  const removeTrackFromPlaylist = async (playlistId, trackId) => {
    try {
      const updated = await api.removeTrackFromPlaylist(playlistId, trackId);
      setUserPlaylists(prev => prev.map(p => p.id === playlistId ? updated : p));
    } catch (err) {
      console.error('Failed to remove track:', err);
    }
  };

  // Navigation helpers
  const navigateToHome = () => {
    setCurrentView('home');
    setSelectedPlaylistId(null);
  };

  const navigateToSearch = (genre = 'All') => {
    setCurrentView('search');
    setSelectedGenre(genre);
    setSelectedPlaylistId(null);
  };

  const navigateToPlaylist = (id) => {
    setSelectedPlaylistId(id);
    setCurrentView('playlist');
  };

  const navigateToLiked = () => {
    setCurrentView('liked');
    setSelectedPlaylistId(null);
  };

  // Keyboard shortcut actions ref
  const actionsRef = useRef({ togglePlay, toggleMute, nextTrack, prevTrack });
  useEffect(() => {
    actionsRef.current = { togglePlay, toggleMute, nextTrack, prevTrack };
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        actionsRef.current.togglePlay();
      } else if (e.code === 'KeyM') {
        actionsRef.current.toggleMute();
      } else if (e.code === 'ArrowRight' && e.shiftKey) {
        actionsRef.current.nextTrack();
      } else if (e.code === 'ArrowLeft' && e.shiftKey) {
        actionsRef.current.prevTrack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = {
    currentView,
    selectedPlaylistId,
    selectedGenre,
    searchQuery,
    setSearchQuery,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    queueIndex,
    songs,
    playlists,
    userPlaylists,
    genres,
    likedIds,
    loading,
    showLyrics,
    showQueue,
    showCreatePlaylistModal,
    showAddToPlaylistModal,
    trackForPlaylist,

    setShowLyrics,
    setShowQueue,
    setShowCreatePlaylistModal,
    setShowAddToPlaylistModal,
    setTrackForPlaylist,
    setSelectedGenre,

    playTrack,
    togglePlay,
    seek,
    changeVolume,
    toggleMute,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    createPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,

    navigateToHome,
    navigateToSearch,
    navigateToPlaylist,
    navigateToLiked,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
