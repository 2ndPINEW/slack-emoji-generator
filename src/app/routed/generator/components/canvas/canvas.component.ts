import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { GeneratorService } from '../../services/generator.service';
import { Subscription } from 'rxjs';

const size = { width: 128, height: 128 };
const iconModeScale = 0.25;
const reactionModeScale = 0.125;

const background = {
  light: '#ffffff',
  lightIcon: '#ffffff',
  lightReaction: '#EBF5FA',
  dark: '#1B1D21',
  darkIcon: '#1B1D21',
  darkReaction: '#1263A3',
};

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  context!: CanvasRenderingContext2D;

  @Input() mode: keyof typeof background = 'light';

  readonly subscription = new Subscription();

  constructor(private generatorService: GeneratorService) {}

  ngAfterViewInit() {
    const context = this.canvas.nativeElement.getContext('2d');
    if (!context) throw new Error('context is null');
    this.context = context;

    this.subscription.add(
      this.generatorService.state$.subscribe((state) => {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.font = `${state.fontWeight} 32px ${state.font}`;
        this.context.fillStyle = state.color;
        this.context.fillText(state.text, 0, 50);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get width(): number {
    return size.width;
  }

  get height(): number {
    return size.height;
  }

  get scale(): number {
    return this.mode.includes('Reaction')
      ? reactionModeScale
      : this.mode.includes('Icon')
      ? iconModeScale
      : 1;
  }

  get backgroundColor(): string {
    return background[this.mode];
  }

  download() {
    console.log('download');
    const a = document.createElement('a');
    a.href = this.canvas.nativeElement.toDataURL('image/png', 1);
    a.download = 'image.png';
    a.click();
  }
}
