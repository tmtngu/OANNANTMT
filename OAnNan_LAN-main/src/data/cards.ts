export interface GameCard {
  id: number;
  type: 'IMMEDIATE' | 'HOLD';
  image: string;
  color: string;
}

// Danh sách các ID là thẻ HOLD (để dành) theo yêu cầu của bạn
const HOLD_IDS = [1, 3, 8, 11, 15, 16];
const TOTAL_CARDS = 16;

// Hàm lấy đường dẫn ảnh tự động từ thư mục assets/cards/
const getCardImage = (id: number) => new URL(`../assets/cards/${id}.png`, import.meta.url).href;

// Tạo danh sách toàn bộ thẻ bài
const allCards: GameCard[] = Array.from({ length: TOTAL_CARDS }, (_, i) => {
  const id = i + 1;
  const isHold = HOLD_IDS.includes(id);
  
  return {
    id,
    type: isHold ? 'HOLD' : 'IMMEDIATE',
    image: getCardImage(id),
    // Màu viền Gradient: Thẻ HOLD màu Tím/Xanh, Thẻ IMMEDIATE màu Vàng/Cam
    color: isHold 
      ? 'from-purple-600 to-indigo-700' 
      : 'from-amber-400 to-orange-600'
  };
});

// Xuất dữ liệu theo cấu trúc GAME_CARDS
export const GAME_CARDS = {
  IMMEDIATE: allCards.filter(card => card.type === 'IMMEDIATE'),
  HOLD: allCards.filter(card => card.type === 'HOLD')
};