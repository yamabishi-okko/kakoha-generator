import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { GeneratorComponent } from './generator/generator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GeneratorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  accuracy = signal('98.7%');
  latency = signal('12ms');

  private timers: ReturnType<typeof setInterval>[] = [];

  ngOnInit(): void {
    let acc = 98.7;

    this.timers.push(
      setInterval(() => {
        const drop = Math.random() < 0.1;
        const delta = drop
          ? -(Math.random() * 1.5 + 0.5)
          : (Math.random() - 0.4) * 0.6;
        acc = Math.min(99.9, Math.max(97.0, acc + delta));
        this.accuracy.set(acc.toFixed(1) + '%');
      }, 1300)
    );

    this.timers.push(
      setInterval(() => {
        const spike = Math.random() < 0.15;
        const ms = spike
          ? Math.floor(Math.random() * 80 + 40)
          : Math.floor(Math.random() * 20 + 8);
        this.latency.set(ms + 'ms');
      }, 1000)
    );
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearInterval);
  }
}
