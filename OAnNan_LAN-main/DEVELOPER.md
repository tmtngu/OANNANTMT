# 👨‍💻 HƯỚNG DẪN DEVELOPER

## 📂 CẤU TRÚC PROJECT

```
src/
├── App.tsx                    # Main game component (Game Engine + UI)
├── App.css                    # Global styles
├── main.tsx                   # React entry point
├── index.css                  # Base CSS reset
├── components/
│   └── CardModal.tsx          # Card popup modal
├── data/
│   └── cards.ts               # Card definitions (17 cards)
└── logic/
    └── cardEffects.ts         # Card effect implementations
```

---

## 🎮 GAME FLOW

```
[Lobby Screen]
    ↓
P1 TẠO PHÒNG ← ← ← P2 VÀO PHÒNG (via ID)
    ↓                    ↓
[Game Start - P1 đi trước]
    ↓
[executeMove] ← ← ← [handleMove]
    ├─ Rải đá (animation)
    ├─ Check ăn Quan/Dân
    ├─ Cấp card (nếu điều kiện)
    └─ Chuyển lượt
       ↓
[broadcastSync] → Gửi dữ liệu cho P2
       ↓
[P2 nhận] → Update UI
       ↓
[Lặp lại] cho đến khi gameOver
```

---

## 🔌 NETWORK PROTOCOL

### Message Types

#### 1. JOIN
```typescript
{
  type: 'JOIN',
  name: 'Tên người chơi',
  avatar: 'URL avatar'
}
```
→ Người chơi mới vừa vào phòng, gửi thông tin

#### 2. MOVE
```typescript
{
  type: 'MOVE',
  index: 3  // Ô được bốc (0-10)
}
```
→ P2 gửi cho P1 biết ô nào được bốc

#### 3. SYNC
```typescript
{
  type: 'SYNC',
  board: [5, 5, ...],      // State bàn cờ
  scores: { p1: 10, p2: 5 },
  isP1Turn: false,
  card: { id: 6, name: '...' } || null,
  gameOver: false,
  skipNextTurn: false
}
```
→ P1 gửi toàn bộ game state sau mỗi nước đi

#### 4. CARD_EFFECT
```typescript
{
  type: 'CARD_EFFECT',
  card: { id: 5, ... }
}
```
→ Thông báo effect của card

---

## 📊 STATE MANAGEMENT

### React State
```typescript
// Lobby
[userName, setUserName]
[userAvatar, setUserAvatar]

// Game Board
[board, setBoard]              // [5,5,5,5,5,1,5,5,5,5,5,1]
[scores, setScores]            // {p1: 0, p2: 0}
[isP1Turn, setIsP1Turn]        // true/false
[skipNextTurn, setSkipNextTurn] // Xử lý Card 5

// UI
[currentCard, setCurrentCard]   // Card hiện tại
[gameOver, setGameOver]
[isJoined, setIsJoined]
[role, setRole]                // 'p1' | 'p2'
[connectionStatus, setConnectionStatus]
```

### Ref (Không re-render)
```typescript
stateRef.current = { board, scores, isP1Turn, gameOver, skipNextTurn }
```
→ Lưu state để dùng trong callback async

---

## 🎴 CARD LOGIC IMPLEMENTATION

### Ví dụ: Card 2 (PHÁ LÀNG PHÁ XÓM)

```typescript
case 2: {
  newScores[currentPlayer] = Math.max(0, newScores[currentPlayer] - 4);
  break;
}
```

### Pattern: Card có placeholders

Một số card cần xử lý ở App.tsx (không trong applyCardEffect):

**Card 1 (NGON THÍIII)** - X2 ô cuối cùng ăn
```typescript
// Xử lý: Trong executeMove khi check ăn
if (currentCard?.id === 1 && captured > 0) {
  captured *= 2;
}
```

**Card 3 (THÊM LƯỢT)** - Không chuyển lượt
```typescript
// Xử lý: Bỏ qua `nextTurn = !nextTurn`
if (currentCard?.id === 3) {
  nextTurn = isP1Turn; // Giữ lượt hiện tại
}
```

**Card 5 (MẤT LƯỢT)** - Bỏ qua 1 lượt
```typescript
// Xử lý:
if (currentCard?.id === 5) {
  setSkipNextTurn(true);
}
// Khi bốc lần sau:
if (skipNextTurn) {
  setSkipNextTurn(false);
  // Bỏ qua nước đi này
  return;
}
```

---

## 🎨 RESPONSIVE DESIGN

### Breakpoint Pattern
```tsx
className="
  text-2xl sm:text-3xl
  p-4 sm:p-8
  w-16 h-16 sm:w-24 sm:h-24
"
```

### Mobile Sizes
- **xs** (< 480px): Phone nhỏ
- **sm** (480px - 640px): Phone
- **md** (640px - 768px): Tablet nhỏ
- **lg** (768px+): Desktop

### Touch Optimization
```css
@media (hover: none) {
  button {
    padding: 12px !important;
  }
}
```

---

## 🐛 DEBUGGING

### Xem Network Messages
```typescript
c.on('data', (data) => {
  console.log('📨 Nhận:', data);
});
```

### Xem Game State
```typescript
console.log('Board:', stateRef.current.board);
console.log('Scores:', stateRef.current.scores);
```

### Test Offline
Chỉnh sửa `broadcastSync` để skip gửi:
```typescript
// Temp disable broadcast
const broadcastSync = useCallback((...) => {
  // if (connRef.current && connRef.current.open) return; // Skip
  // ...
}, []);
```

---

## 🚀 BUILD & DEPLOY

### Development
```bash
npm run dev
# http://localhost:5173
```

### Build
```bash
npm run build
# Output: dist/
```

### Preview
```bash
npm run preview
# Test production build locally
```

### Deploy
```bash
# Cloudflare Pages, Vercel, GitHub Pages, etc.
# Chỉ cần push dist/ folder
```

---

## 📦 DEPENDENCIES

| Package | Version | Mục Đích |
|---------|---------|---------|
| react | ^19.2.0 | UI framework |
| peerjs | ^1.5.5 | P2P connection |
| tailwindcss | ^4.1.18 | CSS utility |
| typescript | ~5.9.3 | Type safety |
| vite | ^7.2.4 | Build tool |
| lucide-react | ^0.563.0 | Icons |

---

## 🔄 MỘT LƯỢT CHƠI HOÀN CHỈNH

```
1. [Player A bốc ô 2]
   ↓
2. executeMove(2)
   - Lấy 5 đá từ ô 2
   - Rải tuần tự: ô 3, 4, 5, 6, 7
   - Kiểm tra ăn: nếu ô tiếp theo = 0 & ô sau > 0 → ăn
   ↓
3. Cấp card (nếu ăn || vào lãnh địa đối thủ)
   ↓
4. Chuyển lượt → setIsP1Turn(false)
   ↓
5. broadcastSync(newBoard, newScores, false, card)
   ↓
6. [Player B nhận]
   - Update board, scores, isP1Turn
   - Hiển thị card nếu có
   - Nếu là Player B, enable bốc ô
```

---

## 💡 CÓ THỂ CẢI THIỆN

- [ ] Optimize re-render với `useMemo`
- [ ] Extract `handleMove` logic ra custom hook
- [ ] Thêm Error Boundary
- [ ] Undo/Replay feature
- [ ] Sound effects
- [ ] Leaderboard
- [ ] Chat (qua PeerJS datachannel)
- [ ] Dark mode
- [ ] Multi-language

---

**Cập nhật**: 28/01/2026  
**Phiên bản**: v1.0
