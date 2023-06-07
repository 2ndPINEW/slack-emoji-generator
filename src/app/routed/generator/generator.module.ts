import { NgModule } from '@angular/core';

import { GeneratorRoutingModule } from './generator-routing.module';
import { GeneratorComponent } from './generator.component';
import { FontSelectorComponent } from './components/font-selector/font-selector.component';
import { AppSharedModule } from 'src/app/app.shared.module';
import { CanvasComponent } from './components/canvas/canvas.component';
import { TextareaComponent } from './components/textarea/textarea.component';

@NgModule({
  declarations: [GeneratorComponent, FontSelectorComponent, CanvasComponent, TextareaComponent],
  imports: [GeneratorRoutingModule, AppSharedModule],
})
export class GeneratorModule {}
