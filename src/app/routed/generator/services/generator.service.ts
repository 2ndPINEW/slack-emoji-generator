import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounce,
  debounceTime,
  map,
  tap,
  zip,
} from 'rxjs';

interface State {
  font: string;
  fontWeight: number;
  text: string;
  color: `#${string}`;
}

@Injectable({
  providedIn: 'root',
})
export class GeneratorService {
  font$ = new BehaviorSubject<State['font']>('Arial');

  fontWeight$ = new BehaviorSubject<State['fontWeight']>(900);

  text$ = new BehaviorSubject<State['text']>('Emoji');

  color$ = new BehaviorSubject<State['color']>('#000000');

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
