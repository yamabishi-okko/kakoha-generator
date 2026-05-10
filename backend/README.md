# バックエンド API 通信ガイド

このディレクトリは Laravel で作った API サーバーです。  
このドキュメントは「ブラウザでAPIモードを選んで EXECUTE を押したとき、裏で何が起きているのか」を一歩ずつ解説します。

---

## 全体の流れ（ざっくり）

```text
┌──────────────────┐         ①リクエスト送信          ┌───────────────────┐
│                  │  ───────────────────────────▶   │                   │
│  ブラウザ        │  POST /api/generate              │  Laravel サーバー │
│ (Angular)        │  Body: { text, width, shape }    │  (localhost:8000) │
│ localhost:4200   │                                  │                   │
│                  │  ◀───────────────────────────    │                   │
│                  │     ②JSON レスポンス             │                   │
│                  │  { "result": "..." }             │                   │
└──────────────────┘                                  └───────────────────┘
```

ブラウザは「お願い」をHTTPリクエストにしてサーバーに送り、  
サーバーは「結果」をJSONで返します。これがAPI通信の基本です。

---

## ① ブラウザがリクエストを送るところ

### コード（Angular 側）

```ts
this.http.post<{ result: string }>(
  'http://localhost:8000/api/generate',
  { text: this.inputText(), width: this.width(), shape: this.shape() }
).subscribe(response => {
  this.output.set(response.result);
});
```

このコードがブラウザの中で実際に送信する HTTP リクエストは下記です。

### 実際に送られるHTTPリクエスト

```http
POST /api/generate HTTP/1.1
Host: localhost:8000
Origin: http://localhost:4200
Referer: http://localhost:4200/
Content-Type: application/json
Accept: application/json, text/plain, */*
Accept-Language: ja
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-site
Content-Length: 47

{"text":"あいうえお","width":4,"shape":"wave"}
```

これを部品ごとに分解して見ていきます。

---

## ② リクエストの中身を分解する

### リクエストライン（最初の1行）

```http
POST /api/generate HTTP/1.1
```

| 部品           | 値                  | 意味                                                                  |
| -------------- | ------------------- | --------------------------------------------------------------------- |
| HTTPメソッド   | `POST`              | サーバーに「データを送って処理してほしい」と頼むときに使う動詞        |
| パス           | `/api/generate`     | サーバー内のどのエンドポイントを呼ぶか                                |
| HTTPバージョン | `HTTP/1.1`          | 通信ルールのバージョン（ブラウザが自動で決める）                      |

#### HTTPメソッドの種類

| メソッド | 用途                                       | 今回使ってる？ |
| -------- | ------------------------------------------ | -------------- |
| `GET`    | データを取得する（読み取り専用）           | いいえ         |
| `POST`   | データを送って何かを作る・処理する         | **はい**       |
| `PUT`    | データを丸ごと置き換える                   | いいえ         |
| `PATCH`  | データの一部を更新する                     | いいえ         |
| `DELETE` | データを削除する                           | いいえ         |

なぜ `POST` を使うのか？  
→ 入力テキストや波形パラメータをサーバーに「送る」ため。`GET` でも値は送れますが、URL に文字列を載せることになり、長文や日本語に向きません。`POST` はリクエストの「ボディ」に値を入れて送れるのでこちらを使っています。

---

### リクエストヘッダー（情報のメタデータ）

ヘッダーは「リクエストに付ける送り状」のようなもの。本文（Body）とは別に、追加情報を伝えます。

| ヘッダー名         | 値                                  | 役割                                                                                                                                  |
| ------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `Host`             | `localhost:8000`                    | リクエスト先のドメイン:ポート                                                                                                         |
| `Origin`           | `http://localhost:4200`             | リクエストを送った「出元」のオリジン。ブラウザが自動で付ける。**CORS 判定の主役**。                                                   |
| `Referer`          | `http://localhost:4200/`            | どのページからこのリクエストが飛んだか（フルURL）。アクセス解析・不正な送信元の検出に使われる。                                       |
| `Content-Type`     | `application/json`                  | ボディの形式。「中身は JSON です」と宣言する。                                                                                        |
| `Accept`           | `application/json, text/plain, */*` | レスポンスとして受け取りたい形式の希望リスト。Angular の HttpClient はデフォルトで JSON を希望する。                                  |
| `Accept-Language`  | `ja`                                | 受け取りたい言語の希望（多言語対応のサーバー向け）                                                                                    |
| `Sec-Fetch-Mode`   | `cors`                              | クロスオリジン通信であることをブラウザが自動で宣言                                                                                    |
| `Sec-Fetch-Site`   | `same-site`                         | 同一サイトか別サイトか                                                                                                                |
| `Content-Length`   | `47`                                | ボディのバイト数                                                                                                                      |
| `Authorization`    | （今回は無し）                      | 認証トークンを載せるヘッダー。後述。                                                                                                  |

