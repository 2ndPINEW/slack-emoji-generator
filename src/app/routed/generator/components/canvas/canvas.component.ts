import { Component, ElementRef, ViewChild } from '@angular/core';
import { GeneratorService } from '../../services/generator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  readonly size = { width: 128, height: 128 };

  context!: CanvasRenderingContext2D;

  readonly subscription = new Subscription();

  constructor(private generatorService: GeneratorService) {}

  ngAfterViewInit() {
    const context = this.canvas.nativeElement.getContext('2d');
    if (!context) throw new Error('context is null');
    this.context = context;

    this.subscription.add(
      this.generatorService.state$.subscribe((state) => {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.font = `32px ${state.font}`;
        this.context.fillStyle = state.color;
        this.context.fillText(state.text, 0, 50);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get width(): number {
    return this.size.width;
  }

  get height(): number {
    return this.size.height;
  }

  download() {
    console.log('download');
    const a = document.createElement('a');
    a.href = this.canvas.nativeElement.toDataURL('image/png', 1);
    a.download = 'image.png';
    a.click();
  }
}
