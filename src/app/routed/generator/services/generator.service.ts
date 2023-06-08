import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, debounceTime, map } from 'rxjs';

export interface GeneratorState {
  font: string;
  fontWeight: number;
  text: string;
  color: `#${string}`;
}

@Injectable({
  providedIn: 'root',
})
export class GeneratorService {
  font$ = new BehaviorSubject<GeneratorState['font']>('Arial');

  fontWeight$ = new BehaviorSubject<GeneratorState['fontWeight']>(900);

  text$ = new BehaviorSubject<GeneratorState['text']>('Emoji');

  color$ = new BehaviorSubject<GeneratorState['color']>('#000000');

  state$ = combineLatest([
    this.font$,
    this.fontWeight$,
    this.text$,
    this.color$,
  ]).pipe(
    map(([font, fontWeight, text, color]) => {
      return { font, fontWeight, text, color };
    }),
    debounceTime(50)
  );
}
