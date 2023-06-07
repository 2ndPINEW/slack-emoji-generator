import { Injectable } from '@angular/core';
import { from, map, of } from 'rxjs';
import Fuse from 'fuse.js';

interface FontData {
  family: string;
  fullName: string;
  postscriptName: string;
  style: string;
}

export interface FontFamily {
  family: string;
  faces: string[];
  query: string;
}

declare global {
  interface Window {
    queryLocalFonts: () => Promise<FontData[]>;
  }
  interface Navigator {
    fonts: {
      query: () => Promise<FontData[]>;
    };
  }
}

/**
 * ローカルにインストールされているフォントを取得、切り替えるためのサービス
 */
@Injectable({
  providedIn: 'root',
})
export class LocalFontService {
  readonly isLocalFontApiSupport =
    window.queryLocalFonts !== undefined ||
    navigator.fonts?.query !== undefined;

  constructor() {}

  queryLocalFonts$() {
    if (window.queryLocalFonts) {
      return from(window.queryLocalFonts());
    }
    if (navigator.fonts?.query) {
      return from(navigator.fonts.query());
    }
    return of([] as FontData[]);
  }

  // めちゃなうい記事発見
  // https://developer.chrome.com/blog/how-boxysvg-uses-the-local-font-access-api/
  fontFamilies$() {
    return this.queryLocalFonts$().pipe(
      map((localFonts) => {
        const fontsIndex: FontFamily[] = [];

        for (const localFont of localFonts) {
          let face = '400';

          let subfamily = localFont.style.toLowerCase();
          subfamily = subfamily.replaceAll(' ', '');
          subfamily = subfamily.replaceAll('-', '');
          subfamily = subfamily.replaceAll('_', '');

          if (subfamily.includes('thin')) {
            face = '100';
          } else if (subfamily.includes('extralight')) {
            face = '200';
          } else if (subfamily.includes('light')) {
            face = '300';
          } else if (subfamily.includes('medium')) {
            face = '500';
          } else if (subfamily.includes('semibold')) {
            face = '600';
          } else if (subfamily.includes('extrabold')) {
            face = '800';
          } else if (subfamily.includes('ultrabold')) {
            face = '900';
          } else if (subfamily.includes('bold')) {
            face = '700';
          }

          if (subfamily.includes('italic')) {
            face += 'i';
          }

          const descriptor = fontsIndex.find(
            (desc) => desc.family === localFont.family
          );

          if (descriptor) {
            if (descriptor.faces.includes(face) === false) {
              descriptor.faces.push(face);
            }
            descriptor.query += `, ${localFont.fullName}`;
          } else {
            const desc = {
              family: localFont.family,
              faces: [face],
              query: localFont.fullName,
            };

            fontsIndex.push(desc);
          }
        }
        return fontsIndex;
      })
    );
  }

  searchFontFamilies$(query: string) {
    return this.fontFamilies$().pipe(
      map((fontFamilies) => {
        if (query === '') {
          return fontFamilies;
        }

        const fuse = new Fuse(fontFamilies, {
          includeScore: true,
          keys: ['family', 'query'],
        });
        const queryLowerCase = query.toLowerCase();
        return fuse.search(queryLowerCase).map((result) => {
          return result.item;
        });
      })
    );
  }
}
