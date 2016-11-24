import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing, RootComponent} from './routes';

import {EntryComponent} from './entry/entry.component';
import {MainComponent} from './main.component';
import {HeaderComponent} from './header/header.component';
import {TitleComponent} from './title/title.component';
import {FooterComponent} from './footer/footer.component';

@NgModule({
  imports: [
    BrowserModule,
    routing,
  ],
  declarations: [
    RootComponent,
    MainComponent,
    HeaderComponent,
    TitleComponent,
    FooterComponent,
    EntryComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