#### `Origin` と `Referer` の違い

似ていますが用途が違います。

| 項目         | `Origin`                                 | `Referer`                                    |
| ------------ | ---------------------------------------- | -------------------------------------------- |
| 含まれる情報 | スキーム + ドメイン + ポート             | スキーム + ドメイン + ポート + パス          |
| 例           | `http://localhost:4200`                  | `http://localhost:4200/generator?id=42`      |
| 主な用途     | CORS（許可するサイトの判定）             | アクセス解析・不正アクセス検知               |
| 削除可能か   | プライバシー設定で消されることはほぼない | ブラウザ設定や HTTPS→HTTP で消えることがある |

**今回のCORSの判定は `Origin` を見て行っている**点を覚えておきましょう。

---

### リクエストボディ（本文）

```json
{"text":"あいうえお","width":4,"shape":"wave"}
```

`Content-Type: application/json` と一緒に送ると、サーバー側で自動で JSON としてパースされます。  
Laravel の `$request->validate()` や `$request->input('text')` でこれらの値を取り出せます。

---

## ③ サーバー側で起きること

リクエストが Laravel に届いてから、レスポンスが返るまでの順番です。

```text
リクエスト到着
     ↓
[1] ルーティング        routes/api.php
     ↓
[2] ミドルウェア        bootstrap/app.php
     ├─ HandleCors      Origin をチェックして CORS ヘッダー付与
     └─ その他標準MW    ボディJSON のパースなど
     ↓
[3] コントローラー      app/Http/Controllers/WaveController.php
     ├─ バリデーション  $request->validate()
     └─ サービス呼び出し
     ↓
[4] サービス            app/Services/WaveService.php
     └─ 波形変換ロジック実行
     ↓
[5] レスポンス組み立て  response()->json([...])
     ↓
[6] ミドルウェア（戻り）レスポンスにCORSヘッダーを付ける
     ↓
レスポンス送信
```

### [1] ルーティング — `routes/api.php`

```php
Route::post('generate', [WaveController::class, 'generate']);
```

「`POST /api/generate` が来たら `WaveController::generate()` を呼んで」という対応表。  
`/api` プレフィックスは `bootstrap/app.php` で付けています。

### [2] ミドルウェア — `bootstrap/app.php`

```php
$middleware->api(prepend: [
    \Illuminate\Http\Middleware\HandleCors::class,
]);
```

ミドルウェアは「リクエストとコントローラーの間に立つ門番」。  
`HandleCors` が Origin をチェックし、許可されたオリジンならレスポンスに CORS ヘッダーを付けます。

### [3] コントローラー — `WaveController::generate()`

```php
$validated = $request->validate([
    'text'  => ['required', 'string'],
    'width' => ['required', 'integer', 'min:2', 'max:20'],
    'shape' => ['required', 'string', 'in:wave,right,left'],
]);

$result = $this->waveService->generate(...);

return response()->json(['result' => $result]);
```

バリデーション → サービスに処理を委譲 → JSON で返す、という流れ。

### [4] サービス — `WaveService::generate()`

文字を1文字ずつループして全角スペースを足していきます。  
ロジック詳細は Angular 側の `wave.service.ts` と同じ。

### [5] レスポンス組み立て

`response()->json([...])` が下記の HTTP レスポンスを生成します。

---

## ④ レスポンスの中身

### 実際に返るHTTPレスポンス

```http
HTTP/1.1 200 OK
Date: Sun, 10 May 2026 12:00:00 GMT
Server: PHP/8.5.6
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:4200
Vary: Origin
Content-Length: 80

{"result":"あ\n　い\n　　う\n　　　え\n　　　　お"}
```

