import React, { useState } from 'react';

const Instructions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const rules = [
    {
      title: "👥 Mục đích trò chơi",
      content: "Là một trò chơi truyền thống của Việt Nam được biến thể để vừa giữa được giá trị truyền thống vừa thu hút các bạn trẻ, Ô Ăn Năn được chơi bởi 2 người với 12 ô và 2 kho. Mục tiêu là thu thập được nhiều điểm nhất."
    },
    {
      title: "🎯 Cách chơi cơ bản",
      content: "Mỗi người sẽ lần lượt rải đá từ một ô, đá sẽ được rải sang các ô liền kề theo chiều. Nếu ô cuối cùng rơi vào ô của bạn, bạn được ăn những ô từ ô đó trở lại cho đến khi gặp ô trống."
    },
    {
      title: "💎 Thẻ chức năng",
      content: "Có 16 loại thẻ chia thành 2 loại: DÙNG NGAY (10 loại) và CÓ THỂ ĐỂ DÀNH (6 loại). Mỗi thẻ có tác dụng riêng như cộng/trừ điểm, thêm lượt, đặt bẫy, v.v."
    },
    {
      title: "⚡ DÙNG NGAY",
      content: "Những thẻ này có tác dụng ngay khi bốc được, bao gồm: Ngon Thíiii, Hồng Nhan Bạc Phận, Còn Gì Đẹp Hơn, Vì Em Xứng Đáng, Xa Cà Nu, Rụng Đá, Cướp Quan, Em Bị Trừ 3 Điểm Thanh Lịch, Phiếu Bé Ngoan, Ăn Bất Chấp."
    },
    {
      title: "🎁 CÓ THỂ ĐỂ DÀNH",
      content: "Những thẻ này có thể giữ lại và sử dụng sau: Ôi Thôi Chớttt, Mài Chớt Chưa Con, Cơ Hội Lật Kèo, Được Ăn Cả Ngã Thì Thua, Nước Đi Hay Đấy, Dừng Cái Tay Hư Lại."
    },
    {
      title: "⏱️ Thời gian và lượt",
      content: "Mỗi người chơi có 30 giây để thực hiện lượt của mình. Nếu hết thời gian, lượt sẽ tự động chuyển sang người chơi khác."
    },
    {
      title: "🏆 Chiến thắng",
      content: "Trò chơi kết thúc khi bộ đếm đạt đủ lượt (thường là vài lượt). Người chơi có điểm cao nhất là người chiến thắng!"
    }
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 lg:bottom-8 right-4 sm:right-6 lg:right-8 z-40">
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-16 sm:bottom-20 right-0 w-80 sm:w-96 bg-white rounded-[20px] sm:rounded-[30px] shadow-2xl border-4 sm:border-6 border-amber-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-4 sm:p-6 text-white">
            <h2 className="text-xl sm:text-2xl font-black">📖 CÁCH CHƠI</h2>
            <p className="text-xs sm:text-sm opacity-90 mt-1">Hướng dẫn chi tiết Ô Ăn Năn</p>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 bg-gradient-to-b from-white to-amber-50">
            {rules.map((rule, idx) => (
              <div key={idx} className="border-l-4 border-amber-600 pl-3 sm:pl-4">
                <h3 className="font-black text-sm sm:text-base text-amber-900 mb-1 sm:mb-2">
                  {rule.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {rule.content}
                </p>
              </div>
            ))}

            {/* Tips */}
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 sm:p-4 mt-4 sm:mt-5">
              <h3 className="font-black text-sm text-yellow-900 mb-2">💡 Mẹo chơi</h3>
              <ul className="text-xs sm:text-sm text-yellow-900 space-y-1">
                <li>• Đặt bẫy ở các vị trí chiến lược</li>
                <li>• Quản lý thẻ giữ lại một cách thông minh</li>
                <li>• Chú ý đến lượt của đối phương</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-amber-100 p-2 sm:p-3 text-center border-t border-amber-300">
            <p className="text-[10px] sm:text-xs font-black text-amber-900 uppercase">
              Ô Ăn Năn - Lấy cảm hứng từ "Ô Ăn Quan" trò chơi truyền thống Việt Nam
            </p>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24
          rounded-full
          flex items-center justify-center
          font-black text-2xl sm:text-3xl lg:text-4xl
          shadow-xl
          transition-all
          active:scale-90
          ${isOpen 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-amber-600 hover:bg-amber-700 text-white hover:scale-110'
          }
        `}
        title="Cách chơi"
      >
        {isOpen ? '✕' : '?'}
      </button>
    </div>
  );
};

export default Instructions;
