import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing, RootComponent} from './routes';

import {HeaderModule} from './header/header.module';
import {EntryModule} from './entry/entry.module';

import {MainComponent} from './main.component';
import {TitleComponent} from './title/title.component';
import {FooterComponent} from './footer/footer.component';

@NgModule({
  imports: [
    BrowserModule,
    HeaderModule,
    routing,
    EntryModule
  ],
  declarations: [
    RootComponent,
    MainComponent,
    TitleComponent,
    FooterComponent,
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
