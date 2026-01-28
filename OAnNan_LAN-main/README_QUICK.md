# 🎮 ỚAN QUAN LAN EDITION

**Chơi Ăn Quan online P2P trên Mobile + Desktop với Timer, Visual Cards & Stone Graphics**

## 🚀 QUICK START

### Tạo Phòng (P1)
1. Mở http://localhost:5173
2. Nhập tên + chọn avatar
3. Bấm "TẠO PHÒNG"
4. Copy ID hiển thị

### Vào Phòng (P2)
1. Nhập tên + chọn avatar
2. Paste ID từ P1 vào ô "ID phòng"
3. Bấm "VÀO"

## 📱 CHƠI LANDSCAPE!
**Game này tốt nhất trên landscape mode (xoay ngang)**
- Bàn cờ rộng hơn, dễ thao tác
- Tự động responsive trên mobile

## ✨ TÍNH NĂNG

✅ **P2P Online** - Chơi trực tiếp qua PeerJS (không server)  
✅ **17 Cards** - Hệ thống thẻ chức năng phức tạp  
✅ **Timer** - 30s/lượt + progress bar  
✅ **Visual Stones** - Viên sỏi thay con số  
✅ **Emoji Cards** - Từng lá bài có icon riêng  
✅ **10 Avatars** - Lựa chọn nhân vật  
✅ **Mobile Responsive** - Portrait + Landscape  

## 🎴 CARD RULES

### IMMEDIATE (11 lá)
| Card | Tên | Effect |
|------|-----|--------|
| 1 | NGON THÍIII | X2 ô cuối ăn |
| 2 | PHÁ LÀNG | -4 điểm |
| 3 | THÊM LƯỢT | +1 lượt |
| 4 | CHĂM HỌC | +2 điểm |
| 5 | MẤT LƯỢT | Mất 1 lượt |
| 6 | RẢI ĐỀU 5 | Đối phương rải 5 đá |
| 7 | HỒI QUAN | Lấy Quan đối phương |
| 8 | LƯỜI HỌC | -3 điểm |
| 9 | NGHÈO VƯỢT | +5 điểm |
| 10 | ĂN KẾ TIẾP | Ăn ô tiếp theo |
| 11 | THI TRẠNG | Quiz ±3 |

### HOLD (6 lá)
| Card | Tên | Effect |
|------|-----|--------|
| 12 | ÔI THÔI | Bẫy -5 |
| 13 | MÀI CHỚT | Bẫy -3 |
| 14 | CÂU HỎI | Quiz hoặc Lật Kèo |
| 15 | LẬT KÈO | Lắc 3 lần: >11 đổi kho |
| 16 | ĐẬU TÚ | Rải 5 đá |
| 17 | STOP | Block card đối |

## 📚 HƯỚNG DẪN

- [GAME_RULES.md](./GAME_RULES.md) - Quy luật chi tiết 17 card
- [DEVELOPER.md](./DEVELOPER.md) - Hướng dẫn code cho dev
- [CHANGELOG_v2.md](./CHANGELOG_v2.md) - Chi tiết v2.0 update

## 🛠️ TECH STACK

- **React 19** + TypeScript
- **PeerJS 1.5** - P2P connection
- **Tailwind CSS 4** - Styling
- **Vite 7** - Build tool

## 📦 CÀI ĐẶT

```bash
npm install
npm run dev
# http://localhost:5173
```

## 🌐 DEPLOY

```bash
npm run build
# dist/ → Upload to Vercel / Netlify / Cloudflare Pages
```

## 🎯 ROADMAP

- [ ] Quiz UI cho Card 11, 14
- [ ] Trap placement UI
- [ ] Sound effects
- [ ] Animations & transitions
- [ ] Leaderboard
- [ ] Chat P2P

## 📞 SUPPORT

Gặp lỗi kết nối? Kiểm tra:
- ID có chính xác không?
- Internet connection OK?
- Browser có mới không?

## 📄 LICENSE

MIT - Tự do sử dụng & chỉnh sửa

---

**Made with ❤️ for Vietnamese Game Lovers**  
**Version 2.0 • Landscape Ready • 2026**
