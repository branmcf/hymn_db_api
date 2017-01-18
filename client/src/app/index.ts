import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routing, RootComponent } from './routes';

import { HeaderModule } from './header/header.module';
import { EntryModule } from './entry/entry.module';
import { FormsModule } from '@angular/forms';

import { MainComponent } from './main.component';
import { TitleComponent } from './title/title.component';
import { FooterComponent } from './footer/footer.component';
import { InMemoryWebApiModule, InMemoryBackendService } from 'angular-in-memory-web-api';

import { ContentfulService } from './services/contentful.service';


@NgModule({
  imports: [
    BrowserModule,
    HeaderModule,
    Routing,
    EntryModule,
    FormsModule,
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
    ContentfulService
  ]
})

export class AppModule {
  constructor() {
    
  }
}
