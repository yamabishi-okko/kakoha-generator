import { Component } from '@angular/core';

// ============================================================
// NewPageComponent（サブページ）
// ============================================================
// src/app/app.routes.ts の path: 'new-page' に対応するコンポーネント。
// ブラウザのURLが http://localhost:4200/new-page になると Angular Router が
// このクラスをインスタンス化し、src/app/app.component.html の <router-outlet> に
// src/app/new-page/new-page.component.html の内容を差し込んで表示する。
// ============================================================
@Component({
  selector: 'app-new-page',
  standalone: true,
  imports: [],
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css',
})
export class NewPageComponent {

}
