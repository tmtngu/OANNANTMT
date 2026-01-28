import React, { useState } from 'react';
import type { GameCard } from '../data/cards';
import { Dice6 } from 'lucide-react';

interface CardModalProps {
  card: GameCard;
  onConfirm?: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onConfirm }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const isImmediate = card.type === 'IMMEDIATE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div 
        className="relative w-full max-w-[340px] sm:max-w-[400px]" // Giới hạn chiều rộng modal
        style={{ perspective: '1000px' }}
      >
        <div
          className={`
            bg-gradient-to-br ${card.color || 'from-slate-700 to-slate-900'}
            rounded-[24px] sm:rounded-[32px]
            border-[4px] sm:border-[6px] border-white
            shadow-[0_0_50px_rgba(0,0,0,0.5)]
            overflow-hidden
            animate-in fade-in zoom-in duration-300
            cursor-pointer transition-transform
            ${isFlipped ? 'scale-95' : 'scale-100'}
          `}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Header - Giữ lại để biết loại thẻ */}
          <div className="bg-white/20 backdrop-blur p-3 text-center border-b border-white/30">
            <h2 className="text-white text-xs sm:text-sm font-black uppercase tracking-widest">
              {isImmediate ? '⚡ DÙNG NGAY' : '🎁 CÓ THỂ ĐỂ DÀNH'}
            </h2>
          </div>

          {/* Content - Chỉ chứa ảnh tràn viền */}
          <div className="relative aspect-[1240/1740] w-full overflow-hidden bg-black/10">
            {card.image ? (
              <img 
                src={card.image} 
                alt="Game Card"
                className="w-full h-full object-cover" // Object-cover để đảm bảo không hở viền
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white text-4xl">
                {card.id}
              </div>
            )}
          </div>

          {/* Action Area */}
          <div className="p-4 sm:p-5 bg-black/20 backdrop-blur-sm">
            {onConfirm ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
                className="
                  w-full py-3 sm:py-4
                  bg-white text-gray-900
                  font-black
                  rounded-xl
                  hover:bg-gray-100
                  active:scale-95
                  transition-all
                  shadow-lg
                  uppercase tracking-wider
                  text-sm
                "
              >
                Xác nhận
                {card.id === 15 && (
                  <Dice6 className="inline ml-2 -mb-0.5" size={18} />
                )}
              </button>
            ) : (
              <p className="text-[10px] text-center italic opacity-75 text-white">
                Đang chờ Host xác nhận…
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="bg-white/10 p-2 text-center border-t border-white/10">
            <p className="text-[8px] font-black opacity-50 uppercase tracking-widest text-white">
              Bấm để xem lại • 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;