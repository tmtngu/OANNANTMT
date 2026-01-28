# 🚀 CHANGELOG v2.0 - UPDATE LỚN

## ✨ 5 TÍNH NĂNG MỚI HOÀN THÀNH

### 1. ✅ MOBILE LANDSCAPE OPTIMIZATION
- **Landscape Mode**: Tự động detect orientation
- **Compact Layout**: Gap, padding giảm trên landscape
- **Scale Factor**: Avatar, board scale 0.9 trên landscape
- **Responsive**: Max-height 70vh cho board trên landscape
- **Touch Friendly**: 44px minimum touch target

**Kỹ thuật:**
```css
@media (orientation: landscape) {
  /* Compact rules */
  .landscape\:p-2 { padding: 0.5rem; }
}
```

---

### 2. ✅ THỜI GIAN LƯỢT CHƠI & PROGRESS BAR

**Tính Năng:**
- ⏱️ **30 giây/lượt** (có thể điều chỉnh)
- 📊 **Progress Bar** chạy ngược màu gradient amber → red
- ⚠️ **Warning** khi ≤ 5 giây (animate pulse)
- 🔔 **Timeout Callback**: Auto chuyển lượt nếu hết thời gian

**Component: `Timer.tsx`**
```typescript
<Timer 
  isActive={!skipNextTurn && !gameOver}
  duration={30}
  onTimeout={() => { /* auto skip turn */ }}
/>
```

**UI:**
```
⏱️ 15s
████░░░░░ 60%
```

---

### 3. ✅ CARD VISUAL (EMOJI + GRADIENT COLORS)

**Thêm vào `GameCard` interface:**
- `emoji`: Biểu tượng card (✨, 💥, ⚡, etc.)
- `color`: Gradient Tailwind (`from-yellow-400 to-yellow-600`)

**17 Card mới:**
| Card | Emoji | Color |
|------|-------|-------|
| 1 | ✨ | from-yellow-400 to-yellow-600 |
| 2 | 💥 | from-red-400 to-red-600 |
| 3 | ⚡ | from-blue-400 to-blue-600 |
| 6 | 🌊 | from-cyan-400 to-cyan-600 |
| 15 | 🎲 | from-purple-500 to-purple-700 |
| ... | ... | ... |

**CardModal Update:**
```tsx
<div className={`bg-gradient-to-br ${card.color}`}>
  <div className="text-4xl sm:text-6xl">{card.emoji}</div>
</div>
```

---

### 4. ✅ STONE COMPONENT (VIÊN ĐÁ)

**Thay thế số bằng viên sỏi ngẫu nhiên**

**Component: `Stone.tsx`**
```typescript
<Stone count={board[i]} size="md" />
```

**Features:**
- 🪨 4 màu sỏi: wheat, goldenrod, peru, tan
- 🎲 Vị trí (x, y) ngẫu nhiên (20-80%)
- 🔄 Rotation random (0-360°)
- 📏 Size random (0.85-1.15)
- 🏷️ Badge số nhỏ ở giữa (text-xs drop-shadow)
- 20+ viên: hiển thị "20+" thay vì count lớn

**Seeded Random** (để tránh lỗi React purity):
```typescript
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};
```

**Kích Thước:**
- `sm`: w-12 h-12 (stone radius 6px)
- `md`: w-16 h-16 (stone radius 8px)
- `lg`: w-24 h-24 (stone radius 10px)

---

### 5. ✅ 10 AVATAR MỚI

**Avatars hiện tại:**
```typescript
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
```

**Có thể thêm nhiều hơn bằng API `seed=XXX`**

---

## 📂 FILES THAY ĐỔI

| File | Thay Đổi |
|------|---------|
| `src/App.tsx` | +Timer, Stone, landscape responsive, 10 avatars |
| `src/components/Timer.tsx` | **NEW** - Countdown timer + progress bar |
| `src/components/Stone.tsx` | **NEW** - Visual stone component |
| `src/components/CardModal.tsx` | Card emoji + gradient colors + flip |
| `src/data/cards.ts` | +emoji, +color fields cho 17 cards |
| `src/App.css` | Landscape media queries |

---

## 🎮 TRẢI NGHIỆM CẢI THIỆN

### Desktop
```
[Avatar] [Turn Indicator + Timer] [Avatar]
   ↓
[Quan] [5x5 Grid với Stones] [Quan]
   ↓
[Card Modal với Emoji + Gradient]
```

### Mobile (Portrait)
```
[Avatar scaled down]
[Turn + Timer]
[Compact board]
```

### Mobile (Landscape)
```
[Avatar scale-90] [Timer] [Avatar scale-90]
[Quan w-16 h-32] [Grid gaps-1.5] [Quan]
```

---

## ⚙️ CẬP NHẬT LOGIC

### Timer Effect Management
```typescript
// Reset timer khi duration thay đổi
useEffect(() => {
  setRemaining(duration);
}, [duration]);

// Countdown interval
useEffect(() => {
  if (!isActive) return;
  const interval = setInterval(() => {
    setRemaining(prev => {
      if (prev <= 1) {
        onTimeout?.();
        return duration;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(interval);
}, [isActive, onTimeout, duration]);
```

### Stone Seeded Random
Để tránh React 18 StrictMode warning về impure functions:
```typescript
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};
```
→ Dùng seed từ `count + i` để có random nhưng deterministic

---

## 🎨 COLOR PALETTE CARDS

| Type | Gradient |
|------|----------|
| IMMEDIATE (Dùng ngay) | Bright (yellow, red, blue, green, etc.) |
| HOLD (Để dành) | Dark (red-500, yellow-500, purple-500, etc.) |

---

## 📊 RESPONSIVE BREAKPOINTS

```
Portrait:
- xs (< 480px): Phone nhỏ
- sm (480-640px): Phone
- md (640-768px): Tablet

Landscape:
- max-height: 600px: Compact (scale-90, gap-1.5)
- max-height: > 600px: Normal
```

---

## 🔧 CÒN CẢN LÀM

- [ ] **Quiz UI**: Câu hỏi thực tế cho Card 11, 14
- [ ] **Trap Placement**: UI chọn ô để đặt bẫy (Card 12, 13)
- [ ] **Custom Dice Animation**: 3D dice roll cho Card 15
- [ ] **Sound Effects**: Âm thanh cho mỗi action
- [ ] **Animations**: Card flip, stone drop, score pop
- [ ] **Leaderboard**: Top scores online
- [ ] **Chat**: P2P messaging via PeerJS

---

## 🚀 CHẠY NGAY

```bash
npm run dev
# http://localhost:5173
# Chọn landscape mode trên mobile!
```

---

**Version**: 2.0  
**Status**: ✅ Beta Ready  
**Cập nhật**: 28/01/2026

