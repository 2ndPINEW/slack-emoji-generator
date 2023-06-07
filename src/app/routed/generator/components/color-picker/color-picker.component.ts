import { Component } from '@angular/core';
import { GeneratorService } from '../../services/generator.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
  color = '#000000';

  constructor(private generatorService: GeneratorService) {}

  ngOnInit() {
    this.generatorService.color$.subscribe((color) => {
      this.color = color;
    });
  }

  changeColor(color: string) {
    this.generatorService.color$.next(color as `#${string}`);
  }
}
