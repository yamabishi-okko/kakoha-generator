import { TestBed } from '@angular/core/testing';
import { WaveService } from './wave.service';

describe('WaveService', () => {
  let service: WaveService;
  const S = '　'; // 全角スペース (U+3000)

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('wave pattern', () => {
    it('produces triangle wave: 0→max→0', () => {
      const lines = service.generate('abcde', 3, 'wave').split('\n');
      expect(lines[0]).toBe('a');
      expect(lines[1]).toBe(S + 'b');
      expect(lines[2]).toBe(S + S + 'c');
      expect(lines[3]).toBe(S + 'd');
      expect(lines[4]).toBe('e');
    });
  });

  describe('right pattern', () => {
    it('produces rising sawtooth: 0→max repeating', () => {
      const lines = service.generate('abcabc', 3, 'right').split('\n');
      expect(lines[0]).toBe('a');
      expect(lines[1]).toBe(S + 'b');
      expect(lines[2]).toBe(S + S + 'c');
      expect(lines[3]).toBe('a');
      expect(lines[4]).toBe(S + 'b');
      expect(lines[5]).toBe(S + S + 'c');
    });
  });

  describe('left pattern', () => {
    it('produces falling sawtooth: max→0 repeating', () => {
      const lines = service.generate('abcabc', 3, 'left').split('\n');
      expect(lines[0]).toBe(S + S + 'a');
      expect(lines[1]).toBe(S + 'b');
      expect(lines[2]).toBe('c');
      expect(lines[3]).toBe(S + S + 'a');
      expect(lines[4]).toBe(S + 'b');
      expect(lines[5]).toBe('c');
    });
  });

  describe('newline handling', () => {
    it('preserves newlines as empty lines without incrementing char index', () => {
      const lines = service.generate('a\nb', 3, 'wave').split('\n');
      expect(lines[0]).toBe('a');
      expect(lines[1]).toBe('');
      expect(lines[2]).toBe(S + 'b');
    });
  });
});
