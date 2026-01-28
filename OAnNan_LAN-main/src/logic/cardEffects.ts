import type { GameCard } from '../data/cards';

type GameState = {
  board: number[];
  scores: { p1: number; p2: number };
  isP1Turn: boolean;
};

export const applyCardEffect = (card: GameCard, state: GameState) => {
  const newBoard = [...state.board];
  const newScores = { ...state.scores };

  const currentPlayer: 'p1' | 'p2' = state.isP1Turn ? 'p1' : 'p2';
  const opponent: 'p1' | 'p2' = state.isP1Turn ? 'p2' : 'p1';

  switch (card.id) {
    case 1: { // NGON THÍIII - Ô cuối X2 nếu ăn được
      // Logic này được xử lý trong executeMove (khi ăn)
      // Card chỉ có tác dụng nếu người chơi ăn được ở lượt đó
      console.log('Card NGON THÍIII được bốc - xử lý trong executeMove');
      break;
    }

    case 2: { // PHÁ LÀNG PHÁ XÓM
      newScores[currentPlayer] = Math.max(0, newScores[currentPlayer] - 4);
      break;
    }

    case 3: { // THÊM LƯỢT
      // Logic này cần được xử lý ở App.tsx (không chuyển lượt)
      console.log('Card THÊM LƯỢT - skip turn change');
      break;
    }

    case 4: { // CHĂM HỌC HÀNH
      newScores[currentPlayer] += 2;
      break;
    }

    case 5: { // MẤT LƯỢT
      // Logic này xử lý ở App.tsx (skip next turn)
      console.log('Card MẤT LƯỢT - apply at next turn');
      break;
    }

    case 6: { // RẢI ĐỀU 5 ĐÁ
      const totalOppScore = newScores[opponent];

      if (totalOppScore >= 9) {
        const oppSlots = state.isP1Turn
          ? [6, 7, 8, 9, 10]
          : [0, 1, 2, 3, 4];

        oppSlots.forEach(idx => newBoard[idx]++);

        // Nếu kho > 20 thì rải thêm vào 2 ô Quan
        if (totalOppScore > 20) {
          newBoard[5]++;
          newBoard[11]++;
        }

        newScores[opponent] -= 5;
      }
      break;
    }

    case 7: { // HỒI QUAN - Lấy Quan của đối phương nếu đã ăn
      const targetQuan = state.isP1Turn ? 5 : 11;

      if (newBoard[targetQuan] === 0 && newScores[opponent] >= 10) {
        newBoard[targetQuan] = 1;
        newScores[opponent] -= 10;
      }
      break;
    }

    case 8: { // LƯỜI HỌC HÀNH
      newScores[currentPlayer] = Math.max(0, newScores[currentPlayer] - 3);
      break;
    }

    case 9: { // NGHÈO VƯỢT KHÓ
      newScores[currentPlayer] += 5;
      break;
    }

    case 10: { // ĂN KẾ TIẾP
      // Logic này xử lý ở App.tsx (ăn ô tiếp theo nếu đủ điều kiện)
      console.log('Card ĂN KẾ TIẾP - handled in game logic');
      break;
    }

    case 11: { // THI TRẠNG NGUYÊN
      // Thực tế nên show câu hỏi nhưng giờ random 50%
      const isCorrect = Math.random() > 0.5;
      newScores[currentPlayer] += isCorrect ? 3 : -3;
      newScores[currentPlayer] = Math.max(0, newScores[currentPlayer]);
      break;
    }

    case 12: { // ÔI THÔI CHỚTTT - Bẫy trừ 5 điểm
      // Xử lý khi đối phương bốc vào ô này
      console.log('Card ÔI THÔI CHỚTTT - trap activated');
      break;
    }

    case 13: { // MÀI CHỚT CHƯA CON - Bẫy trừ 3 điểm
      // Xử lý khi đối phương bốc vào ô này
      console.log('Card MÀI CHỚT CHƯA CON - trap activated');
      break;
    }

    case 14: { // CÂU HỎI ĐẲNG CẤP
      // Đúng nhận Lật Kèo, Sai trừ 10
      const isCorrect = Math.random() > 0.5;
      if (isCorrect) {
        // Nhận thẻ Lật Kèo (xử lý bên ngoài)
        console.log('Card CÂU HỎI ĐẲNG CẤP - Đúng! Nhận Lật Kèo');
      } else {
        newScores[currentPlayer] = Math.max(0, newScores[currentPlayer] - 10);
        console.log('Card CÂU HỎI ĐẲNG CẤP - Sai! Trừ 10 điểm');
      }
      break;
    }

    case 15: { // LẬT KÈO
      const rolls = Array.from({ length: 3 }, () =>
        Math.floor(Math.random() * 6) + 1
      );
      const total = rolls.reduce((a, b) => a + b, 0);

      if (total > 11) {
        // Đổi kho điểm
        const temp = newScores.p1;
        newScores.p1 = newScores.p2;
        newScores.p2 = temp;
        console.log(`Card LẬT KÈO - Tổng: ${total} > 11, đổi kho điểm!`);
      } else {
        console.log(`Card LẬT KÈO - Tổng: ${total} ≤ 11, không được gì`);
      }
      break;
    }

    case 16: { // ĐẬU TÚ TÀI
      // Cho phép chọn rải 5 đá vào 5 ô (xử lý UI)
      console.log('Card ĐẬU TÚ TÀI - player choose 5 slots to place');
      break;
    }

    case 17: { // STOP
      // Dừng tác dụng thẻ đối phương
      console.log('Card STOP - cancel opponent card effect');
      break;
    }

    default:
      console.warn('Unknown card ID:', card.id);
  }

  return { newBoard, newScores };
};
