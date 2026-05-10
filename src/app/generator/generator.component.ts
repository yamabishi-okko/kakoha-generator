import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // inject(): Angular の DI から WaveService・HttpClient を受け取る
  private waveService = inject(WaveService);
  // 🪼③ HttpClient: Laravel の POST /api/generate にリクエストを送るために使う
  //   provideHttpClient() を app.config.ts に登録しているため inject() できる
  private http = inject(HttpClient);

  // 各 signal はテンプレート（HTML）と紐づく。set() すると画面が自動更新される
  inputText = signal('');            // テキストエリアの入力内容
  width = signal(8);                 // スライダーの値（波の振れ幅、2〜20）
  shape = signal<WaveShape>('wave'); // 選択中の波形パターン（'wave' | 'right' | 'left'）
  output = signal('');               // 変換後テキスト（OUTPUT STREAM エリアに表示される）
  charCount = signal(0);             // 処理した文字数（改行を除く）
  status = signal<'awaiting' | 'complete'>('awaiting'); // 処理状態
  copied = signal(false);            // コピー完了フラグ（true のとき「COPIED」と表示する）

  // 🪼① mode signal: 処理モードの切り替え。'local' = ブラウザ内処理、'api' = Laravel API 経由
  //   ラジオボタン（HTML）と紐づき、ユーザーが選んだ値が即座に反映される
  mode = signal<'local' | 'api'>('local');

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
  // 🌙②/🪼② generate(): 波変換ボタン押下時に呼ばれるメソッド
  // ============================================================
  // mode signal の値によってローカル処理と API 処理を切り替える。
  //
  //   mode === 'local' → WaveService.generate()（ブラウザ内処理）を呼ぶ（従来通り）
  //   mode === 'api'   → HttpClient.post() で Laravel に送る（🪼③）
  //
  // ============================================================
  generate(): void {
    if (!this.inputText().trim()) return; // 空入力は無視して何もしない

    if (this.mode() === 'api') {
      // ============================================================
      // 🪼③ API モード: HttpClient.post() で Laravel にリクエストを送る
      // ============================================================
      // post() の引数:
      //   第1引数: 送信先のURL（Laravel サーバーのエンドポイント）
      //   第2引数: リクエストボディ。{ } で書いたオブジェクトが JSON 文字列に変換されて送られる
      //
      // 【型パラメータ <{ result: string }> とは？】
      //   post<T>() の T に「レスポンスとして返ってくる JSON の形」を指定する書き方（ジェネリクス）。
      //   ここでは「{ result: 文字列 } という形の JSON が返ってくる」と TypeScript に教えている。
      //   こう書くと subscribe(response => ...) の response が自動でその型として扱われ、
      //   response.result と書いたときに型補完が効くようになる。
      //
      // 【subscribe() とは？】
      //   HTTP 通信は非同期処理（結果が返ってくるまで時間がかかる）。
      //   post() は Observable（将来の値を表すオブジェクト）を返す。
      //   subscribe() を呼ぶことで「結果が届いたらこの処理を実行する」と登録できる。
      //   Angular の subscribe() は RxJS という非同期ライブラリの仕組み。
      //
      // 【response => { ... } とは？（アロー関数）】
      //   = の左側 (response) が受け取る引数、右側 { } が処理の中身。
      //   「Laravel から結果が返ってきたら、その値を response という名前で受け取り、
      //     { } 内の処理を実行してね」という意味。
      //   function(response) { ... } を短く書いた形。
      //
      // この後: backend/app/Http/Controllers/WaveController.php が処理（🪼④）
      this.http.post<{ result: string }>(
        'http://localhost:8000/api/generate',
        { text: this.inputText(), width: this.width(), shape: this.shape() }
      ).subscribe(response => {
        // 🪼⑦ レスポンスを受け取り signal を更新 → HTML が自動再描画される（🪼⑧）
        this.output.set(response.result);
        this.charCount.set([...this.inputText()].filter(c => c !== '\n').length);
        this.status.set('complete');
      });
      return;
    }

    // ローカルモード（従来通り）
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
