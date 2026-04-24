/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Point, GameState, INITIAL_SNAKE, GRID_SIZE } from '../types';

export const useSnake = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const moveQueueRef = useRef<Point[]>([]);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setGameState('PLAYING');
    moveQueueRef.current = [];
  };

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const nextDir = moveQueueRef.current.shift() || direction;
      setDirection(nextDir);
      
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + nextDir.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + nextDir.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameState('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const lastMove = moveQueueRef.current[moveQueueRef.current.length - 1] || direction;
      
      let nextMove: Point | null = null;
      
      const key = e.key.toLowerCase();
      
      if (key === 'arrowup' || key === 'w') {
        if (lastMove.y !== 1) nextMove = { x: 0, y: -1 };
      } else if (key === 'arrowdown' || key === 's') {
        if (lastMove.y !== -1) nextMove = { x: 0, y: 1 };
      } else if (key === 'arrowleft' || key === 'a') {
        if (lastMove.x !== 1) nextMove = { x: -1, y: 0 };
      } else if (key === 'arrowright' || key === 'd') {
        if (lastMove.x !== -1) nextMove = { x: 1, y: 0 };
      }

      if (nextMove && moveQueueRef.current.length < 2) {
        moveQueueRef.current.push(nextMove);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [snake, direction]);

  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    const speed = Math.max(80, 150 - Math.floor(score / 50) * 10);

    const loop = (time: number) => {
      if (time - lastUpdateRef.current > speed) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, moveSnake, score]);

  return {
    snake,
    food,
    gameState,
    score,
    highScore,
    resetGame,
    setGameState,
  };
};
