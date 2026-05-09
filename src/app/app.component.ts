import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// ============================================================
// ⭐️④ AppComponent のインスタンス化（全ページ共通コンポーネント）
// ============================================================
// 下記の class AppComponent が Angular によって生成される
//
// 【インスタンスとは？】
//   class AppComponent はコンポーネントの「設計図」。
//   インスタンスはその設計図から作られた「実物」のこと。
//   Angular が bootstrapApplication() の指示を受けて実物を1つ作る。
//
// 【各プロパティの意味】
//   selector: 'app-root'
//     → index.html の <app-root> タグを探して、ここにテンプレートを描画する
//   templateUrl: './app.component.html'
//     → <app-root> の中に流し込む HTML ファイルの場所
//   standalone: true
//     → 「このコンポーネント単体で動ける」という宣言
//       （Angular 14 で導入された書き方。Angular 17 以降はデフォルトで true になった）
//   imports: [RouterOutlet]
//     → このコンポーネントの HTML 内で <router-outlet> タグを使うための宣言。
//       Angular では使いたいタグ（部品）を imports に明示しないと HTML 内で使えない。
//
// この後: インスタンス化の直後に Angular が ngOnInit() を自動で呼ぶ（⭐️⑤）
// ============================================================
// ↓ src/main.ts の bootstrapApplication(AppComponent) が呼ばれると、
//   Angular はここ（@Component の中身）を読み取って描画先と描画内容を決める
@Component({
  selector: 'app-root',           // 描画先: index.html の <app-root> タグ
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',  // 描画内容: このファイルの HTML
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {

  // signal(): Angular のリアクティブな変数。
  // 普通の変数（let accuracy = '98.7%'）と違い、set() で値を更新すると
  // Angular が変化を自動で検知（変更検知）して画面の該当箇所だけ即座に書き換える。
  // ※ 変更検知 = signal の値が変わったことを Angular が察知して DOM を更新する仕組み。
  //    ページ全体を再読み込みするわけではなく、変わった部分だけを差し替える。
  // これらの値は src/app/app.component.html の {{ accuracy() }} {{ latency() }} に表示される。
  accuracy = signal('98.7%');
  latency = signal('12ms');

  // timers: ngOnDestroy でタイマーを止めるために setInterval の戻り値を保持しておく配列。
  // ReturnType<typeof setInterval> = setInterval() が返す値の型を TypeScript に自動推論させる書き方。
  // ブラウザと Node.js で setInterval の戻り値の型が異なるため number と直接書かずこうしている。
  private timers: ReturnType<typeof setInterval>[] = [];

  // ============================================================
  // ⭐️⑤ ngOnInit: コンポーネント表示直前に Angular が自動で呼ぶライフサイクルフック
  // ============================================================
  // 下記の ngOnInit() が動く
  //
  // 【ライフサイクルフックとは？】
  //   コンポーネントには「誕生 → 表示 → 更新 → 破棄」という一生（ライフサイクル）がある。
  //   その一生の特定のタイミングで Angular が自動で呼び出してくれる関数がライフサイクルフック。
  //   ngOnInit    = コンポーネントが画面に表示される直前に呼ばれる（このメソッド）
  //   ngOnDestroy = コンポーネントが画面から消えるときに呼ばれる（このファイル下部参照）
  //
  // 原理: コンポーネントが画面に描画される直前に Angular が自動で呼び出す。
  //       ここで setInterval() を2本起動することで、
  //       ヘッダーの WAVE ACC と LATENCY の数値をランダムに変動させ
  //       「リアルタイムに動いているシステム」風の演出を作っている。
  //       signal.set() を呼ぶたびに Angular が変更を検知して画面を即座に更新する。
  //
  // この後: src/app/app.component.html の {{ accuracy() }} と {{ latency() }} が
  //         それぞれ 1300ms / 1000ms ごとに自動で書き換わり続ける（⭐️⑥）
  // ============================================================
  ngOnInit(): void {
    console.log("ooo") // デバッグ用ログ（本番では削除する）
    let acc = 98.7;

    // 1300ms ごとに accuracy を微妙に増減させるタイマー
    this.timers.push(
      setInterval(() => {
        const drop = Math.random() < 0.1;           // 10% の確率で大きく下がる
        const delta = drop
          ? -(Math.random() * 1.5 + 0.5)            // 下落時: -0.5〜-2.0 の変化
          : (Math.random() - 0.4) * 0.6;            // 通常時: -0.24〜+0.36 の微変動
        acc = Math.min(99.9, Math.max(97.0, acc + delta)); // 97.0〜99.9 の範囲に収める
        this.accuracy.set(acc.toFixed(1) + '%');    // signal 更新 → 画面が即座に再描画される
      }, 1300)
    );

    // 1000ms ごとに latency をランダムに変動させるタイマー
    this.timers.push(
      setInterval(() => {
        const spike = Math.random() < 0.15;         // 15% の確率でスパイク（高遅延）
        const ms = spike
          ? Math.floor(Math.random() * 80 + 40)     // スパイク時: 40〜120ms
          : Math.floor(Math.random() * 20 + 8);     // 通常時: 8〜28ms
        this.latency.set(ms + 'ms');                // signal 更新 → 画面が即座に再描画される
      }, 1000)
    );
  }

  // ngOnDestroy: コンポーネントが破棄されるときに Angular が自動で呼ぶライフサイクルフック
  // 原理: setInterval は clearInterval() で止めない限り永遠に動き続ける。
  //       コンポーネントが画面から消えても setInterval が残ると
  //       メモリリーク（不要な処理がメモリを占有し続ける問題）が起きる。
  //       ページ遷移などで AppComponent が破棄されるタイミングで全タイマーを止める。
  ngOnDestroy(): void {
    this.timers.forEach(clearInterval);
    console.log("ddd") // デバッグ用ログ（本番では削除する）
  }
}
