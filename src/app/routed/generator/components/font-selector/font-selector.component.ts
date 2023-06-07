import { Component } from '@angular/core';
import {
  FontFamily,
  LocalFontService,
} from 'src/app/services/local-font.service';
import { GeneratorService } from '../../services/generator.service';

@Component({
  selector: 'app-font-selector',
  templateUrl: './font-selector.component.html',
  styleUrls: ['./font-selector.component.scss'],
})
export class FontSelectorComponent {
  query = '';

  fontFamilies: FontFamily[] = [];

  showPullDown = false;

  currentFontFamily$ = this.generatorService.font$;

  constructor(
    private localFontService: LocalFontService,
    private generatorService: GeneratorService
  ) {}

  ngAfterViewInit(): void {
    this.onQueryChange();
  }

  onQueryChange() {
    this.localFontService
      .searchFontFamilies$(this.query)
      .subscribe((fontFamilies) => {
        this.fontFamilies = fontFamilies;
      });
  }

  onClick() {
    this.onQueryChange();
    this.showPullDown = true;
  }

  onBlur() {
    this.showPullDown = false;
  }

  onFontFamilyClick(fontFamily: FontFamily) {
    this.currentFontFamily$.next(fontFamily.family);
    this.generatorService.fontWeight$.next(this.fontWeight(fontFamily));
    this.showPullDown = false;
  }

  isCurrentFontFamily(fontFamily: FontFamily) {
    return this.currentFontFamily$.value === fontFamily.family;
  }

  fontWeight(fontFamily: FontFamily) {
    const maxFace = Math.max(...fontFamily.faces.map((face) => Number(face)));
    return maxFace;
  }
}
