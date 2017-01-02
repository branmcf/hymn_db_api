import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Routing, RootComponent } from './../routes';

import { EntryComponent } from './entryLogin/entryLogin.component';
import { EntryResourcesComponent } from './entryResources/entryResources.component';
import { EntryPersonComponent } from './entryPerson/entryPerson.component';
import { EntryCongregationComponent } from './entryCongregation/entryCongregation.component';
import { EntryOrgsComponent } from './entryOrgs/entryOrgs.component'
import { EntryEvent } from './entryEvent/entryEvent.component'
import { HeaderModule } from '../header/header.module';
import { SharedModule } from './../shared/shared.module'

@NgModule({
  id: 'entry',
  declarations: [
    EntryResourcesComponent,
    EntryComponent,
    EntryPersonComponent,
    EntryCongregationComponent,
    EntryOrgsComponent,
    EntryEvent
  ],
  imports: [
    CommonModule,
    HttpModule,
    HeaderModule,
    SharedModule,
    RouterModule.forRoot([
      { path: 'entry', component: EntryComponent },
      { path: 'entry/resources', component: EntryResourcesComponent },
      { path: 'entry/person', component: EntryPersonComponent },
      { path: 'entry/congregations', component: EntryCongregationComponent },
      { path: 'entry/orgs', component: EntryOrgsComponent },
      { path: 'entry/event', component: EntryEvent }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class EntryModule {
  constructor() {

  }
}
