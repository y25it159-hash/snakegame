/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function Visualizer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex items-end gap-[1px] h-32 w-full">
      {Array.from({ length: 80 }).map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-cyan-500"
          initial={{ height: 2 }}
          animate={{ 
            height: isPlaying ? [2, Math.random() * 60 + 5, 2] : 2,
            opacity: isPlaying ? [0.4, 0.8, 0.4] : 0.2
          }}
          transition={{ 
            duration: 0.4 + Math.random() * 0.6,
            repeat: Infinity,
            delay: i * 0.01,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
