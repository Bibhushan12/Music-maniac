import React from 'react';
import { ChevronLeft, ChevronRight, Search, X, User } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';

export const TopNav = () => {
  const {
    currentView,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    navigateToHome,
    navigateToSearch
  } = usePlayer();

  return (
    <header style={{
      height: 'var(--topbar-height)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(18, 18, 18, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px'
    }}>
      {/* Left: Arrows & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '640px' }}>
        {/* Navigation arrows */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={navigateToHome}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            title="Go to Home"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'not-allowed'
            }}
            disabled
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Search Bar Input */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          maxWidth: '420px'
        }}>
          <Search
            size={18}
            color="#a7a7a7"
            style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}
          />
          <input
            type="text"
            placeholder="What do you want to play?"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentView !== 'search') {
                navigateToSearch();
              }
            }}
            onFocus={() => {
              if (currentView !== 'search') {
                navigateToSearch();
              }
            }}
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '500px',
              backgroundColor: '#242424',
              border: '1px solid transparent',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              padding: '0 40px 0 42px',
              outline: 'none',
              transition: 'border-color 0.2s, background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2a2a2a'}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.target) e.target.style.backgroundColor = '#242424';
            }}
            onFocusCapture={(e) => {
              e.target.style.borderColor = '#ffffff';
              e.target.style.backgroundColor = '#2a2a2a';
            }}
            onBlurCapture={(e) => {
              e.target.style.borderColor = 'transparent';
              e.target.style.backgroundColor = '#242424';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'none',
                border: 'none',
                color: '#a7a7a7',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Right: Genre Quick Filters & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Quick Genre Chips */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Synthwave', 'Lo-Fi', 'Electronic'].map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => {
                  setSelectedGenre(genre);
                  if (currentView !== 'home' && currentView !== 'search') {
                    navigateToHome();
                  }
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '500px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                  color: isSelected ? '#000000' : '#ffffff',
                  transition: 'background-color 0.15s, color 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* User Profile Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          padding: '4px 12px 4px 4px',
          borderRadius: '500px',
          cursor: 'pointer',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#535353',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <User size={16} color="#ffffff" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
            Maniac
          </span>
        </div>
      </div>
    </header>
  );
};
