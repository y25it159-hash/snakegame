/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import Visualizer from './components/Visualizer';
import { TRACKS } from './types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
    setProgress(0);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      }
    }
  }, [currentTrackIndex]); // Only update source when index changes

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    const handleEnded = () => skipForward();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-[#050505] text-[#e0e0e0] font-mono overflow-hidden relative border-8 border-[#111] flex flex-col">
      <audio ref={audioRef} />
      
      {/* Header */}
      <header className="h-16 border-b border-[#222] flex items-center justify-between px-8 bg-[#0a0a0a] shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-fuchsia-500 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            Neon-Rhythm OS v.1.0
          </h1>
        </div>
        <div className="hidden md:flex space-x-8 text-[11px] uppercase tracking-widest text-[#666]">
          <span>Status: <span className="text-cyan-400">In-Sync</span></span>
          <span>Audio: <span className="text-fuchsia-400">{isPlaying ? 'Active' : 'Standby'}</span></span>
          <span>Buffer: <span className="text-white">Optimized</span></span>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar: Music Library */}
        <aside className="w-72 border-r border-[#222] bg-[#080808] p-6 hidden lg:block overflow-y-auto">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#444] mb-6">Playlist / Library</h2>
          <div className="space-y-3">
            {TRACKS.map((track, idx) => (
              <div 
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(idx);
                  setIsPlaying(true);
                }}
                className={`group cursor-pointer p-3 border transition-colors ${
                  currentTrackIndex === idx 
                    ? 'border-cyan-500/20 bg-cyan-500/5' 
                    : 'border-transparent hover:border-[#333] hover:bg-white/5'
                }`}
              >
                <div className={`text-xs font-bold mb-1 italic ${currentTrackIndex === idx ? 'text-cyan-400' : 'text-[#aaa]'}`}>
                  {(idx + 1).toString().padStart(2, '0')}. {track.title.toUpperCase()}
                </div>
                <div className="text-[10px] text-[#666]">Artist: {track.artist}</div>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-[9px] px-1 border ${
                    currentTrackIndex === idx 
                      ? 'bg-cyan-950 text-cyan-400 border-cyan-800' 
                      : 'bg-[#111] text-[#333] border-[#222]'
                  }`}>
                    {currentTrackIndex === idx ? 'PLAYING' : 'QUEUED'}
                  </span>
                  <span className="text-[9px] text-[#444]">{Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Section: Game */}
        <section className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
           <SnakeGame />
        </section>
      </main>

      {/* Footer: Music Controls */}
      <footer className="h-[100px] border-t border-[#222] bg-[#0a0a0a] flex items-center px-8 shrink-0">
        <div className="w-1/3 flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-900 to-black border border-cyan-500/40 flex items-center justify-center overflow-hidden">
             {isPlaying ? (
               <div className="w-8 h-8 border-2 border-cyan-400 rotate-45 animate-pulse"></div>
             ) : (
               <Music size={24} className="text-cyan-400/40" />
             )}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-white uppercase">{currentTrack.title}</div>
            <div className="text-[10px] text-cyan-400 uppercase tracking-widest mt-1">{currentTrack.artist}</div>
          </div>
        </div>
        
        <div className="w-full sm:w-1/3 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-8">
            <button onClick={skipBackward} className="text-[#444] hover:text-white transition-colors">
               <SkipBack size={24} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-400 hover:bg-cyan-400/10 transition-all"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
            </button>
            <button onClick={skipForward} className="text-[#444] hover:text-white transition-colors">
               <SkipForward size={24} fill="currentColor" />
            </button>
          </div>
          <div className="w-full flex items-center space-x-2">
            <span className="text-[9px] text-[#444]">
              {Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor((audioRef.current?.currentTime || 0) % 60)).toString().padStart(2, '0')}
            </span>
            <div className="flex-1 h-[2px] bg-[#222] relative">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 -top-1 w-2 h-2 bg-white shadow-[0_0_8px_white]"></div>
              </div>
            </div>
            <span className="text-[9px] text-[#444]">
               {Math.floor(currentTrack.duration / 60)}:{Math.floor(currentTrack.duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        
        <div className="w-1/3 hidden sm:flex justify-end items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-20 h-1 bg-[#222] relative">
              <div className="absolute left-0 top-0 h-full w-[80%] bg-fuchsia-500"></div>
            </div>
            <Volume2 size={16} className="text-[#444]" />
          </div>
        </div>
      </footer>

      {/* Background Visualizer Background */}
      <div className="absolute bottom-[108px] left-0 w-full opacity-5 pointer-events-none">
        <Visualizer isPlaying={isPlaying} />
      </div>
    </div>
  );
}
