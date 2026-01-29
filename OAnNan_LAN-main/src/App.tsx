import { useState, useEffect, useRef, useCallback } from 'react';
import { Peer } from 'peerjs';
import type { DataConnection } from 'peerjs';
import type { GameCard } from './data/cards';
import { GAME_CARDS } from './data/cards';
import { applyCardEffect } from './logic/cardEffects';
import CardModal from './components/CardModal';
import Stone from './components/Stone';
import Timer from './components/Timer';
import Instructions from './components/Instructions';

/* -------------------- Utils -------------------- */
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=mimi",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Happy",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Cute",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Cool",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Awesome",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nice",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sweet",
];

const getSafeAvatar = (avatar: string): string => {
  return avatar && avatar.trim() ? avatar : AVATARS[0];
};

const getRandomCard = (): GameCard => {
  const all = [...GAME_CARDS.IMMEDIATE, ...GAME_CARDS.HOLD];
  return all[Math.floor(Math.random() * all.length)];
};

/* -------------------- Interface for Sync Data -------------------- */
interface SyncData {
  type: 'SYNC' | 'MOVE' | 'JOIN' | 'CARD_EFFECT';
  board?: number[];
  scores?: { p1: number; p2: number };
  isP1Turn?: boolean;
  card?: GameCard | null;
  gameOver?: boolean;
  name?: string;
  avatar?: string;
  index?: number;
  direction?: 'LEFT' | 'RIGHT'; // THÊM DÒNG NÀY
  skipNextTurn?: boolean;
}

