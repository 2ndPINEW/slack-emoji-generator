import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, zip } from 'rxjs';

interface State {
  font: string;
  text: string;
  color: `#${string}`;
}

@Injectable({
  providedIn: 'root',
})
export class GeneratorService {
  font$ = new BehaviorSubject<State['font']>('Arial');

  text$ = new BehaviorSubject<State['text']>('Emoji');

  color$ = new BehaviorSubject<State['color']>('#000000');

  state$ = combineLatest([this.font$, this.text$, this.color$]).pipe(
    map(([font, text, color]) => {
      return { font, text, color };
    })
  );
}
