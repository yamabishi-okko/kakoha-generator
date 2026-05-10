<?php

// CORS（Cross-Origin Resource Sharing）設定
//
// 【CORS とは？】
//   ブラウザは「異なるオリジン（ドメイン・ポート）へのリクエスト」を
//   セキュリティ上デフォルトでブロックする。
//   CORS はサーバー側が「このオリジンからのリクエストは許可する」と
//   レスポンスヘッダーで宣言する仕組み。
//
//   今回の構成:
//     Angular  → http://localhost:4200  （フロントエンド）
//     Laravel  → http://localhost:8000  （バックエンド）
//   ポートが違うため異なるオリジンとみなされ、CORS 設定が必要になる。

return [

    // CORS を適用するパス。'api/*' = /api/ 以下の全エンドポイントに適用
    'paths' => ['api/*'],

    // 許可する HTTP メソッド（* = 全メソッド許可）
    'allowed_methods' => ['*'],

    // 許可するオリジン。Angular の開発サーバーポートを明示的に指定する
    'allowed_origins' => ['http://localhost:4200'],

    // ワイルドカードによる許可（今回は allowed_origins で明示するため不使用）
    'allowed_origins_patterns' => [],

    // 許可するリクエストヘッダー（* = 全ヘッダー許可）
    'allowed_headers' => ['*'],

    // レスポンスに含めるヘッダー（特別な指定なし）
    'exposed_headers' => [],

    // プリフライトリクエストのキャッシュ時間（秒）
    'max_age' => 0,

    // Cookie などの認証情報を含むリクエストを許可するか（今回は不要）
    'supports_credentials' => false,

];