### ステータスライン

```http
HTTP/1.1 200 OK
```

| ステータスコード         | 意味                                  | このAPIで起きるとき                       |
| ------------------------ | ------------------------------------- | ----------------------------------------- |
| `200 OK`                 | 成功                                  | 正常なリクエスト                          |
| `204 No Content`         | 成功・本文なし                        | CORSプリフライトの応答                    |
| `404 Not Found`          | URLが存在しない                       | `/api/wrong` などタイポ                   |
| `405 Method Not Allowed` | メソッドが違う                        | `GET /api/generate` で叩いた              |
| `422 Unprocessable…`     | バリデーション失敗                    | `width: 100` など不正な値                 |
| `500 Internal Server…`   | サーバー側でエラー発生                | コードのバグ                              |

### レスポンスヘッダー

| ヘッダー                      | 値                       | 役割                                                                       |
| ----------------------------- | ------------------------ | -------------------------------------------------------------------------- |
| `Content-Type`                | `application/json`       | ボディの形式                                                               |
| `Access-Control-Allow-Origin` | `http://localhost:4200`  | このオリジンからのアクセスを許可する宣言（CORS）                           |
| `Vary`                        | `Origin`                 | キャッシュは Origin ごとに分けてね、というキャッシュ制御の指示             |

### レスポンスボディ

```json
{"result":"あ\n　い\n　　う\n　　　え\n　　　　お"}
```

JSON で `result` というキーに変換結果の文字列が入っています。  
Angular の `subscribe(response => ...)` で `response.result` として取り出します。

---

## ⑤ 認証・トークンについて

### 今回のAPIには認証がない

このプロジェクトの `POST /api/generate` には認証がありません。  
誰でも、トークン無しでアクセスできます。

```bash
# トークン無しでもこの通り叩ける
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"text":"あ","width":4,"shape":"wave"}'
```

これで問題ない理由:

- ローカルでの個人学習用
- ユーザー固有のデータを扱っていない
- 副作用がない（DBに何も書き込まない）

### もし認証を付けるなら？

実際のサービスでは、API は誰でも叩ける状態だと困ることがあります。たとえば:

- ユーザーごとのデータを返すAPI（自分以外のデータが見えてはいけない）
- 課金ユーザーだけが使えるAPI
- 不正利用やDDoSへの対策

そこで「このリクエストは正規のユーザーが送ったもの」と証明する仕組みが**認証（Authentication）**です。

#### よくある認証方式

| 方式                 | 仕組み                                                                             |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Basic 認証**       | `Authorization: Basic <base64(user:pass)>` — 平文に近く、HTTPS必須                 |
| **Bearer トークン**  | `Authorization: Bearer <token>` — APIキーやJWTを載せる。最も一般的。               |
| **JWT**              | Bearer の中身が JSON Web Token。署名付きなのでサーバーがユーザー情報を取り出せる。 |
| **セッションCookie** | ログイン時にCookieを発行し、ブラウザが自動送信。Webアプリでよく使われる。          |
| **OAuth 2.0**        | サードパーティ連携（Googleログイン等）の標準フレームワーク                         |

#### Bearer トークンを使った例

リクエストにトークンを載せるイメージ:

```http
POST /api/generate HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{"text":"あいう","width":4,"shape":"wave"}
```

Laravel 側ではミドルウェアで検証します（Laravel Sanctum を使う場合）:

```php
Route::post('generate', [WaveController::class, 'generate'])
    ->middleware('auth:sanctum');
```

#### トークンが無い／不正な場合の挙動

