/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useSnake } from '../hooks/useSnake';
import { GRID_SIZE } from '../types';

export default function SnakeGame() {
  const { snake, food, gameState, score, resetGame } = useSnake();

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 bg-black">
      {/* Score Counter - Top Left */}
      <div className="absolute top-8 left-8 flex flex-col z-10">
        <span className="text-[10px] text-fuchsia-500 tracking-tighter mb-1 uppercase font-bold">Score Counter</span>
        <span className="text-4xl sm:text-6xl font-black text-white italic tracking-tighter">
          {score.toString().padStart(6, '0')}
        </span>
      </div>
      
      {/* Game Controls Legend - Bottom Left */}
      <div className="absolute bottom-8 left-8 hidden sm:flex space-x-4 z-10 opacity-40">
        <div className="flex flex-col">
          <span className="text-[8px] text-[#666] mb-1 uppercase tracking-widest font-bold">Directional Control</span>
          <div className="grid grid-cols-3 gap-1">
            <div className="w-6 h-6 border border-[#333] flex items-center justify-center text-[10px]">W</div>
            <div className="w-6 h-6"></div>
            <div className="w-6 h-6 border border-[#333] flex items-center justify-center text-[10px]">E</div>
            <div className="w-6 h-6 border border-[#333] flex items-center justify-center text-[10px]">A</div>
            <div className="w-6 h-6 border border-[#333] flex items-center justify-center text-[10px]">S</div>
            <div className="w-6 h-6 border border-[#333] flex items-center justify-center text-[10px]">D</div>
          </div>
        </div>
      </div>

      {/* Snake Canvas */}
      <div 
        className="relative bg-[#020202] border border-cyan-500/30 overflow-hidden shadow-[0_0_80px_rgba(34,211,238,0.05)]"
        style={{ 
          width: 'min(80vw, 500px)', 
          height: 'min(80vw, 400px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ 
            backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
          }}
        ></div>

        {/* Snake segments */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`${i === 0 ? 'bg-cyan-400 z-10 shadow-[0_0_15px_#22d3ee]' : (i === 1 ? 'bg-cyan-400/80 shadow-[0_0_10px_#22d3ee66]' : (i === 2 ? 'bg-cyan-400/60' : 'bg-cyan-400/20'))}`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="bg-fuchsia-500 rounded-full shadow-[0_0_15px_#d946ef]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            margin: '15%'
          }}
        />

        {/* Overlay States */}
        <AnimatePresence>
          {gameState === 'START' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center z-20"
            >
               <div className="bg-black px-8 py-4 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <h2 className="text-xl font-black text-white mb-6 tracking-[0.4em] uppercase italic">System Ready</h2>
                  <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-cyan-500 text-black font-bold text-xs tracking-[0.2em] hover:bg-cyan-400 transition-colors uppercase"
                  >
                    Initialize Boot
                  </button>
               </div>
            </motion.div>
          )}

          {gameState === 'GAME_OVER' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 text-center z-30"
            >
              <div className="bg-black px-10 py-6 border border-fuchsia-500/50">
                <h2 className="text-2xl font-black text-fuchsia-500 mb-2 tracking-[0.3em] uppercase italic">Fatal Error</h2>
                <p className="text-[#666] text-[10px] mb-8 uppercase tracking-widest font-bold">Segmentation Fault: Collision Detected</p>
                <button
                  onClick={resetGame}
                  className="px-8 py-3 bg-white text-black font-bold text-xs tracking-[0.2em] hover:bg-fuchsia-100 transition-colors uppercase"
                >
                  Restart Core
                </button>
              </div>
            </motion.div>
          )}
          
          {gameState === 'PLAYING' && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/60 px-4 py-1 border border-white/5 opacity-0 hover:opacity-100 transition-opacity">
                   <span className="text-[8px] text-white uppercase tracking-[0.4em] font-black italic">Active Session</span>
                </div>
             </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
