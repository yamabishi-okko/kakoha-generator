# 過去はジェネレーター

```text
　過
　　去
　　　は
　　　　離
　　　　　れ
　　　　　　て
　　　　　　　行
　　　　　　　　き
　　　　　　　未
　　　　　　来
　　　　　は
　　　　近
　　　づ
　　く
　の
？
```

文字を縦に波打たせることができるジェネレーター。  
読み解きの勉強のため、フロントエンドにAngular、バックエンドにLaravel APIを使用。  
ブラウザ側で「ローカル処理」と「API処理」をラジオボタンで切り替えられる。

## 使い方

### 開発サーバーで起動（推奨）

Angular（フロントエンド）と Laravel（バックエンド）の2サーバーを起動します。

#### Angular フロントエンド（ポート4200）

```bash
npm install
ng serve
```

#### Laravel バックエンド（ポート8000）

```bash
cd backend
php artisan serve
```

→ <http://localhost:4200> を開く  
→ 画面の **PROCESSING MODE** で **LOCAL** / **API** を切り替えて使う

### ビルド済みファイルをローカルで動かす

`dist/kakoha-generator/browser/index.html` をブラウザで直接開いても動きません。  
Angular はブラウザのアドレスバーを制御する仕組み（History API）を使っており、  
`file://` プロトコルではその機能が動かないためです。  
ビルド済みファイルを動かすには簡易サーバーを使います。

```bash
npx serve dist/kakoha-generator/browser
```

→ <http://localhost:3000> を開く（`npx serve` が初回のみパッケージをダウンロードします）

## 機能

- テキストを入力して「EXECUTE WAVE GENERATION」を押す
- **PROCESSING MODE** でローカル処理 / API処理を切り替え
- **OSCILLATION AMPLITUDE**（横幅）をスライダーで調整
- **WAVE PATTERN** で波形を切り替え（〜 波 / ＞ 右上がり / ＜ 右下がり）
- 出力テキストをクリップボードにコピー

## ビルド

```bash
ng build
```

出力先: `dist/kakoha-generator/browser/`

## 技術スタック

- Angular 17+（Standalone Components、Signals、HttpClient）
- Laravel 13（API サーバー）
- 素のCSS

---

## コード読解ガイド

ソースコード内に `⭐️`・`🌙`・`🪼` の番号付きコメントが書かれています。

### コメントを読む順番

#### ページを開いたときの流れ（⭐️）

| 順番 | ファイル | 行番号 | 備考 |
| ---- | -------- | ------ | ---- |
| 1 | `src/main.ts` | 2行目 | ⭐️① |
| 2 | `src/index.html` | 11行目 | なぜ JS が実行されるのか仕組みを説明 |
| 3 | `src/app/app.config.ts` | 2行目 | ⭐️② |
| 4 | `src/app/app.routes.ts` | 2行目 | ⭐️③ |
| 5 | `src/app/app.component.ts` | 5行目 | ⭐️④ |
| 6 | `src/app/app.component.ts` | 54行目 | ⭐️⑤ |
| 7 | `src/app/app.component.html` | 2行目 | ⭐️⑥ |
| 8 | `src/app/app.component.html` | 42行目 | ⭐️⑦ |
| 9 | `src/app/generator/generator.component.ts` | 6行目 | ⭐️⑧ |
| 10 | `src/app/generator/generator.component.html` | 2行目 | テンプレートの記法一覧 |

#### 波変換ボタンを押したときの流れ・ローカルモード（🌙）

| 順番 | ファイル | 行番号 | 備考 |
| ---- | -------- | ------ | ---- |
| 1 | `src/app/generator/generator.component.html` | 116行目 | 🌙① |
| 2 | `src/app/generator/generator.component.ts` | 69行目 | 🌙② |
| 3 | `src/app/wave.service.ts` | 29行目 | 🌙③ |
| 4 | `src/app/wave.service.ts` | 53行目 | 🌙④ ループ処理 |
| 5 | `src/app/wave.service.ts` | 68行目 | 🌙⑤ indent 計算 |
| 6 | `src/app/generator/generator.component.ts` | 123行目 | 🌙⑥ |
| 7 | `src/app/generator/generator.component.ts` | 126行目 | 🌙⑦ |
| 8 | `src/app/generator/generator.component.html` | 136行目 | 🌙⑧ |

#### APIモードボタンを押したときの流れ（🪼）

> API通信の詳細（HTTPメソッド・ヘッダー・CORS・認証など）は [`backend/README.md`](backend/README.md) を参照。