`auth:sanctum` ミドルウェアを通したルートに、トークン無しでアクセスすると:

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{"message":"Unauthenticated."}
```

| ステータスコード      | 意味                                              |
| --------------------- | ------------------------------------------------- |
| `401 Unauthorized`    | 認証されていない（誰だかわからない）              |
| `403 Forbidden`       | 認証はされているが権限がない（あなたは入れない）  |

つまり `401` は「トークン出して」、`403` は「あなたじゃ無理」という違いです。

#### トークンはどこに保存する？

ブラウザで使う場合、選択肢は3つあります。

| 保存場所         | 利点                              | 欠点                                                  |
| ---------------- | --------------------------------- | ----------------------------------------------------- |
| `localStorage`   | 実装が簡単。リロードしても残る    | XSS攻撃でJavaScriptから盗まれるリスク                 |
| `sessionStorage` | タブを閉じれば消える              | XSS攻撃に弱いのは同じ                                 |
| HttpOnly Cookie  | JavaScriptから読めずXSSに強い     | CSRF対策が別途必要                                    |

実務では HttpOnly Cookie + CSRF トークンの組み合わせが安全とされています。

---

## ⑥ CORS（Cross-Origin Resource Sharing）

### なぜ CORS が必要なのか

ブラウザは「自分が表示しているページと違うオリジンへの fetch/XHR」をデフォルトでブロックします。  
これは悪意のあるサイトが裏で別サイトにアクセスして情報を盗むのを防ぐため。

今回:

- ページのオリジン: `http://localhost:4200`
- API のオリジン: `http://localhost:8000`

ポートが違うので別オリジン扱いになり、ブロックされます。  
ブロックを解除するには、**サーバー側が「このオリジンからは許可する」とレスポンスヘッダーで宣言**する必要があります。それが CORS です。

### プリフライトリクエスト

`Content-Type: application/json` のような「単純じゃない」リクエストの前に、ブラウザは事前確認のリクエストを自動で送ります。これが **プリフライト**。

```http
OPTIONS /api/generate HTTP/1.1
Host: localhost:8000
Origin: http://localhost:4200
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

サーバーは許可を返します:

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:4200
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type
```

このやり取りを通った後、本物の POST が送られます。  
プリフライトの設定は `config/cors.php` の `paths`・`allowed_methods`・`allowed_headers` あたりで決まります。

### CORS が失敗するとどうなる？

サーバーは200を返しているのに、ブラウザのコンソールにこういうエラーが出ます:

```text
Access to XMLHttpRequest at 'http://localhost:8000/api/generate'
from origin 'http://localhost:4200' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

ポイント: **CORS エラーはブラウザが止めているのであって、サーバーは正常にレスポンスを返している**。  
curl やバックエンド同士の通信ではこのエラーは発生しません。

---

## ⑦ エラーになるケース

実際に試してみると理解が深まります。

### バリデーションエラー（422）

```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"text":"a","width":100,"shape":"wave"}'
```

```json
{
  "message": "The width field must not be greater than 20.",
  "errors": {
    "width": ["The width field must not be greater than 20."]
  }
}
```

### ルートが無い（404）

```bash
curl -X POST http://localhost:8000/api/wrong
```

→ Laravel が「該当ルートなし」を返す。

### メソッド違い（405）

```bash
curl http://localhost:8000/api/generate
# GET は許可していない
```

### CORS NG（ブラウザのコンソールにのみ出る）

`config/cors.php` の `allowed_origins` を `['http://example.com']` に変えると、Angular からのリクエストが弾かれます。

---

## ⑧ ブラウザ DevTools での見方

Chrome / Firefox の DevTools の **Network** タブを開いて EXECUTE を押すと、すべてのリクエストとレスポンスが見えます。

確認すると面白い順:

1. **Headers タブ** — General（メソッド・URL・ステータス）／Request Headers／Response Headers
2. **Payload タブ** — 送ったJSON
3. **Response タブ** — 受け取ったJSON
4. **Timing タブ** — DNS解決、接続、サーバー処理、ダウンロードに何msかかったか

CORS エラーが起きているときは、Network タブにリクエスト自体が表示されない（または赤く表示される）ことが多いので、**Console タブも併せて確認する**のがコツ。

---

## まとめ

- ブラウザは `POST /api/generate` で JSON を送り、JSONを受け取る
- Origin / Referer / Content-Type などのヘッダーが自動で付く
- サーバーは ルーティング → ミドルウェア → コントローラー → サービス の順で処理する
- 今回のAPIは認証なし。誰でも叩ける。実サービスでは Bearer トークン等で守る
- CORS はブラウザ側のセキュリティ機構。サーバーが許可ヘッダーを返すことでブロックを解除する
- エラーは ステータスコード で種類がわかる（401=認証、403=権限、422=入力、500=サーバー）

DevToolsの Network タブで実際の通信を眺めると、ここに書いてあることが目で見てわかるようになります。
