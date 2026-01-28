# 📱 HƯỚNG DẪN CHƠI LANDSCAPE (Mobile)

## 🎮 TẠI SAO LANDSCAPE?

Bàn cờ Ăn Quan **rất dài ngang** (12 ô + 2 Quan).  
**Portrait mode** sẽ rất bé và khó nhìn.  
**Landscape mode** làm cho game dễ chơi hơn rất nhiều!

---

## 📐 CÁC BƯỚC

### 1. MỞ GAME TRÊN ĐIỆN THOẠI
- URL: `http://localhost:5173` (hoặc domain của bạn)
- Hoặc scan QR code

### 2. XỐ NGANG ĐIỆN THOẠI
```
Trước: │Dọc - Nhìn bé│   →   Sau: ├─ Ngang - Full width ─┤
```

### 3. GAME TỰ ĐỘNG RESPONSIVE
- Header: Avatar nhỏ, gap giảm
- Board: Gap 6px (thay vì 16px)
- Stones: Hiển thị rõ hơn
- Timer: Vẫn visible ở giữa

### 4. CHƠI BÌNH THƯỜNG
- Bấm ô để rải đá
- Tap card để xác nhận
- Game tự động sync với đối thủ

---

## 🔧 VẬN HÀNH TRÊN LANDSCAPE

### Header
```
[Avatar scale-90] [⏱️ 15s] [Avatar scale-90]
```
- Avatar nhỏ hơn để tiết kiệm không gian
- Timer ở giữa vẫn dễ nhìn
- Scoreboard nhỏ (P1: 5đ, P2: 3đ)

### Board
```
[Quan] [5x5 grid gaps-1.5] [Quan]
```
- Gaps giữa ô: 6px (compact)
- Ô nhỏ hơn: 56px × 56px (thay vì 96px)
- Stones vẫn rõ
- Scroll nếu quá cao (max-height: 70vh)

### Card Modal
```
[Emoji + Gradient full width]
```
- Phủ kín màn hình
- Dễ nhìn và bấm xác nhận

---

## 💡 MẸO

### Tốc độ Game
Landscape mode gia tăng tốc độ gameplay vì:
- ✅ Bàn cờ chiếm toàn màn hình
- ✅ Ngón tay dễ tap ô
- ✅ Timer hiển thị rõ ràng

### Chơi Lâu
Nếu chơi lâu:
- Xoay sang landscape
- Dễ chơi hơn 3x
- Ít mỏi mắt hơn

### Network
Landscape mode **không ảnh hưởng** đến:
- Kết nối P2P
- Đồng bộ game
- Nhận card
→ Chỉ là visual thôi!

---

## 🎯 RECOMMENDED DEVICES

| Device | Mode | Experience |
|--------|------|-------------|
| Phone 6.7" | Landscape | ⭐⭐⭐⭐⭐ Best |
| Phone 6.1" | Landscape | ⭐⭐⭐⭐ Good |
| Phone 5.4" | Landscape | ⭐⭐⭐ OK |
| Tablet | Landscape | ⭐⭐⭐⭐⭐ Best |
| Desktop | Any | ⭐⭐⭐⭐⭐ Best |

---

## 🚨 TROUBLESHOOTING

### "Game không rotate?"
- **Solution**: Kiểm tra cài đặt device
- Mở Settings > Display > Rotation > ON

### "Board quá bé?"
- **Solution**: Device quá nhỏ?
- Dùng tablet hoặc phone > 6"

### "Bị lag?"
- **Solution**: Restart browser
- Hoặc dùng device mới hơn

### "Không thấy timer?"
- **Solution**: Scroll lên xem header

---

## 📊 RESPONSIVE BREAKDOWN

```
PORTRAIT (Dọc)
- xs (< 480px): Phone nhỏ
- sm (480-640px): Phone vừa
- Unreadable: Board quá nhỏ

LANDSCAPE (Ngang)  ← RECOMMENDED
- max-height: 600px: Compact scale-90
- max-height: 600px+: Normal
- Readable: Board full width
```

---

## 🎮 EXAMPLE GAMEPLAY

```
1. MỞ LANDSCAPE
   [Xoay ngang điện thoại]

2. LOBBY
   [Chọn avatar từ 10 options]
   [Nhập tên]
   [TẠO PHÒNG hoặc VÀO]

3. CHƠI
   [P1 turn]
   ⏱️ 30s countdown
   [Tap ô 3]
   [Rải đá animation]
   [Có card → Bấm xác nhận]
   [Chuyển lượt P2]
   [P2 turn...]

4. KẾT THÚC
   [Board trống]
   [Kết quả: P1 120 - P2 85]
   [CHƠI LẠI]
```

---

## 💾 LƯU Ý

- **Landscape detection**: Automatic
- **No manual setting needed**: Game tự detect orientation
- **Switch anytime**: Xoay device → UI auto adjust

---

**Tip:** Chơi landscape = Better UX + Better Gaming! 🎮

**Made for Vietnamese Players • 2026**
