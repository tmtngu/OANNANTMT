import React, { useMemo } from 'react';

interface StoneProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
}

const STONE_COLORS = [
  '#f5deb3', // wheat
  '#daa520', // goldenrod
  '#cd853f', // peru
  '#a0826d', // tan
];

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const Stone: React.FC<StoneProps> = ({ count, size = 'md' }) => {
  const stones = useMemo(() => {
    const arr = [];
    for (let i = 0; i < Math.min(count, 20); i++) {
      const seed = count * 1000 + i;
      arr.push({
        id: i,
        x: seededRandom(seed + 1) * 60 + 20,
        y: seededRandom(seed + 2) * 60 + 20,
        rotation: seededRandom(seed + 3) * 360,
        color: STONE_COLORS[Math.floor(seededRandom(seed + 4) * STONE_COLORS.length)],
        size: seededRandom(seed + 5) * 0.3 + 0.85,
      });
    }
    return arr;
  }, [count]);

  const sizeMap = {
    sm: { w: 'w-12', h: 'h-12', stone: 6 },
    md: { w: 'w-16', h: 'h-16', stone: 8 },
    lg: { w: 'w-24', h: 'h-24', stone: 10 },
  };

  const { w, h, stone: stoneRadius } = sizeMap[size];

  return (
    <div className={`${w} ${h} relative inline-flex items-center justify-center`}>
      {stones.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full shadow-md transition-all"
          style={{
            width: `${stoneRadius * s.size}px`,
            height: `${stoneRadius * s.size}px`,
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
            backgroundColor: s.color,
            border: '1px solid rgba(0,0,0,0.1)',
          }}
        />
      ))}
      
      {count > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-white text-xs sm:text-sm drop-shadow-lg">
            {count > 20 ? '20+' : count}
          </span>
        </div>
      )}
    </div>
  );
};

export default Stone;
