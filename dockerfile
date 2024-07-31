# 使用 Node.js 作為基礎映像
FROM node:22.5.1

# 設定工作目錄
WORKDIR /app

# 複製 .env 檔案
COPY .env ./

# 複製 frontend 和 backend 資料夾
COPY frontend ./frontend
COPY backend ./backend

# 進入 frontend 資料夾並安裝依賴與建置
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# 進入 backend 資料夾並安裝依賴與建置
WORKDIR /app/backend
RUN npm install
RUN npm run build

# 指定容器啟動時要執行的指令
CMD ["node", "dist/main.js"]