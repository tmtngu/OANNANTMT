import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

/* 1. KHAI BÁO DỮ LIỆU ĐẦU VÀO */
interface TimerProps {
  isActive: boolean;
  duration?: number;
  onTimeout?: () => void;
}

const Timer: React.FC<TimerProps> = ({ isActive, duration = 30, onTimeout }) => {
  const [remaining, setRemaining] = useState(duration);

  /* 2. LÀM MỚI GIỜ KHI CÀI ĐẶT THAY ĐỔI */
  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  /* 3. ĐẾM NGƯỢC TỪNG GIÂY */
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          onTimeout?.();
          return duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeout, duration]);

  /* 4. TÍNH ĐỘ DÀI THANH CHẠY VÀ MỨC ĐỂ CHUYỂN MÀU */
  const percentage = (remaining / duration) * 100;
  const isWarning = remaining <= 5;

  return (
    <div className="flex flex-col items-center gap-2">
      
      {/* 5. MẶT ĐỒNG HỒ VÀ SỐ GIÂY CÒN LẠI */}
      <div className="flex items-center gap-1 text-xs sm:text-sm font-bold">
        <Clock size={14} className={isWarning ? 'text-red-500 animate-pulse' : 'text-amber-600'} />
        <span className={isWarning ? 'text-red-500' : 'text-amber-700'}>
          {remaining} giây
        </span>
      </div>
      
      {/* 6. THANH THỜI GIAN (NGẮN DẦN KHI CHẠY) */}
      <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-gray-300 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${
            isWarning ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-amber-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

    </div>
  );
};

export default Timer;