// ============================================================
// ⭐️③ URLとコンポーネントの対応表（ルート定義）
// ============================================================
// 下記の routes 配列が読み込まれる
//
// 【routes とは？】
//   「このURLにアクセスしたらこのコンポーネントを表示する」という
//   対応表を配列で定義したもの。
//   例）
//     path: ''         → http://localhost:4200/          → GeneratorComponent を表示
//     path: 'new-page' → http://localhost:4200/new-page  → NewPageComponent を表示
//
//   ※ path: '' がルートURL（/だけのURL）に対応するのは、
//      Angular Router が「/」より後ろの文字列を path と比較するため。
//      http://localhost:4200/ の場合「/」より後ろは空文字なので path: '' にマッチする。
//
// 【なぜこのファイルが実行されるのか？】
//   src/app/app.config.ts に import { routes } from './app.routes' と書かれているため、
//   app.config.ts が読み込まれた時点でこのファイルも自動的に読み込まれる。
//   export const routes と書いているのは「他のファイルから使っていいよ」という印。
//   import でそれを受け取った app.config.ts が provideRouter(routes) に渡す。
//
// 【実際の動き】
//   Angular のルーターはブラウザの URL が変わるたびにこの配列を上から照合し、
//   マッチしたコンポーネントを app.component.html の <router-outlet> の位置に
//   差し込んで表示する（⭐️⑦）。
//
// この後:
//   ルートURL ('') の場合 →
//     src/app/generator/generator.component.ts の GeneratorComponent が生成される（⭐️⑧）
//   'new-page' の場合 →
//     src/app/new-page/new-page.component.ts の NewPageComponent が生成される
// ============================================================

import { Routes } from '@angular/router';
import { GeneratorComponent } from './generator/generator.component';
import { NewPageComponent } from './new-page/new-page.component';

export const routes: Routes = [
  { path: '', component: GeneratorComponent },
  { path: 'new-page', component: NewPageComponent },
];
