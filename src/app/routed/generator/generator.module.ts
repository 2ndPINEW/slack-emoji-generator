import { NgModule } from '@angular/core';

import { GeneratorRoutingModule } from './generator-routing.module';
import { GeneratorComponent } from './generator.component';
import { FontSelectorComponent } from './components/font-selector/font-selector.component';
import { AppSharedModule } from 'src/app/app.shared.module';

@NgModule({
  declarations: [GeneratorComponent, FontSelectorComponent],
  imports: [GeneratorRoutingModule, AppSharedModule],
})
export class GeneratorModule {}
