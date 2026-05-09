import { Injectable } from '@angular/core';

// WaveShape: 波形の種類を表す型。
// Union 型（ユニオン型）= 「このどれかしか入れられない」という制約を付けた TypeScript の型。
// 'wave' | 'right' | 'left' と書くことで、この3つ以外の文字列を入れようとするとコンパイルエラーになる。
// 例）shape = 'circle' と書くとエラー → タイポを早期発見できる。
export type WaveShape = 'wave' | 'right' | 'left';

// 全角スペース（U+3000）を使ってインデントを作る定数。
// 半角スペースを使うと日本語文字の約半分の幅しかなく、縦に並べたとき文字がずれて波にならない。
// 全角スペースを使うことで日本語フォントでも文字の幅が揃い、縦のラインが正確に揃う。
const FULL_SPACE = '　';

// 【サービスとは？】
//   コンポーネント（画面の部品）から「ロジック（処理・計算）」を切り出して
//   別のクラスにまとめたもの。
//   波変換の計算ロジックをここに書くことで、
//   generator.component.ts は「画面の制御だけ」に専念できる。
//
// 【@Injectable({ providedIn: 'root' }) とは？】
//   このクラスを Angular の管理下に置く宣言。
//   providedIn: 'root' を書くと、アプリ全体で1つだけインスタンスが作られる（シングルトン）。
//   inject(WaveService) を呼んだコンポーネントには全員同じインスタンスが渡される。
//   （providers に書かなくてもよい仕組みで、Angular が自動で管理してくれる）
@Injectable({ providedIn: 'root' })
export class WaveService {

  // ============================================================
  // 🌙③ generate(): テキストを波形インデント付きテキストに変換するメソッド
  // ============================================================
  // 下記の generate() が動く
  //
  // 原理: src/app/generator/generator.component.ts の generate() から呼ばれる（🌙②）。
  //       入力テキストを1文字ずつループし、各文字の前に
  //       「波形の位置に応じた全角スペース」を付けて新しい行として積み上げていく。
  //       最後に全行を改行でつなげて1つの文字列として返す。
  //       改行文字 '\n' は空行として扱い、インデントは付けない。
  //
  // 引数:
  //   text  = 入力テキスト（src/app/generator/generator.component.ts の inputText signal の値）
  //   width = 波の振れ幅（src/app/generator/generator.component.ts の width signal の値、2〜20）
  //   shape = 波形の種類（src/app/generator/generator.component.ts の shape signal の値）
  // 戻り値: インデント付きの変換済みテキスト文字列
  //
  // この後: このファイルの indent() が各文字ごとに呼ばれてインデント量が計算される（🌙④）
  //         全文字の処理が終わると src/app/generator/generator.component.ts の
  //         generate() に戻り output.set() が呼ばれる（🌙⑥）
  // ============================================================
  generate(text: string, width: number, shape: WaveShape): string {
    const lines: string[] = [];
    let i = 0; // 改行を除いた文字のインデックス（波の位相計算に使う）

    // 🌙④ テキストを1文字ずつループ処理する
    for (const char of text) {
      if (char === '\n') {
        lines.push(''); // 改行文字はインデントなしの空行として扱う
        continue;
      }
      // 🌙⑤ このファイルの indent()（下記）を呼びインデント量（スペースの数）を計算する
      //     FULL_SPACE.repeat(n) で全角スペースを n 個作り、文字の前に付ける
      lines.push(FULL_SPACE.repeat(this.indent(i, width, shape)) + char);
      i++;
    }
    return lines.join('\n'); // 全行を改行でつなげて1つの文字列として返す
  }

  // ============================================================
  // 🌙⑤ indent(): 文字の位置（i）から波形のインデント量を計算するメソッド
  // ============================================================
  // 下記の indent() が動く
  //
  // 原理: 各波形ごとに異なる数式でインデント量（全角スペースの数）を計算する。
  //
  //   ＞ (right): i % width
  //     → 0, 1, 2, ..., width-1, 0, 1, 2, ... と右肩上がりに増えるのこぎり波
  //
  //   ＜ (left) : (width-1) - (i % width)
  //     → max, max-1, ..., 0, max, ... と右肩下がりのこぎり波
  //
  //   〜 (wave) : 三角波。period = 2*(width-1) を1周期として
  //     前半 (phase が 0〜max)         : インデントが 0 → max と増えていく
  //     後半 (phase が max+1〜period-1): インデントが max-1 → 1 と減っていく
  //     → ジグザグに増減する波形になる
  //     具体例）width=4 のとき max=3, period=6
  //       i    : 0  1  2  3  4  5  6  7  8  ...
  //       phase: 0  1  2  3  4  5  0  1  2  ...（i % period の繰り返し）
  //       indent: 0  1  2  3  2  1  0  1  2  ...（0→3→0と往復）
  //
  // 戻り値: 全角スペースを何個付けるかの整数
  // ============================================================
  private indent(i: number, width: number, shape: WaveShape): number {
    const max = width - 1;
    if (shape === 'right') return i % width;               // 右肩上がりのこぎり波
    if (shape === 'left') return max - (i % width);        // 右肩下がりのこぎり波
    // wave（三角波）の計算
    const period = 2 * max;                               // 1周期の長さ（頂点まで行って戻る）
    const phase = i % period;                             // 現在の位相（0〜period-1 の繰り返し）
    return phase <= max ? phase : period - phase;         // 前半: 増加 / 後半: 減少
  }
}
