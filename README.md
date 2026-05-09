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
読み解きの勉強のためAngularを使用。

## 使い方

### 開発サーバーで起動（推奨）

```bash
npm install
ng serve
```

→ <http://localhost:4200> を開く

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
- **OSCILLATION AMPLITUDE**（横幅）をスライダーで調整
- **WAVE PATTERN** で波形を切り替え（〜 波 / ＞ 右上がり / ＜ 右下がり）
- 出力テキストをクリップボードにコピー

## ビルド

```bash
ng build
```

出力先: `dist/kakoha-generator/browser/`

## 技術スタック

- Angular 17+（Standalone Components、Signals）
- 素のCSS

---

## コード読解ガイド

ソースコード内に `⭐️` と `🌙` の番号付きコメントが書かれています。

### コメントを読む順番

#### ページを開いたときの流れ（⭐️）

① `src/main.ts` の **2行目**
② `src/index.html` の **11行目**（なぜ JS が実行されるのか仕組みを説明）
③ `src/app/app.config.ts` の **2行目**
④ `src/app/app.routes.ts` の **2行目**
⑤ `src/app/app.component.ts` の **5行目**（⭐️④）
⑥ `src/app/app.component.ts` の **54行目**（⭐️⑤）
⑦ `src/app/app.component.html` の **2行目**（⭐️⑥）
⑧ `src/app/app.component.html` の **42行目**（⭐️⑦）
⑨ `src/app/generator/generator.component.ts` の **5行目**（⭐️⑧）
⑩ `src/app/generator/generator.component.html` の **2行目**（テンプレートの記法一覧）

#### 波変換ボタンを押したときの流れ（🌙）

① `src/app/generator/generator.component.html` の **85行目**（🌙①）
② `src/app/generator/generator.component.ts` の **62行目**（🌙②）
③ `src/app/wave.service.ts` の **29行目**（🌙③）
④ `src/app/wave.service.ts` の **53行目**（🌙④ ループ処理）
⑤ `src/app/wave.service.ts` の **68行目**（🌙⑤ indent 計算）
⑥ `src/app/generator/generator.component.ts` の **84行目**（🌙⑥）
⑦ `src/app/generator/generator.component.ts` の **87行目**（🌙⑦）
⑧ `src/app/generator/generator.component.html` の **110行目**（🌙⑧）

### ページを開いたときの実行順序（⭐️）

| 番号 | ファイル | 何が起きるか |
| ---- | -------- | ------------ |
| ⭐️① | `src/main.ts` | `bootstrapApplication()` が実行され Angular が起動する。第1引数に表示するコンポーネント、第2引数にアプリ全体の設定を渡す |
| ⭐️② | `src/app/app.config.ts` | `appConfig` の中身が読み取られ、ルーター（URL に応じて画面を切り替える仕組み）などの道具が準備される |
| ⭐️③ | `src/app/app.routes.ts` | 「このURLならこのコンポーネントを表示する」という対応表（routes 配列）がルーターに登録される |
| ⭐️④ | `src/app/app.component.ts` | Angular が AppComponent の実物（インスタンス）を1つ作り、`index.html` の `<app-root>` タグと紐づける |
| ⭐️⑤ | `src/app/app.component.ts` | Angular が `ngOnInit()` を自動で呼び出し、ヘッダーの数値をランダムに変動させるタイマーが起動する |
| ⭐️⑥ | `src/app/app.component.html` | `app.component.html` の内容が `<app-root>` の中に描画され、ヘッダーとフッターが画面に表示される |
| ⭐️⑦ | `src/app/app.component.html` | `<router-outlet>` が現在の URL を確認し、対応するコンポーネントの HTML をその位置に差し込む |
| ⭐️⑧ | `src/app/generator/generator.component.ts` | ルートURL（`/`）のため Angular Router が GeneratorComponent の実物を作り、テンプレートが描画される |

### 波変換ボタンを押したときの実行順序（🌙）

| 番号 | ファイル | 何が起きるか |
| ---- | -------- | ------------ |
| 🌙① | `src/app/generator/generator.component.html` | ボタンの `(click)` イベントが発火し、Angular が `generate()` を呼び出す |
| 🌙② | `src/app/generator/generator.component.ts` | `generate()` が入力テキストの有無を確認し、WaveService に変換処理を依頼する |
| 🌙③ | `src/app/wave.service.ts` | `WaveService.generate()` がテキスト・振れ幅・波形の種類を受け取り、変換処理を開始する |
| 🌙④ | `src/app/wave.service.ts` | テキストを1文字ずつループし、各文字の前に波形に応じた全角スペースを付けて行を積み上げる |
| 🌙⑤ | `src/app/wave.service.ts` | `indent()` が文字の位置と波形の種類から全角スペースを何個付けるかを計算して返す |
| 🌙⑥ | `src/app/generator/generator.component.ts` | `output.set(result)` で変換結果を signal に保存する。signal が更新されると画面が自動で再描画される |
| 🌙⑦ | `src/app/generator/generator.component.ts` | 処理した文字数（`charCount`）と処理状態（`status`）を更新する |
| 🌙⑧ | `src/app/generator/generator.component.html` | `output` signal の更新を Angular が検知し、OUTPUT STREAM エリアに変換結果が表示される |
