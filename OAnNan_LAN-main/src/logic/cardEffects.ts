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
    case 1: { // Ngon Thíiii - Ô cuối X2 nếu ăn được
      // Logic này được xử lý trong executeMove (khi ăn)
      // Card chỉ có tác dụng nếu người chơi ăn được ở lượt đó
      console.log('Card Ngon Thíiii được bốc - xử lý trong executeMove');
      break;
    }

    case 2: { // Hồng Nhan Bạc Phận
      newScores[currentPlayer] = Math.max(0, newScores[currentPlayer] - 4);
      break;
    }

    case 3: { // Còn Gì Đẹp Hơn
      // Logic này cần được xử lý ở App.tsx (không chuyển lượt)
      console.log('Card Còn Gì Đẹp Hơn - skip turn change');
      break;
    }

    case 4: { // Vì Em Xứng Đáng!!!
      newScores[currentPlayer] += 2;
      break;
    }

    case 5: { // Xa Cà Nu
      // Logic này xử lý ở App.tsx (skip next turn)
      console.log('Card Xa Cà Nu - apply at next turn');
      break;
    }

    case 6: { // Rụng Đá
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

  case 7: { // Cướp Quan
    const opponent = state.isP1Turn ? 'p2' : 'p1';
    const self = state.isP1Turn ? 'p1' : 'p2';
  
    // Giả sử mỗi Quan (Quan ăn được) có giá trị là 10 điểm trong logic của bạn
    const diemCua1Quan = 10; 

    if (newScores[opponent] >= diemCua1Quan) {
      // Trường hợp đối thủ đã ăn ít nhất 1 Quan
      // Kiểm tra xem đối thủ ăn 1 hay 2 Quan (Dựa trên điểm số chia hết cho 10)
      let soQuanCuopDuoc = Math.floor(newScores[opponent] / diemCua1Quan);
    
      // Giới hạn tối đa là 2 Quan theo luật lá bài
      if (soQuanCuopDuoc > 2) soQuanCuopDuoc = 2;

      const tongDiemCuop = soQuanCuopDuoc * diemCua1Quan;

      newScores[opponent] -= tongDiemCuop;
      newScores[self] += tongDiemCuop;
    
      console.log(`Đã cướp ${soQuanCuopDuoc} Quan!`);
    } else {
      // Trường hợp đối thủ chưa ăn Quan: -5 điểm của bản thân
      newScores[self] -= 5;
      console.log("Đối thủ chưa có Quan, bạn bị -5 điểm.");
    }
    break;
  }

    case 8: { // Em Bị Trừ 3 Điểm Thanh Lịch
      newScores[currentPlayer] = Math.max(0, newScores[currentPlayer] - 3);
      break;
    }

    case 9: { // Phiếu Bé Ngoan
      newScores[currentPlayer] += 5;
      break;
    }

    case 10: { // Ăn Bất Chấp
      // Logic này xử lý ở App.tsx (ăn ô tiếp theo nếu đủ điều kiện)
      console.log('Card ĂN KẾ TIẾP - handled in game logic');
      break;
    }

    case 11: { // Ôi Thôi Chớttt - Bẫy trừ 5 điểm
      // Xử lý khi đối phương bốc vào ô này
      console.log('Card Ôi Thôi CHớttt - trap activated');
      break;
    }

    case 12: { // Mài Chớt Chưa Con - Bẫy trừ 3 điểm
      // Xử lý khi đối phương bốc vào ô này
      console.log('Card Mài Chớt Chưa Con - trap activated');
      break;
    }

    case 13: { // Cơ Hội Lật Kèo
      // Đúng nhận Lật Kèo, Sai trừ 10
      const isCorrect = Math.random() > 0.5;
      if (isCorrect) {
        // Nhận thẻ Lật Kèo (xử lý bên ngoài)
        console.log('Card Cơ Hội Lật Kèo - Đúng! Thì xử lí như Lá Còn Gì Đẹp Hơn nhưng là 3 lượt');
      } else {
        newScores[currentPlayer] = Math.max(0, newScores[currentPlayer] - 10);
        console.log('Card Cơ Hội Lật Kèo - Sai! Trừ 10 điểm');
      }
      break;
    }

    case 14: { // Được Ăn Cả Ngã Thì Thua
      // Đúng ra phải thêm hiệu ứng tung xúc xắc ở App.txs
      const rolls = Array.from({ length: 3 }, () =>
        Math.floor(Math.random() * 6) + 1
      );
      const total = rolls.reduce((a, b) => a + b, 0);

      if (total > 11) {
        // Đổi kho điểm
        const temp = newScores.p1;
        newScores.p1 = newScores.p2;
        newScores.p2 = temp;
        console.log(`Card Được Ăn Cả Ngã Thì Thua - Tổng: ${total} > 10, đổi kho điểm!`);
      } else {
        console.log(`Card Được Ăn Cả Ngã Thì Thua - Tổng: ${total} ≤ 10, không được gì`);
      }
      break;
    }

    case 15: { // Nước Đi Hay Đấy
      // Cho phép chọn rải 5 đá vào 5 ô (xử lý UI)
      console.log('Card Nước Đi Hay Đấy - player choose 5 slots to place');
      break;
    }

    case 16: { // Dừng Cái Tay Hư Lại
      // Dừng tác dụng thẻ đối phương
      console.log('Card STOP - cancel opponent card effect');
      break;
    }

    default:
      console.warn('Unknown card ID:', card.id);
  }

  return { newBoard, newScores };
};
