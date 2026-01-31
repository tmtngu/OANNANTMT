/*Nạp thư viện react*/
import React from 'react'
/*Đưa các thành phần React hiển thị lên trình duyệt*/
import ReactDOM from 'react-dom/client'
/*Nhập thành phần chính của ứng dụng. Mọi logic trò chơi, bàn cờ, và quân cờ*/
import App from './App.tsx'
/*Kết nối file CSS (chứa hiệu ứng màu nền và nút bấm*/
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)