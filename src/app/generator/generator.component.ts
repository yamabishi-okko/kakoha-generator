import { Component, inject, signal } from '@angular/core';
import { WaveService, WaveShape } from '../wave.service';

// ============================================================
// ⭐️⑧ GeneratorComponent のインスタンス化
// ============================================================
// 下記の class GeneratorComponent が Angular Router によって生成される
//
// 【なぜこのファイルが実行されるのか？】
//   src/app/app.routes.ts に path: '' → GeneratorComponent と書かれているため、
//   ルートURL にアクセスすると Angular Router がこのクラスからインスタンス（実物）を作る。
//
// 【inject(WaveService) とは？（DI・依存性注入）】
//   自分で new WaveService() と書く代わりに、Angular に「WaveService をください」と頼む仕組み。
//   Angular がアプリ全体で WaveService の実物を1つだけ管理しており、
//   inject() を呼ぶとその1つを渡してくれる。
//   複数の場所で inject(WaveService) しても、全員が同じ1つのインスタンスを共有する。
//   （これを「シングルトン」という。どこから呼んでも同じ実物が返ってくる。）
//
// 【signal() とは？】
//   Angular の「リアクティブな変数」。
//   普通の変数との違い: 普通の変数は値が変わっても画面は更新されない。
//   signal は set() で値を更新すると Angular が自動で変更を検知し、
//   その値を使っている HTML の箇所だけを即座に書き換える。
//
// この後: src/app/generator/generator.component.html がレンダリングされ、
//         入力エリア・スライダー・ボタンが画面に表示される
// ============================================================
@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css',
})
export class GeneratorComponent {

  // inject(): Angular の DI から WaveService を受け取る。波変換のロジックはすべてここに委譲する
  // 実体は src/app/wave.service.ts の WaveService クラス
  private waveService = inject(WaveService);

  // 各 signal はテンプレート（HTML）と紐づく。set() すると画面が自動更新される
  inputText = signal('');            // テキストエリアの入力内容
  width = signal(8);                 // スライダーの値（波の振れ幅、2〜20）
  shape = signal<WaveShape>('wave'); // 選択中の波形パターン（'wave' | 'right' | 'left'）
  output = signal('');               // 変換後テキスト（OUTPUT STREAM エリアに表示される）
  charCount = signal(0);             // 処理した文字数（改行を除く）
  status = signal<'awaiting' | 'complete'>('awaiting'); // 処理状態
  copied = signal(false);            // コピー完了フラグ（true のとき「COPIED」と表示する）

  // shapes: 波形選択ボタンの定義。
  // src/app/generator/generator.component.html の @for ループでこの配列を使いボタンを生成する。
  // readonly を付けると this.shapes = [...] のような再代入がコンパイルエラーになる。
  // ボタンの定義は変更しないのでこうしておくことで誤った上書きを防げる。
  readonly shapes: { value: WaveShape; label: string }[] = [
    { value: 'wave', label: '〜' },
    { value: 'right', label: '＞' },
    { value: 'left', label: '＜' },
  ];

  // ============================================================
  // 🌙② generate(): 波変換ボタン押下時に呼ばれるメソッド
  // ============================================================
  // 下記の generate() が動く
  //
  // 原理: src/app/generator/generator.component.html の
  //       「▶ EXECUTE WAVE GENERATION」ボタンの (click)="generate()" によって呼び出される（🌙①）。
  //       inputText が空なら何もしない（早期リターン）。
  //       ※ 早期リターン = 条件が満たされない場合、処理の冒頭で即座に return して抜ける書き方。
  //         空のまま処理を続けると output に空文字が入り「変換完了」状態になってしまうため事前に防ぐ。
  //       入力がある場合は WaveService に処理を委託し、
  //       返ってきた結果を output signal に set() することで OUTPUT STREAM を更新する。
  //
  // この後: src/app/wave.service.ts の generate() が発火する（🌙③）
  //         処理完了後 output.set() で signal が更新され、
  //         src/app/generator/generator.component.html の output-box が自動再描画される（🌙⑥）
  // ============================================================
  generate(): void {
    if (!this.inputText().trim()) return; // 空入力は無視して何もしない

    // 🌙③ src/app/wave.service.ts の WaveService.generate() を呼び出す
    const result = this.waveService.generate(this.inputText(), this.width(), this.shape());

    // 🌙⑥ signal を更新 → src/app/generator/generator.component.html の該当箇所が自動再描画される
    this.output.set(result);

    // 🌙⑦ 文字数カウント（改行を除いた文字数）と処理状態を更新する
    // [...this.inputText()] は文字列を1文字ずつの配列にするスプレッド構文。
    // 'abc'.split('') ではなくこれを使うのは、絵文字など2バイト文字を1文字として正確に数えるため。
    this.charCount.set([...this.inputText()].filter(c => c !== '\n').length);
    this.status.set('complete');
  }

  // 波形パターンを変更するメソッド
  // src/app/generator/generator.component.html の波形ボタン (click)="setShape(s.value)" から呼ばれる
  setShape(s: WaveShape): void {
    this.shape.set(s);
  }

  // クリップボードにコピーするメソッド
  // src/app/generator/generator.component.html の COPY ボタン (click)="copyToClipboard()" から呼ばれる
  //
  // 【非同期 / async/await とは？】
  //   通常のコードは上から順に1行ずつ実行する（同期処理）。
  //   クリップボードへの書き込みのように「完了まで時間がかかる処理」は非同期処理と呼ぶ。
  //   async を関数に付けると「この関数は非同期処理を含む」という宣言。
  //   await を付けると「この処理が完了するまで次の行に進まない」という指示になる。
  //   Promise<void> は「この関数は何かを返さない非同期処理」という戻り値の型。
  async copyToClipboard(): Promise<void> {
    if (!this.output()) return;
    await navigator.clipboard.writeText(this.output());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500); // 1.5秒後に「COPY TO CLIPBOARD」表示に戻す
  }
}
