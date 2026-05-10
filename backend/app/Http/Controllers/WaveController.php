<?php

namespace App\Http\Controllers;

use App\Services\WaveService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// ============================================================
// 🪼④ WaveController: POST /api/generate を受け取るコントローラー
// ============================================================
// Angular から送られてきた HTTP リクエストをここで受け取り、
// WaveService に処理を委ねてから JSON レスポンスを返す。
//
// 【コントローラーとは？】
//   ルーター（routes/api.php）がリクエストを届ける「窓口」クラス。
//   「何を受け取り、何を返すか」だけを担当する。
//   計算ロジックは WaveService に任せ、コントローラーは薄く保つ。
//   Angular 側の generator.component.ts が「受け取って service に委ねる」のと同じ構造。
//
// 処理の流れ:
//   🪼③ Angular の HttpClient.post() → ネットワーク → routes/api.php → ここ
//   🪼⑤ ここ → WaveService::generate() → ここ
//   🪼⑥ ここ → JSON レスポンス → Angular の subscribe()
// ============================================================
class WaveController extends Controller
{
    // ============================================================
    // 🪼④ generate(): POST /api/generate のハンドラーメソッド
    // ============================================================
    // リクエストのバリデーション → WaveService で変換 → JSON で返す。
    //
    // リクエスト JSON:
    //   { "text": string, "width": number, "shape": "wave"|"right"|"left" }
    //
    // レスポンス JSON:
    //   { "result": string }
    //
    // この後: 🪼⑤ app/Services/WaveService.php の generate() が発火する
    // ============================================================

    // ============================================================
    // __construct() でサービスを受け取る（DI・依存性注入）
    // ============================================================
    // Angular の inject(WaveService) と同じ仕組みで、
    // Laravel が WaveService のインスタンスを自動で生成して渡してくれる。
    //
    // 【private WaveService $waveService という書き方とは？（PHP 8 の機能）】
    //   通常は「プロパティ宣言」と「コンストラクタで代入」を別々に書く必要がある。
    //
    //   従来の書き方:
    //     private WaveService $waveService;
    //     public function __construct(WaveService $waveService) {
    //         $this->waveService = $waveService;
    //     }
    //
    //   PHP 8 ではコンストラクタの引数に private/protected/public を付けるだけで、
    //   プロパティ宣言と代入を同時に行ってくれる（コンストラクタプロモーション）。
    //   これで $this->waveService が使えるようになる。
    // ============================================================
    public function __construct(private WaveService $waveService)
    {
    }

    public function generate(Request $request): JsonResponse
    {
        // ============================================================
        // バリデーション: リクエストの中身が想定通りかチェックする
        // ============================================================
        // 各キーに対して制約（ルール）の配列を渡す。
        //   'required' = 必須項目（無いとエラー）
        //   'string'   = 文字列であること
        //   'integer'  = 整数であること
        //   'min:2'    = 2以上
        //   'max:20'   = 20以下
        //   'in:a,b,c' = 'a' か 'b' か 'c' のいずれか
        //
        // 満たさない場合は Laravel が自動で 422（バリデーションエラー）を返す。
        // 満たした場合は $validated に検証済みデータが入る。
        // ============================================================
        $validated = $request->validate([
            'text'  => ['required', 'string'],
            'width' => ['required', 'integer', 'min:2', 'max:20'],
            'shape' => ['required', 'string', 'in:wave,right,left'],
        ]);

        // 🪼⑤ WaveService に変換処理を委ねる
        $result = $this->waveService->generate(
            $validated['text'],
            $validated['width'],
            $validated['shape'],
        );

        // 🪼⑥ JSON レスポンスを返す → Angular の subscribe() で受け取られる
        return response()->json(['result' => $result]);
    }
}
