import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { EntryComponent } from './entry.component';
import { EntryResourcesComponent } from './resources.component';
import {HeaderModule} from '../header/header.module';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    HeaderModule,
    RouterModule.forChild([
      { path: 'entry', component: EntryComponent },
      { path: 'entry/resources', component: EntryResourcesComponent}
    ])
  ],
  declarations: [
    EntryResourcesComponent,
    EntryComponent
  ],
  exports: [
    EntryComponent,
    RouterModule
  ]
})

export class EntryModule {}
