export interface GameCard {
  id: number;
  type: 'IMMEDIATE' | 'HOLD';
  image: string;
  color: string;
}

/* 1. DANH SÁCH THẺ CÓ THỂ ĐỂ DÀNH */
const HOLD_IDS = [1, 3, 8, 11, 15, 16];
const TOTAL_CARDS = 16;

/* 2. ĐƯỜNG DẪN LẤY ẢNH TỰ ĐỘNG */
const getCardImage = (id: number) => new URL(`../assets/cards/${id}.png`, import.meta.url).href;

/* 3. KHỞI TẠO TOÀN BỘ DỮ LIỆU THẺ */
const allCards: GameCard[] = Array.from({ length: TOTAL_CARDS }, (_, i) => {
  const id = i + 1;
  const isHold = HOLD_IDS.includes(id);
  
  return {
    id,
    type: isHold ? 'HOLD' : 'IMMEDIATE',
    image: getCardImage(id),
    /* MÀU SẮC RIÊNG CHO TỪNG LOẠI THẺ */
    color: isHold 
      ? 'from-purple-600 to-indigo-700' 
      : 'from-amber-400 to-orange-600'
  };
});

/* 4. XUẤT DỮ LIỆU THEO PHÂN LOẠI */
export const GAME_CARDS = {
  IMMEDIATE: allCards.filter(card => card.type === 'IMMEDIATE'),
  HOLD: allCards.filter(card => card.type === 'HOLD')
};