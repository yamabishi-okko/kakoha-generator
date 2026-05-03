import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneratorComponent } from './generator.component';

describe('GeneratorComponent', () => {
  let component: GeneratorComponent;
  let fixture: ComponentFixture<GeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratorComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(GeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('generate() produces wave output and updates signals', () => {
    component.inputText.set('abc');
    component.width.set(3);
    component.shape.set('wave');
    component.generate();
    expect(component.output()).toContain('　');
    expect(component.charCount()).toBe(3);
    expect(component.status()).toBe('complete');
  });

  it('generate() does nothing if input is empty', () => {
    component.inputText.set('   ');
    component.generate();
    expect(component.output()).toBe('');
    expect(component.status()).toBe('awaiting');
  });
});
