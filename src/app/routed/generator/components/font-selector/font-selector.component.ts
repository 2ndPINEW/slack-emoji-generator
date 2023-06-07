import { Component } from '@angular/core';
import {
  FontFamily,
  LocalFontService,
} from 'src/app/services/local-font.service';

@Component({
  selector: 'app-font-selector',
  templateUrl: './font-selector.component.html',
  styleUrls: ['./font-selector.component.scss'],
})
export class FontSelectorComponent {
  query = '';

  fontFamilies: FontFamily[] = [];

  showPullDown = false;

  currentFontFamily: FontFamily | null = null;

  constructor(private localFontService: LocalFontService) {}

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
    this.currentFontFamily = fontFamily;
    this.showPullDown = false;
  }

  isCurrentFontFamily(fontFamily: FontFamily) {
    // TODO: 仮なので後で直す
    return this.currentFontFamily?.family === fontFamily.family;
  }
}
