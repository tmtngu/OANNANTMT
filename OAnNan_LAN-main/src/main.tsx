/* 1. NẠP CÔNG CỤ LÀM GAME (REACT) */
import React from 'react'
import ReactDOM from 'react-dom/client'

/* 2. NHẬP NỘI DUNG GAME VÀ GIAO DIỆN */
import App from './App.tsx'
import './index.css'

/* 3. KÍCH HOẠT GAME LÊN MÀN HÌNH */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)