export default function App() {
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState(AVATARS[0]);
  const [isJoined, setIsJoined] = useState(false);
  const [oppInfo, setOppInfo] = useState({ name: 'Đang chờ...', avatar: AVATARS[0] });

  const [board, setBoard] = useState<number[]>([5, 5, 5, 5, 5, 10, 5, 5, 5, 5, 5, 10]);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [isP1Turn, setIsP1Turn] = useState(true);
  const [currentCard, setCurrentCard] = useState<GameCard | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [skipNextTurn, setSkipNextTurn] = useState(false);
  const [selectingIndex, setSelectingIndex] = useState<number | null>(null); // THÊM DÒNG NÀY

  const [myId, setMyId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [role, setRole] = useState<'p1' | 'p2' | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('Đang kết nối...');
  
  const connRef = useRef<DataConnection | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const stateRef = useRef({ board, scores, isP1Turn, gameOver, skipNextTurn });

  useEffect(() => {
    stateRef.current = { board, scores, isP1Turn, gameOver, skipNextTurn };
  }, [board, scores, isP1Turn, gameOver, skipNextTurn]);

  /* ---------- BROADCAST LOGIC ---------- */
  const broadcastSync = useCallback((
    b: number[], 
    s: { p1: number; p2: number }, 
    t: boolean, 
    c?: GameCard | null, 
    end?: boolean,
    skip?: boolean
  ) => {
    if (connRef.current && connRef.current.open) {
      connRef.current.send({
        type: 'SYNC',
        board: b,
        scores: s,
        isP1Turn: t,
        card: c,
        gameOver: end,
        skipNextTurn: skip
      });
    }
  }, []);
// --- LOGIC HẬU CẦN (VÉT KHO & KẾT THÚC) ---
  const handleEndGame = useCallback(() => {
    alert("Trò chơi kết thúc! Đang tính toán điểm số cuối cùng...");
    // Ở đây bạn có thể thêm logic setGameOver(true) nếu có state đó
  }, []);

  const handleVetKho = useCallback((isP1Turn: boolean, currentBoard: number[], currentScores: any) => {
    const startIdx = isP1Turn ? 0 : 6;
    const endIdx = isP1Turn ? 4 : 10;
    
    // Kiểm tra xem 5 ô dân bên phía người chơi có trống không
    const sideSum = currentBoard.slice(startIdx, endIdx + 1).reduce((a, b) => a + b, 0);

    if (sideSum === 0) {
      const newBoard = [...currentBoard];
      const newScores = { ...currentScores };
      const playerKey = isP1Turn ? 'p1' : 'p2' as const;

      // Nếu còn đủ 5 điểm thì rải quân tiếp
      if (newScores[playerKey] >= 5) {
        newScores[playerKey] -= 5;
        for (let i = startIdx; i <= endIdx; i++) {
          newBoard[i] = 1;
        }
        
        setBoard(newBoard);
        setScores(newScores);
        
        // Gửi lệnh đồng bộ sang máy đối phương
        broadcastSync(newBoard, newScores, isP1Turn, null);
        console.log(`Người chơi ${playerKey} đã tự động rải 5 quân (Vét kho).`);
      } else {
        // Không đủ điểm rải quân thì kết thúc trận đấu
        handleEndGame();
      }
    }
  }, [broadcastSync, setBoard, setScores, handleEndGame]);
  /* ---------- GAME ENGINE CORE ---------- */
  const executeMove = useCallback(async (index: number, direction: 'LEFT' | 'RIGHT') => {
    if (stateRef.current.gameOver || stateRef.current.skipNextTurn) return;

    const newBoard = [...stateRef.current.board];
    const newScores = { ...stateRef.current.scores };
    
    let cur = index;
    let stones = newBoard[cur];
    newBoard[cur] = 0;
    setBoard([...newBoard]);

    // VÒNG LẶP LIÊN HOÀN: Rải hết bốc tiếp
    while (stones > 0) {
      // 1. Rải số quân đang có trên tay
      while (stones > 0) {
        await delay(250);
        if (direction === 'RIGHT') {
          cur = (cur + 1) % 12;
        } else {
          cur = (cur - 1 + 12) % 12;
        }
        newBoard[cur]++;
        stones--;
        setBoard([...newBoard]);
      }

      // 2. Kiểm tra ô tiếp theo sau khi rải quân cuối cùng
      let nextIdx = direction === 'RIGHT' ? (cur + 1) % 12 : (cur - 1 + 12) % 12;
      
      // Nếu ô tiếp theo CÓ QUÂN và KHÔNG PHẢI Ô QUAN (5 hoặc 11) -> Bốc đi tiếp
      if (newBoard[nextIdx] > 0 && nextIdx !== 5 && nextIdx !== 11) {
        await delay(400); // Nghỉ một chút để người chơi kịp nhìn
        cur = nextIdx;
        stones = newBoard[cur];
        newBoard[cur] = 0;
        setBoard([...newBoard]);
      } else {
        // Gặp ô trống hoặc ô Quan -> Dừng rải để xét ăn quân
        break;
      }
    }

    // LOGIC ĂN QUÂN (Chỉ chạy khi đã dừng rải quân)
    let canCapture = true;
    while (canCapture) {
      const next = direction === 'RIGHT' ? (cur + 1) % 12 : (cur - 1 + 12) % 12;
      const after = direction === 'RIGHT' ? (next + 1) % 12 : (next - 1 + 12) % 12;

      // Điều kiện ăn: Ô tiếp theo trống VÀ ô sau đó có quân
      if (newBoard[next] === 0 && newBoard[after] > 0) {
        const isQuan = after === 5 || after === 11;
        // Nếu là ô Quan thì phải có ít nhất 1 viên mới được ăn (tùy luật Lan Edition của bạn)
        if (!(isQuan && newBoard[after] < 1)) { 
          const capturedCount = newBoard[after];
          if (stateRef.current.isP1Turn) newScores.p1 += capturedCount;
          else newScores.p2 += capturedCount;
          
          newBoard[after] = 0;
          setBoard([...newBoard]);
          setScores({...newScores});

          // Sau khi ăn, kiểm tra xem có ăn liên hoàn được ô tiếp theo không
          cur = after; 
          await delay(400);
        } else {
          canCapture = false;
        }
      } else {
        canCapture = false;
      }
    }

    // KẾT THÚC LƯỢT & KIỂM TRA THẺ BÀI
    let card: GameCard | null = null;
    // (Giữ nguyên logic card và đổi lượt của bạn ở đây...)
    let nextTurn = !stateRef.current.isP1Turn;
    if (skipNextTurn) {
      setSkipNextTurn(false);
      nextTurn = !nextTurn;
    }
    setIsP1Turn(nextTurn);

    if (newBoard[5] === 0 && newBoard[11] === 0) {
      setGameOver(true);
      broadcastSync(newBoard, newScores, nextTurn, null, true);
    } else {
      broadcastSync(newBoard, newScores, nextTurn, null, false, false);
    }
  }, [broadcastSync, skipNextTurn]);

  /* ---------- NETWORK LISTENERS ---------- */
  const setupDataListener = useCallback((c: DataConnection) => {
    c.on('data', async (data: unknown) => {
      const payload = data as SyncData;
      
      if (payload.type === 'JOIN') {
        setOppInfo({ name: payload.name || 'Người chơi', avatar: payload.avatar || AVATARS[0] });
        setIsJoined(true);
        setConnectionStatus('Đã kết nối');
      }
      
      if (payload.type === 'MOVE' && payload.index !== undefined && payload.direction) {
        await executeMove(payload.index, payload.direction); // SỬA ĐỂ NHẬN HƯỚNG TỪ ĐỐI THỦ
      }
      
      if (payload.type === 'SYNC') {
        setBoard(payload.board!);
        setScores(payload.scores!);
        setIsP1Turn(payload.isP1Turn!);
        setCurrentCard(payload.card || null);
        setSkipNextTurn(payload.skipNextTurn || false);
        if (payload.gameOver) setGameOver(true);
      }
      
      if (payload.type === 'CARD_EFFECT') {
        if (payload.card?.id === 5) {
          setSkipNextTurn(true);
        }
      }
    });
  }, [executeMove]);

  /* ---------- PEER INITIALIZATION ---------- */
  useEffect(() => {
    const p = new Peer();
    peerRef.current = p;
    
    p.on('open', id => {
      setMyId(id);
      setConnectionStatus('Sẵn sàng (tạo/vào phòng)');
    });
    
    p.on('connection', (c) => {
      connRef.current = c;
      setRole('p1');
      setConnectionStatus('Đã kết nối');
      setupDataListener(c);
      c.on('open', () => {
        c.send({ type: 'JOIN', name: userName, avatar: userAvatar });
      });
      c.on('error', () => setConnectionStatus('Lỗi kết nối'));
      c.on('close', () => setConnectionStatus('Kết nối bị đóng'));
    });
    
    p.on('error', () => setConnectionStatus('Lỗi Peer'));
    
    return () => p.destroy();
  }, [setupDataListener, userName, userAvatar]);

  const connectToPeer = () => {
    if (!targetId || !userName || !peerRef.current) return;
    setConnectionStatus('Đang kết nối...');
    const c = peerRef.current.connect(targetId);
    connRef.current = c;
    c.on('open', () => {
      setRole('p2');
      setIsJoined(true);
      setConnectionStatus('Đã kết nối');
      setupDataListener(c);
      c.send({ type: 'JOIN', name: userName, avatar: userAvatar });
    });
    c.on('error', () => setConnectionStatus('Lỗi kết nối - ID sai?'));
    c.on('close', () => setConnectionStatus('Kết nối bị đóng'));
  };

  const handleMove = (i: number) => {
    if (gameOver || !role || skipNextTurn || board[i] === 0) return;
    if (role === 'p1' && !isP1Turn) return;
    if (role === 'p2' && isP1Turn) return;

    setSelectingIndex(i); // THAY ĐỔI: HIỆN CHỌN HƯỚNG CHỨ CHƯA CHẠY NGAY
  };

  // THÊM HÀM XỬ LÝ KHI CHỌN HƯỚNG
  // Cập nhật hàm confirmMove để đảo hướng cho P2
  const confirmMove = (direction: 'LEFT' | 'RIGHT') => {
    if (selectingIndex === null) return;
    
    let finalDirection = direction;

    // Nếu là P2, ta đảo ngược logic hướng để mũi tên khớp với chiều chạy index
    if (role === 'p2') {
      finalDirection = direction === 'LEFT' ? 'RIGHT' : 'LEFT';
      connRef.current?.send({ type: 'MOVE', index: selectingIndex, direction: finalDirection });
    } else {
      executeMove(selectingIndex, finalDirection);
    }
    
    setSelectingIndex(null);
  };
  /* ---------- UI RENDER ---------- */
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-[#f3e5ab] flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-[30px] sm:rounded-[40px] lg:rounded-[60px] shadow-2xl border-4 lg:border-6 border-amber-800 w-full max-w-md lg:max-w-2xl">
          <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6 lg:mb-8">
            <img src="/logo_ueh.png" alt="UEH Logo" className="h-10 sm:h-12 lg:h-16 w-auto" />
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-amber-900 underline">Ô ĂN NĂN</h2>
          </div>
          
          <div className="flex justify-center gap-2 sm:gap-3 lg:gap-4 mb-5 sm:mb-6 lg:mb-8 flex-wrap">
            {AVATARS.map(url => (
              <img key={url} src={url} alt="avatar" onClick={() => setUserAvatar(url)}
                className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full border-4 lg:border-6 cursor-pointer transition-all ${userAvatar === url ? 'border-amber-600 scale-110' : 'border-transparent opacity-50'}`}
              />
            ))}
          </div>
          
          <input 
            className="w-full border-2 lg:border-4 border-amber-200 p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl mb-3 sm:mb-4 lg:mb-6 font-bold outline-none text-sm sm:text-base lg:text-lg" 
            placeholder="Tên của bạn..." 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && userName && setIsJoined(true)}
          />
          
          <button 
            onClick={() => { if(userName) setIsJoined(true) }} 
            className="w-full bg-amber-800 text-white py-3 sm:py-4 lg:py-6 rounded-2xl lg:rounded-3xl font-black mb-2 sm:mb-3 lg:mb-4 active:scale-95 transition-all text-sm sm:text-base lg:text-lg"
          >
            TẠO PHÒNG
          </button>
          
          <div className="flex gap-2 lg:gap-3">
            <input 
              className="flex-1 border-2 lg:border-4 border-amber-100 p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl font-bold text-sm sm:text-base lg:text-lg" 
              placeholder="ID phòng..." 
              value={targetId} 
              onChange={e => setTargetId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && connectToPeer()}
            />
            <button 
              onClick={connectToPeer} 
              className="bg-blue-600 text-white px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-6 rounded-2xl lg:rounded-3xl font-black text-sm sm:text-base lg:text-lg transition-all hover:scale-105"
            >
              VÀO
            </button>
          </div>
          
          <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-4 lg:mt-6 text-center">{connectionStatus}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3e5ab] p-3 sm:p-6 lg:p-8 flex flex-col items-center landscape:p-2 landscape:h-screen landscape:overflow-auto">
      {/* Header - Player Info */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-4 sm:mb-6 lg:mb-8 landscape:mb-2 flex-wrap gap-3 sm:gap-4 lg:gap-6 px-2">
        <img src="/logo_ueh.png" alt="UEH" className="h-8 sm:h-10 lg:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
        
        <div className={`flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 rounded-2xl sm:rounded-3xl lg:rounded-[40px] border-3 sm:border-4 lg:border-[5px] transition-all ${
          isP1Turn && role === 'p1' ? 'bg-amber-100 border-amber-700 shadow-lg ring-2 ring-amber-500' : 'bg-white border-amber-600 shadow-md'
        }`}>
          <img src={getSafeAvatar(role === 'p1' ? userAvatar : oppInfo.avatar)} className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 lg:border-3 border-amber-600" alt="p1" />
          <div className="flex flex-col items-start min-w-fit">
            <p className="text-xs sm:text-sm lg:text-base font-black text-amber-900">{role === 'p1' ? userName : oppInfo.name}</p>
            <p className="text-sm sm:text-base lg:text-lg font-black text-amber-700">{scores.p1}đ</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 sm:gap-2 landscape:gap-0.5">
          <div className={`px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 lg:py-2.5 rounded-full font-black text-white shadow-lg text-xs sm:text-sm lg:text-base transition-all ${
            isP1Turn ? 'bg-amber-600 ring-2 ring-amber-400' : 'bg-blue-600'
          }`}>
            {isP1Turn ? "⏱️ LƯỢT P1" : "⏱️ LƯỢT P2"}
          </div>
          {(isP1Turn ? role === 'p1' : role === 'p2') && (
            <Timer 
              isActive={!skipNextTurn && !gameOver}
              duration={30}
              onTimeout={() => {
                alert('Hết thời gian! Tự động chuyển lượt.');
                setIsP1Turn(!isP1Turn);
              }}
            />
          )}
        </div>

        <div className={`flex flex-row-reverse items-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 rounded-2xl sm:rounded-3xl lg:rounded-[40px] border-3 sm:border-4 lg:border-[5px] transition-all ${
          !isP1Turn && role === 'p2' ? 'bg-blue-100 border-blue-700 shadow-lg ring-2 ring-blue-500' : 'bg-white border-blue-600 shadow-md'
        }`}>
          <img src={getSafeAvatar(role === 'p2' ? userAvatar : oppInfo.avatar)} className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 lg:border-3 border-blue-600" alt="p2" />
          <div className="flex flex-col items-end min-w-fit">
            <p className="text-xs sm:text-sm lg:text-base font-black text-blue-900">{role === 'p2' ? userName : oppInfo.name}</p>
            <p className="text-sm sm:text-base lg:text-lg font-black text-blue-700">{scores.p2}đ</p>
          </div>
        </div>

        <button
          onClick={() => { navigator.clipboard.writeText(myId); alert("Đã copy ID!"); }}
          className="ml-auto text-[8px] sm:text-[10px] lg:text-xs font-bold text-amber-700 hover:text-amber-900 underline transition-colors landscape:text-[7px]"
        >
          ID: {myId.slice(0,6)}...
        </button>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 sm:gap-5 lg:gap-7 w-full max-w-6xl px-2 sm:px-4">
        {/* P2's Board */}
        <div className={`w-full flex flex-col items-center gap-1.5 sm:gap-2 lg:gap-3 p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl lg:rounded-[40px] transition-all ${
          !isP1Turn && role === 'p2' ? 'bg-blue-50 ring-3 ring-blue-400 shadow-lg' : 'bg-white shadow-md'
        }`}>
          <p className="text-[10px] sm:text-xs lg:text-sm font-black text-blue-900 uppercase tracking-[0.1em]">👤 {role === 'p2' ? userName : oppInfo.name} (P2)</p>
          <div className="flex items-stretch justify-center gap-2 sm:gap-2.5 lg:gap-3 w-full">
            <div className="w-14 h-20 sm:w-16 sm:h-32 lg:w-20 lg:h-40 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center border-3 sm:border-4 lg:border-[5px] border-blue-700 shadow-lg flex-shrink-0">
              <Stone count={board[11]} size="xl" isQuan={true} />
            </div>
            
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5 lg:gap-2 flex-grow justify-items-center">
              {[10, 9, 8, 7, 6].map(i => (
                <div key={i} className="relative group"> {/* THÊM RELATIVE ĐỂ CHỨA NÚT HƯỚNG */}
                  <div
                    onClick={() => handleMove(i)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center font-black transition-all border-2 sm:border-3 lg:border-4 ${
                      !isP1Turn && role === 'p2' && !skipNextTurn
                        ? 'bg-blue-200 border-blue-600 hover:bg-blue-100 hover:scale-110 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer'
                        : 'bg-blue-300 border-blue-500 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Stone count={board[i]} size="sm" />
                  </div>
                  {/* MENU CHỌN HƯỚNG P2 */}
                  {selectingIndex === i && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-50 bg-white p-1 rounded-full shadow-2xl border-2 border-blue-600">
                      <button onClick={() => confirmMove('LEFT')} className="w-8 h-8 bg-blue-600 text-white rounded-full font-bold">←</button>
                      <button onClick={() => confirmMove('RIGHT')} className="w-8 h-8 bg-blue-600 text-white rounded-full font-bold">→</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full flex items-center gap-2 sm:gap-3 my-1 sm:my-2 lg:my-3">
          <div className="flex-1 h-1 sm:h-1.5 lg:h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full" />
          <span className="text-[10px] sm:text-xs lg:text-sm font-black text-gray-600 px-2">⚔️</span>
          <div className="flex-1 h-1 sm:h-1.5 lg:h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full" />
        </div>

        {/* P1's Board */}
        <div className={`w-full flex flex-col items-center gap-1.5 sm:gap-2 lg:gap-3 p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl lg:rounded-[40px] transition-all ${
          isP1Turn && role === 'p1' ? 'bg-amber-50 ring-3 ring-amber-400 shadow-lg' : 'bg-white shadow-md'
        }`}>
          <p className="text-[10px] sm:text-xs lg:text-sm font-black text-amber-900 uppercase tracking-[0.1em]">👤 {role === 'p1' ? userName : oppInfo.name} (P1)</p>
          <div className="flex items-stretch justify-center gap-2 sm:gap-2.5 lg:gap-3 w-full">
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5 lg:gap-2 flex-grow justify-items-center">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="relative group"> {/* THÊM RELATIVE ĐỂ CHỨA NÚT HƯỚNG */}
                  <div
                    onClick={() => handleMove(i)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center font-black transition-all border-2 sm:border-3 lg:border-4 ${
                      isP1Turn && role === 'p1' && !skipNextTurn
                        ? 'bg-amber-200 border-amber-600 hover:bg-amber-100 hover:scale-110 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer'
                        : 'bg-amber-300 border-amber-500 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Stone count={board[i]} size="sm" />
                  </div>
                  {/* MENU CHỌN HƯỚNG P1 */}
                  {selectingIndex === i && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-2 z-50 bg-white p-1 rounded-full shadow-2xl border-2 border-amber-600">
                      <button onClick={() => confirmMove('LEFT')} className="w-8 h-8 bg-amber-600 text-white rounded-full font-bold">←</button>
                      <button onClick={() => confirmMove('RIGHT')} className="w-8 h-8 bg-amber-600 text-white rounded-full font-bold">→</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="w-14 h-20 sm:w-16 sm:h-32 lg:w-20 lg:h-40 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-b from-amber-200 to-amber-300 flex items-center justify-center border-3 sm:border-4 lg:border-[5px] border-amber-700 shadow-lg flex-shrink-0">
              <Stone count={board[5]} size="xl" isQuan={true} />
            </div>
          </div>
        </div>
      </div>

      {skipNextTurn && (
        <p className="mt-2 text-red-600 font-bold text-sm sm:text-base lg:text-lg landscape:text-xs animate-pulse">⚠️ Bị mất lượt!</p>
      )}

      {currentCard && (
        <CardModal 
          card={currentCard} 
          onConfirm={role === 'p1' ? () => {
            const res = applyCardEffect(currentCard, { board, scores, isP1Turn });
            setBoard(res.newBoard); 
            setScores(res.newScores); 
            setCurrentCard(null);
            if (currentCard.id === 5) setSkipNextTurn(true);
            broadcastSync(res.newBoard, res.newScores, isP1Turn, null);
          } : undefined}
        />
      )}

      {gameOver && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[300] text-white p-4">
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-3 sm:mb-4 lg:mb-6">🎉 KẾT THÚC</h2>
          <p className="text-2xl sm:text-3xl lg:text-5xl mb-4 sm:mb-8 lg:mb-10 font-bold">
            P1: {scores.p1} - P2: {scores.p2}
          </p>
          <p className="text-lg sm:text-2xl lg:text-4xl mb-8 lg:mb-12 font-bold">
            {scores.p1 > scores.p2 ? '🏆 P1 THẮNG!' : scores.p2 > scores.p1 ? '🏆 P2 THẮNG!' : '🤝 HÒA!'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 sm:px-12 lg:px-16 py-3 sm:py-4 lg:py-6 bg-amber-600 rounded-full text-lg sm:text-2xl lg:text-3xl font-black shadow-xl hover:scale-110 transition-transform"
          >
            CHƠI LẠI
          </button>
        </div>
      )}

      <Instructions />
    </div>
  );
}