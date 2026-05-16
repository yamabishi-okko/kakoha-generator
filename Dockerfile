# ☁️⑤ Node.js 22（Alpine Linux）を土台にする。Alpine は軽量な Linux ディストリビューション
FROM node:22-alpine

WORKDIR /app

# ☁️⑥ package.json を先にコピーして npm install する
# ソースより先に分けておくと、ソース変更時に npm install のレイヤーキャッシュが効いてビルドが速くなる
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

# ☁️⑦ コンテナ起動時に ng serve を実行する
# --host 0.0.0.0：コンテナ外（ホストMac）からアクセスできるようにする
# --poll=500：Docker のファイルシステム経由でもソース変更を検知できるようにする（単位はミリ秒）
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll=500"]
