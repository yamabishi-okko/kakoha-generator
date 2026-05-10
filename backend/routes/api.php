<?php

use App\Http\Controllers\WaveController;
use Illuminate\Support\Facades\Route;

// ============================================================
// API ルート定義
// ============================================================
// このファイルに書かれたルートは bootstrap/app.php の withRouting() で
// /api プレフィックス付きで登録される。
// 例: Route::post('generate', ...) → POST /api/generate でアクセス可能
// ============================================================

// 🪼③ Angular の HttpClient.post('http://localhost:8000/api/generate', ...) がここに届く
// WaveController::generate() が処理を引き受ける
Route::post('generate', [WaveController::class, 'generate']);
