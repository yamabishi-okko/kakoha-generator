# コメント行番号メモ

コメントを編集して行数がずれた場合、このファイルを見て以下の場所も合わせて更新する。

---

## ⭐️ 系（ページを開いたときの流れ）

| マーカー | 定義ファイル | 行番号 | README の読む順番の記載行 | 他ファイルからの参照 |
|---------|------------|-------|------------------------|-------------------|
| ⭐️① | `src/main.ts` | 2行目 | README 108行目 | `src/index.html` 48行目 |
| ⭐️② | `src/app/app.config.ts` | 2行目 | README 110行目 | `src/main.ts` 36行目 |
| ⭐️③ | `src/app/app.routes.ts` | 2行目 | README 111行目 | `src/app/app.config.ts` 25行目、`src/app/app.component.html` 45行目 |
| ⭐️④ | `src/app/app.component.ts` | 5行目 | README 112行目 | `src/app/app.config.ts` 26行目 |
| ⭐️⑤ | `src/app/app.component.ts` | 54行目 | README 113行目 | `src/app/app.component.ts` 26行目 |
| ⭐️⑥ | `src/app/app.component.html` | 2行目 | README 114行目 | `src/app/app.component.ts` 71行目 |
| ⭐️⑦ | `src/app/app.component.html` | 42行目 | README 115行目 | `src/app/app.component.html` 6・14行目、`src/app/app.routes.ts` 26行目 |
| ⭐️⑧ | `src/app/generator/generator.component.ts` | 6行目 | README 116行目 | `src/app/app.component.html` 53行目、`src/app/app.routes.ts` 30行目 |
| ※ | `src/app/generator/generator.component.html` | 2行目 | README 117行目 | — |

## 🌙 系（波変換ボタンを押したときの流れ・ローカルモード）

| マーカー | 定義ファイル | 行番号 | README の読む順番の記載行 | 他ファイルからの参照 |
|---------|------------|-------|------------------------|-------------------|
| 🌙① | `src/app/generator/generator.component.html` | 116行目 | README 123行目 | — |
| 🌙② | `src/app/generator/generator.component.ts` | 69行目 | README 124行目 | `src/app/generator/generator.component.html` 117行目、`src/app/wave.service.ts` 33行目 |
| 🌙③ | `src/app/wave.service.ts` | 29行目 | README 125行目 | `src/app/generator/generator.component.ts` 120行目 |
| 🌙④ | `src/app/wave.service.ts` | 53行目（ループ内）| README 126行目 | `src/app/wave.service.ts` 45行目 |
| 🌙⑤ | `src/app/wave.service.ts` | 68行目 | README 127行目 | `src/app/wave.service.ts` 59行目 |
| 🌙⑥ | `src/app/generator/generator.component.ts` | 123行目 | README 128行目 | `src/app/wave.service.ts` 47行目 |
| 🌙⑦ | `src/app/generator/generator.component.ts` | 126行目 | README 129行目 | — |
| 🌙⑧ | `src/app/generator/generator.component.html` | 136行目 | README 130行目 | — |

## 🪼 系（APIモードボタンを押したときの流れ）

| マーカー | 定義ファイル | 行番号 | README の読む順番の記載行 | 他ファイルからの参照 |
|---------|------------|-------|------------------------|-------------------|
| 🪼① | `src/app/generator/generator.component.html` | 85行目 | README 138行目 | `src/app/generator/generator.component.ts` 54行目（mode signal）、116行目 |
| 🪼② | `src/app/generator/generator.component.ts` | 69行目 | README 139行目 | `src/app/generator/generator.component.html` 117行目、`src/app/app.config.ts` 34行目（provideHttpClient） |
| 🪼③ | `src/app/generator/generator.component.ts` | 82行目 | README 140行目 | `src/app/generator/generator.component.ts` 41・74行目、`backend/routes/api.php` 14行目、`backend/app/Http/Controllers/WaveController.php` 22行目 |
| 🪼④ | `backend/app/Http/Controllers/WaveController.php` | 10行目（クラス）/ 29行目（メソッド） | README 141行目 | `src/app/generator/generator.component.ts` 106行目、`backend/app/Services/WaveService.php` 28行目 |
| 🪼⑤ | `backend/app/Services/WaveService.php` | 6行目（クラス）/ 26行目（メソッド） | README 142行目 | `backend/app/Http/Controllers/WaveController.php` 23・39・87行目 |
| 🪼⑥ | `backend/app/Http/Controllers/WaveController.php` | 94行目 | README 143行目 | `backend/app/Http/Controllers/WaveController.php` 24行目 |
| 🪼⑦ | `src/app/generator/generator.component.ts` | 111行目 | README 144行目 | — |
| 🪼⑧ | `src/app/generator/generator.component.html` | 136行目 | README 145行目 | `src/app/generator/generator.component.ts` 111行目 |

## ☁️ 系（Docker 起動の流れ）

| マーカー | 定義ファイル | 行番号 | README の読む順番の記載行 | 他ファイルからの参照 |
|---------|------------|-------|------------------------|-------------------|
| ☁️① | `docker-compose.yml` | 1行目 | README 190行目 | — |
| ☁️② | `docker-compose.yml` | 4行目 | README 191行目 | `Dockerfile`（build: . で参照） |
| ☁️③ | `docker-compose.yml` | 13行目 | README 195行目 | `backend/Dockerfile`（build: ./backend で参照） |
| ☁️④ | `docker-compose.yml` | 22行目 | README 201行目 | — |
| ☁️⑤ | `Dockerfile` | 1行目 | README 192行目 | `docker-compose.yml` 6行目（build: .） |
| ☁️⑥ | `Dockerfile` | 6行目 | README 193行目 | — |
| ☁️⑦ | `Dockerfile` | 15行目 | README 194行目 | — |
| ☁️⑧ | `backend/Dockerfile` | 1行目 | README 196行目 | `docker-compose.yml` 15行目（build: ./backend） |
| ☁️⑨ | `backend/Dockerfile` | 4行目 | README 197行目 | — |
| ☁️⑩ | `backend/Dockerfile` | 12行目 | README 198行目 | — |
| ☁️⑪ | `backend/Dockerfile` | 17行目 | README 199行目 | — |
| ☁️⑫ | `backend/Dockerfile` | 23行目 | README 200行目 | — |

---

## コメント更新時のチェック手順

1. コメントを編集したファイルの行番号がずれていないか確認
2. このファイルの該当行を grep で探す
3. 「他ファイルからの参照」列に書かれた場所を確認・更新
4. 「README の読む順番の記載行」を確認・更新
5. このファイル自体の行番号も更新する

## index.html の補足コメント（⭐️番号なし）

| 内容 | 行番号 | README の読む順番の記載行 |
|------|-------|------------------------|
| `<app-root>` の説明 | 11行目 | README 109行目 |
| `<script>` タグ注入の仕組み | 17行目 | — |
