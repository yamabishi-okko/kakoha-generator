// ============================================================
// ⭐️① アプリ全体の起動点（エントリーポイント）
// ============================================================
// 下記の bootstrapApplication() が動く
//
// 【なぜこのファイルが実行されるのか？】
//   ターミナルで `ng serve` を叩くと Angular CLI がビルドを行い、
//   index.html に <script> タグを自動で差し込む。
//   ブラウザが index.html を読むと <script> タグを発見し、このファイルを実行する。
//   （仕組みの詳細は src/index.html のコメントを参照）
//
// 【なぜ bootstrapApplication() が実行されるのか？】
//   このファイルの末尾を見ると、bootstrapApplication() は
//   関数の中ではなくファイルのトップレベルに直接書かれている。
//   JavaScript はファイルを読み込んだ瞬間、トップレベルのコードを即座に実行する。
//   だから <script> タグで読み込まれると同時に bootstrapApplication() が動く。
//
// 【bootstrapApplication() が呼ばれると何が起きるか？】
//   第1引数の AppComponent を Angular が読み取り、2つの情報を取り出す：
//
//     selector: 'app-root'             ← src/app/app.component.ts の @Component({ }) 内に定義されている
//       → index.html の <app-root> タグを探す（ここに描画する場所が決まる）
//
//     templateUrl: './app.component.html'  ← 同じく @Component({ }) 内に定義されている
//       → そのファイルの中身を <app-root> の中に描画する
//
//   つまり <app-root> の中に流し込まれるのは main.ts ではなく app.component.html の中身。
//   main.ts はあくまで「スタートボタンを押すだけ」の役割。
//
//   第2引数の appConfig は src/app/app.config.ts の
//   export const appConfig がそのまま渡されている。
//   （↑ export は「他のファイルから使っていいよ」という印。
//      import { appConfig } from './app/app.config' でこのファイルに持ってきている）
//
// この後: src/app/app.config.ts の appConfig の中身が読み取られ、
//         ルーターの道具の準備が行われる（⭐️②）
//         ※ スタートボタンを押した後は Angular フレームワーク自身が
//            ルーターの初期化・コンポーネントの作成・DOMへの挿入を順番に行う
// ============================================================

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
