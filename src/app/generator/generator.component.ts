import { Component, inject, signal } from '@angular/core';
import { WaveService, WaveShape } from '../wave.service';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css',
})
export class GeneratorComponent {
  private waveService = inject(WaveService);

  inputText = signal('');
  width = signal(8);
  shape = signal<WaveShape>('wave');
  output = signal('');
  charCount = signal(0);
  status = signal<'awaiting' | 'complete'>('awaiting');
  copied = signal(false);

  readonly shapes: { value: WaveShape; label: string }[] = [
    { value: 'wave', label: '〜' },
    { value: 'right', label: '＞' },
    { value: 'left', label: '＜' },
  ];

  generate(): void {
    if (!this.inputText().trim()) return;
    const result = this.waveService.generate(this.inputText(), this.width(), this.shape());
    this.output.set(result);
    this.charCount.set([...this.inputText()].filter(c => c !== '\n').length);
    this.status.set('complete');
  }

  setShape(s: WaveShape): void {
    this.shape.set(s);
  }

  async copyToClipboard(): Promise<void> {
    if (!this.output()) return;
    await navigator.clipboard.writeText(this.output());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
