import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routing, RootComponent } from './routes';

import { HeaderModule } from './header/header.module';
import { EntryModule } from './entry/entry.module';

import { MainComponent } from './main.component';
import { TitleComponent } from './title/title.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    BrowserModule,
    HeaderModule,
    Routing,
    EntryModule
  ],
  declarations: [
    RootComponent,
    MainComponent,
    TitleComponent,
    FooterComponent,
  ],
  bootstrap: [
    RootComponent
  ],
  providers: [
  ]
})

export class AppModule {
  constructor() {
    
  }
}
