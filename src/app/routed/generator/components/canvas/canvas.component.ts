import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  GeneratorService,
  GeneratorState,
} from '../../services/generator.service';
import { Subscription, max } from 'rxjs';

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
        this.context.fillStyle = state.color;
        this.renderText(state);
      })
    );
  }

  measureText({
    fontFamily,
    fontWeight,
    text,
    fontSize,
  }: {
    fontWeight: number;
    fontFamily: string;
    text: string;
    fontSize: number;
  }) {
    this.context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    return this.context.measureText(text);
  }

  calculateFontSize({
    fontFamily,
    fontWeight,
    text,
  }: {
    fontWeight: number;
    fontFamily: string;
    text: string;
  }) {
    let fontSize = 1;
    while (
      this.measureText({ fontFamily, fontWeight, text, fontSize }).width <
        this.width &&
      fontSize < this.height
    ) {
      fontSize++;
    }
    return fontSize - 1;
  }

  private renderText(state: GeneratorState): void {
    const texts = state.text.split('\n');
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    const maxLineHeight = this.height / texts.length;
    texts.forEach((text, lineIndex) => {
      const fontSize = this.calculateFontSize({
        text,
        fontFamily: state.font,
        fontWeight: state.fontWeight,
      });

      const maxWidth = this.measureText({
        text,
        fontWeight: state.fontWeight,
        fontSize: this.width,
        fontFamily: state.font,
      }).width;
      const scaleX = 1;
      const scaleY =
        maxWidth < this.width ? 1 : maxWidth / (this.height * texts.length);

      const x = this.width / 2;
      const y = maxLineHeight / scaleY / 2 + maxLineHeight * lineIndex;

      this.context.save();
      this.context.scale(scaleX, scaleY);
      this.measureText({
        text,
        fontWeight: state.fontWeight,
        fontSize: fontSize,
        fontFamily: state.font,
      });
      this.context.fillText(text, x, y);
      this.context.restore();
    });
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
