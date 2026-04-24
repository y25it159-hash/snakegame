/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Point = {
  x: number;
  y: number;
};

export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  cover: string;
}

export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const GRID_SIZE = 20;

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'AI Synthwave',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73456.mp3', // Placeholder synthwave-like audio
    duration: 145,
    cover: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Cyber Runner',
    artist: 'AI Synthwave',
    url: 'https://cdn.pixabay.com/audio/2021/11/25/audio_91b122709d.mp3',
    duration: 182,
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Midnight City',
    artist: 'AI Synthwave',
    url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_317422f92b.mp3',
    duration: 128,
    cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=200&h=200&auto=format&fit=crop'
  }
];
