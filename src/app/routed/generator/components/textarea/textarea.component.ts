import { Component } from '@angular/core';
import { GeneratorService } from '../../services/generator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextareaComponent {
  value = '';

  private readonly subscription = new Subscription();

  constructor(private generatorService: GeneratorService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.generatorService.text$.subscribe((text) => {
        this.value = text;
      })
    );
  }

  onChange(value: string): void {
    this.generatorService.text$.next(value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