| 順番 | ファイル | 行番号 | 備考 |
| ---- | -------- | ------ | ---- |
| 1 | `src/app/generator/generator.component.html` | 85行目 | 🪼① ラジオボタン |
| 2 | `src/app/generator/generator.component.ts` | 69行目 | 🪼② |
| 3 | `src/app/generator/generator.component.ts` | 82行目 | 🪼③ HTTP リクエスト送信 |
| 4 | `backend/app/Http/Controllers/WaveController.php` | 10行目 | 🪼④ |
| 5 | `backend/app/Services/WaveService.php` | 26行目 | 🪼⑤ |
| 6 | `backend/app/Http/Controllers/WaveController.php` | 94行目 | 🪼⑥ JSON レスポンス |
| 7 | `src/app/generator/generator.component.ts` | 111行目 | 🪼⑦ |
| 8 | `src/app/generator/generator.component.html` | 136行目 | 🪼⑧ |

### ページを開いたときの実行順序（⭐️）

| 番号 | ファイル | 何が起きるか |
| ---- | -------- | ------------ |
| ⭐️① | `src/main.ts` | `bootstrapApplication()` が実行され Angular が起動する。第1引数に表示するコンポーネント、第2引数にアプリ全体の設定を渡す |
| ⭐️② | `src/app/app.config.ts` | `appConfig` の中身が読み取られ、ルーター・HttpClient などの道具が準備される |
| ⭐️③ | `src/app/app.routes.ts` | 「このURLならこのコンポーネントを表示する」という対応表（routes 配列）がルーターに登録される |
| ⭐️④ | `src/app/app.component.ts` | Angular が AppComponent の実物（インスタンス）を1つ作り、`index.html` の `<app-root>` タグと紐づける |
| ⭐️⑤ | `src/app/app.component.ts` | Angular が `ngOnInit()` を自動で呼び出し、ヘッダーの数値をランダムに変動させるタイマーが起動する |
| ⭐️⑥ | `src/app/app.component.html` | `app.component.html` の内容が `<app-root>` の中に描画され、ヘッダーとフッターが画面に表示される |
| ⭐️⑦ | `src/app/app.component.html` | `<router-outlet>` が現在の URL を確認し、対応するコンポーネントの HTML をその位置に差し込む |
| ⭐️⑧ | `src/app/generator/generator.component.ts` | ルートURL（`/`）のため Angular Router が GeneratorComponent の実物を作り、テンプレートが描画される |

### 波変換ボタンを押したときの実行順序・ローカルモード（🌙）

| 番号 | ファイル | 何が起きるか |
| ---- | -------- | ------------ |
| 🌙① | `src/app/generator/generator.component.html` | ボタンの `(click)` イベントが発火し、Angular が `generate()` を呼び出す |
| 🌙② | `src/app/generator/generator.component.ts` | `generate()` が入力テキストの有無・モードを確認し、ローカルモードなので WaveService に変換処理を依頼する |
| 🌙③ | `src/app/wave.service.ts` | `WaveService.generate()` がテキスト・振れ幅・波形の種類を受け取り、変換処理を開始する |
| 🌙④ | `src/app/wave.service.ts` | テキストを1文字ずつループし、各文字の前に波形に応じた全角スペースを付けて行を積み上げる |
| 🌙⑤ | `src/app/wave.service.ts` | `indent()` が文字の位置と波形の種類から全角スペースを何個付けるかを計算して返す |
| 🌙⑥ | `src/app/generator/generator.component.ts` | `output.set(result)` で変換結果を signal に保存する。signal が更新されると画面が自動で再描画される |
| 🌙⑦ | `src/app/generator/generator.component.ts` | 処理した文字数（`charCount`）と処理状態（`status`）を更新する |
| 🌙⑧ | `src/app/generator/generator.component.html` | `output` signal の更新を Angular が検知し、OUTPUT STREAM エリアに変換結果が表示される |

### APIモードボタンを押したときの実行順序（🪼）

| 番号 | ファイル | 何が起きるか |
| ---- | -------- | ------------ |
| 🪼① | `src/app/generator/generator.component.html` | ラジオボタンで API モードを選択。ボタン押下で `generate()` が発火する |
| 🪼② | `src/app/generator/generator.component.ts` | `mode === 'api'` を確認し、HTTP リクエストを送信する処理に分岐する |
| 🪼③ | `src/app/generator/generator.component.ts` | `HttpClient.post()` で `localhost:8000/api/generate` にリクエストを投げる |
| 🪼④ | `backend/app/Http/Controllers/WaveController.php` | Laravel がリクエストを受け取り、バリデーション後に WaveService に処理を委ねる |
| 🪼⑤ | `backend/app/Services/WaveService.php` | 波形生成ロジックが実行され、インデント付きテキストが組み立てられる |
| 🪼⑥ | `backend/app/Http/Controllers/WaveController.php` | 変換結果を `{ "result": "..." }` の JSON にして返す |
| 🪼⑦ | `src/app/generator/generator.component.ts` | `subscribe()` でレスポンスを受け取り、`output.set()` で結果を signal に保存する |
| 🪼⑧ | `src/app/generator/generator.component.html` | signal の更新を Angular が検知し、OUTPUT STREAM エリアに変換結果が表示される |
