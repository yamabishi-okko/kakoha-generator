<?php

namespace App\Services;

// ============================================================
// 🪼⑤ WaveService: 波形生成ロジックを担うサービスクラス
// ============================================================
// WaveController から呼ばれ、テキストを波形インデント付き文字列に変換して返す。
//
// 【サービスクラスとは？】
//   コントローラー（リクエスト/レスポンスの制御）から「計算ロジック」を切り出したクラス。
//   WaveController は「受け取る・返す」だけに専念し、
//   「どう計算するか」はここに集約する。
//   Angular 側の src/app/wave.service.ts と同じ役割を PHP で担っている。
//
// 【全角スペースについて】
//   半角スペースは日本語フォントでは文字幅の約半分しかなく、縦に並べると波がずれる。
//   全角スペース（U+3000）は日本語文字と同じ幅のため、縦のラインが正確に揃う。
// ============================================================
class WaveService
{
    // 全角スペース（U+3000）: インデントに使用
    private const FULL_SPACE = '　';

    // ============================================================
    // 🪼⑤ generate(): テキストを波形インデント付きテキストに変換するメソッド
    // ============================================================
    // WaveController::generate() から呼ばれる（🪼④）。
    // 入力テキストを1文字ずつループし、波形の位置に応じた全角スペースを
    // 各文字の前に付けて行として積み上げ、改行でつなげて返す。
    //
    // @param string $text  変換対象テキスト
    // @param int    $width 波の振れ幅（2〜20）
    // @param string $shape 波形の種類（'wave' | 'right' | 'left'）
    // @return string       インデント付きの変換済みテキスト
    // ============================================================
    public function generate(string $text, int $width, string $shape): string
    {
        $lines = [];
        $i = 0; // 改行を除いた文字のインデックス（波の位相計算に使う）

        // mb_str_split() で文字列をマルチバイト対応で1文字ずつの配列に分割する。
        // explode('', $text) ではバイト単位で分割されるため日本語が壊れる。
        // mb_str_split() は1文字（コードポイント）単位で安全に分割できる。
        foreach (mb_str_split($text) as $char) {
            if ($char === "\n") {
                $lines[] = ''; // 改行文字はインデントなしの空行として扱う
                continue;
            }
            // indent() でインデント量（スペースの数）を計算し、全角スペースを付けて行に追加する
            $spaces = str_repeat(self::FULL_SPACE, $this->indent($i, $width, $shape));
            $lines[] = $spaces . $char;
            $i++;
        }

        return implode("\n", $lines); // 全行を改行でつなげて1つの文字列として返す
    }

    // ============================================================
    // indent(): 文字の位置（$i）から波形のインデント量を計算するメソッド
    // ============================================================
    // 各波形ごとに異なる数式でインデント量（全角スペースの数）を返す。
    // Angular 側の src/app/wave.service.ts の indent() と同じアルゴリズム。
    //
    //   right: $i % $width → 右肩上がりのこぎり波
    //   left:  ($width-1) - ($i % $width) → 右肩下がりのこぎり波
    //   wave:  三角波。前半は 0→max、後半は max-1→1 と増減を繰り返す
    //
    // @param int    $i     改行を除いた文字のインデックス
    // @param int    $width 波の振れ幅
    // @param string $shape 波形の種類
    // @return int          全角スペースの個数
    // ============================================================
    private function indent(int $i, int $width, string $shape): int
    {
        $max = $width - 1;

        if ($shape === 'right') {
            return $i % $width; // 右肩上がりのこぎり波
        }

        if ($shape === 'left') {
            return $max - ($i % $width); // 右肩下がりのこぎり波
        }

        // wave（三角波）の計算
        $period = 2 * $max;           // 1周期の長さ（頂点まで行って戻る）
        $phase  = $i % $period;       // 現在の位相（0〜period-1 の繰り返し）
        return $phase <= $max ? $phase : $period - $phase; // 前半: 増加 / 後半: 減少
    }
}
