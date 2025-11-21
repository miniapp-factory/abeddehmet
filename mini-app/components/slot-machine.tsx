"use client";

import { useState, useEffect } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"];
const fruitImages: Record<string, string> = {
  Apple: "/apple.png",
  Banana: "/banana.png",
  Cherry: "/cherry.png",
  Lemon: "/lemon.png",
};

function getRandomFruit(): string {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>([
    [getRandomFruit(), getRandomFruit(), getRandomFruit()],
    [getRandomFruit(), getRandomFruit(), getRandomFruit()],
    [getRandomFruit(), getRandomFruit(), getRandomFruit()],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState<string | null>(null);

  useEffect(() => {
    if (!spinning) return;
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((col, idx) => {
          const newCol = [...col];
          newCol.pop();
          newCol.unshift(getRandomFruit());
          return newCol;
        });
        return newGrid;
      });
    }, 200);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [spinning]);

  useEffect(() => {
    if (spinning) return;
    // Check rows
    for (let r = 0; r < 3; r++) {
      if (grid[r][0] === grid[r][1] && grid[r][1] === grid[r][2]) {
        setWin(grid[r][0]);
        return;
      }
    }
    // Check columns
    for (let c = 0; c < 3; c++) {
      if (grid[0][c] === grid[1][c] && grid[1][c] === grid[2][c]) {
        setWin(grid[0][c]);
        return;
      }
    }
    setWin(null);
  }, [grid, spinning]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((fruit, rowIdx) => (
            <div key={`${colIdx}-${rowIdx}`} className="flex justify-center items-center w-16 h-16 border rounded">
              <img src={fruitImages[fruit]} alt={fruit} width={64} height={64} />
            </div>
          ))
        )}
      </div>
      <button
        className="px-4 py-2 bg-primary text-white rounded"
        onClick={() => setSpinning(true)}
        disabled={spinning}
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {win && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-bold">You won {win}!</span>
          <Share text={`I just won a slot machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
