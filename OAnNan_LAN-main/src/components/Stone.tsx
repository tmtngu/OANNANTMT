import React, { useMemo } from 'react';

interface StoneProps {
  count: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isQuan?: boolean; 
}

const STONE_COLORS = [
  '#f5deb3', 
  '#daa520', 
  '#cd853f', 
  '#a0826d', 
];

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const Stone: React.FC<StoneProps> = ({ count, size = 'md', isQuan = false }) => {
  // Logic: Phải >= 10 mới hiện viên to (để phân biệt với dân rải vào ô Quan trống)
  const hasQuanVien = isQuan && count >= 10;

  const stones = useMemo(() => {
    const arr = [];
    const actualDanCount = hasQuanVien ? count - 10 : count;
    const displayCount = Math.min(actualDanCount, 20);
    
    for (let i = 0; i < displayCount; i++) {
      const seed = count * 1000 + i;
      arr.push({
        id: i,
        // Đẩy sỏi ra xa tâm hơn một chút nếu có Quan to ở giữa
        x: hasQuanVien ? (seededRandom(seed + 1) * 60 + 20) : (seededRandom(seed + 1) * 60 + 20),
        y: hasQuanVien ? (seededRandom(seed + 2) * 60 + 20) : (seededRandom(seed + 2) * 60 + 20),
        rotation: seededRandom(seed + 3) * 360,
        color: STONE_COLORS[Math.floor(seededRandom(seed + 4) * STONE_COLORS.length)],
        size: seededRandom(seed + 5) * 0.3 + 0.85,
      });
    }
    return arr;
  }, [count, hasQuanVien]);

  const sizeMap = {
    sm: { w: 'w-12', h: 'h-12', stone: 7 },
    md: { w: 'w-16', h: 'h-16', stone: 9 },
    lg: { w: 'w-24', h: 'h-24', stone: 11 },
    // Tăng chiều rộng ô xl để chứa viên Quan 60px thoải mái hơn
    xl: { w: 'w-20 sm:w-24 lg:w-28', h: 'h-full', stone: 13 }, 
  };

  const { w, h, stone: stoneRadius } = sizeMap[size];

  return (
    <div className={`${w} ${h} relative inline-flex items-center justify-center`}>
      {/* VẼ VIÊN QUAN: Đã tăng kích thước lên 60px */}
      {hasQuanVien && (
        <div
          className="absolute rounded-full shadow-2xl transition-all border-2 border-white/30"
          style={{
            width: '60px',  // <--- Đã chỉnh to hơn (từ 45px lên 60px)
            height: '60px', // <--- Đã chỉnh to hơn
            backgroundColor: '#ffffff',
            backgroundImage: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e5e7eb 50%, #d1d5db 100%)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 15, // Cho nổi lên hẳn trên sỏi dân
            boxShadow: `
              0 15px 25px -5px rgba(0, 0, 0, 0.4), 
              inset -4px -4px 10px rgba(0,0,0,0.1),
              0 0 15px rgba(255, 255, 255, 0.6)
            `
          }}
        />
      )}

      {/* VẼ CÁC VIÊN SỎI DÂN */}
      {stones.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full shadow-sm transition-all"
          style={{
            width: `${stoneRadius * s.size}px`,
            height: `${stoneRadius * s.size}px`,
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
            backgroundColor: s.color,
            border: '1px solid rgba(0,0,0,0.15)',
            zIndex: 5
          }}
        />
      ))}
      
      {/* SỐ LƯỢNG TỔNG */}
      {count > 0 && (
        <div className="absolute bottom-2 right-2 z-20">
          <span className="font-black text-white text-[12px] drop-shadow-md bg-black/50 px-1.5 py-0.5 rounded-md">
             {count}
          </span>
        </div>
      )}
    </div>
  );
};

export default Stone;