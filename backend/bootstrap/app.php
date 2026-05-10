<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',      // POST /api/generate はここで処理される
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // ============================================================
        // CORS ミドルウェアを API ルートに追加する
        // ============================================================
        // 【ミドルウェアとは？】
        //   コントローラーが処理する前/後にリクエスト・レスポンスを加工する仕組み。
        //   今回は HandleCors（CORS用ミドルウェア）を入れることで、
        //   レスポンスに CORS ヘッダーを自動で付けてくれるようになる。
        //   設定の中身は backend/config/cors.php で定義している。
        //
        // 【prepend: とは？（PHP 8 の名前付き引数）】
        //   関数を呼ぶときに「引数名: 値」と書く形式。
        //   prepend は「ミドルウェアの列の先頭に追加する」という意味。
        //   先頭に置くことで、他のミドルウェアより前に CORS チェックが走る。
        //
        // 【api() とは？】
        //   /api 以下のルート全体にミドルウェアを適用するメソッド。
        //   今回は POST /api/generate しかないが、API を増やしても自動で適用される。
        // ============================================================
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
