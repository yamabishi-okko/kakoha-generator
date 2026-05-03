import { Injectable } from '@angular/core';

export type WaveShape = 'wave' | 'right' | 'left';

const FULL_SPACE = '　';

@Injectable({ providedIn: 'root' })
export class WaveService {
  generate(text: string, width: number, shape: WaveShape): string {
    const lines: string[] = [];
    let i = 0;
    for (const char of text) {
      if (char === '\n') {
        lines.push('');
        continue;
      }
      lines.push(FULL_SPACE.repeat(this.indent(i, width, shape)) + char);
      i++;
    }
    return lines.join('\n');
  }

  private indent(i: number, width: number, shape: WaveShape): number {
    const max = width - 1;
    if (shape === 'right') return i % width;
    if (shape === 'left') return max - (i % width);
    const period = 2 * max;
    const phase = i % period;
    return phase <= max ? phase : period - phase;
  }
}
