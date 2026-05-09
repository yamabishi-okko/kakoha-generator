// ============================================================
// ⭐️② ルーター（画面遷移の仕組み）の初期化設定
// ============================================================
// 下記の appConfig オブジェクトが読み込まれ、provideRouter() が動く
//
// 【ルーターとは？】
//   URL が変わったときに「どの画面を表示するか」を管理する仕組み。
//   例）/ → ジェネレーター画面、/about → About 画面
//   ルーターがないと URL が変わっても画面が切り替わらない。
//
// 【providers とは？】
//   「アプリ全体で使う道具をここに登録する」配列。
//   登録（providers に書く）= Angular への申告。「この道具を使います」という宣言。
//   準備（Angular が起動時に実物を作る）= 申告を見て Angular が道具のインスタンスを生成する。
//   準備された道具はアプリのどこからでも呼び出して使えるようになる。
//   今は provideRouter（ルーター）だけだが、
//   将来サーバーとのデータのやり取り（HTTP 通信）などの道具を追加するときもここに書く。
//
// 原理: src/main.ts の bootstrapApplication() が第2引数で appConfig を受け取ると、
//       providers 配列の中身を読み取り、書いてある道具を順番に準備する。
//       provideRouter(routes) は「ルーターを準備してください」という命令で、
//       これを書かないとアプリ内でルーターが使えない。
//
// この後: src/app/app.routes.ts の routes が参照され、
//         URLとコンポーネントの対応表が登録される（⭐️③）
//         その後 src/app/app.component.ts の AppComponent が生成される（⭐️④）
// ============================================================

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
