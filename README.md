# かこはジェネレーター

```
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

### ローカルで直接開く

```
dist/kakoha-generator/browser/index.html
```

をブラウザで開くだけで使えます。

### 開発サーバーで起動

```bash
npm install
ng serve
```

→ http://localhost:4200 を開く

## 機能

- テキストを入力して「EXECUTE WAVE GENERATION」を押す
- **OSCILLATION AMPLITUDE**（横幅）をスライダーで調整
- **WAVE PATTERN** で波形を切り替え（〜 波 / ＞ 右上がり / ＜ 右下がり）
- 出力テキストをクリップボードにコピー

## ビルド

```bash
ng build --base-href ./
```

出力先: `dist/kakoha-generator/browser/`

## 技術スタック

- Angular 17+（Standalone Components、Signals）
- 素のCSS
