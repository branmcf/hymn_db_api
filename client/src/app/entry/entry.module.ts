import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Routing, RootComponent } from './../routes';
import { FormsModule } from '@angular/forms';

import { EntryComponent } from './entryLogin/entryLogin.component';
import { EntryResourcesComponent } from './entryResources/entryResources.component';
import { EntryPersonComponent } from './entryPerson/entryPerson.component';
import { EntryCongregationComponent } from './entryCongregation/entryCongregation.component';
import { EntryOrgsComponent } from './entryOrgs/entryOrgs.component';
import { EntryEventComponent } from './entryEvent/entryEvent.component';
import { EntryReviewComponent } from './entryReview/entryReview.component';
import { HeaderModule } from '../header/header.module';
import { SharedModule } from './../shared/shared.module';

import { SubmitService } from '../services/submit.service';
import { ContentfulService } from '../services/contentful.service';

@NgModule({
  id: 'entry',
  declarations: [
    EntryResourcesComponent,
    EntryComponent,
    EntryPersonComponent,
    EntryCongregationComponent,
    EntryOrgsComponent,
    EntryEventComponent,
    EntryReviewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    HeaderModule,
    SharedModule,
    RouterModule.forRoot([
      { path: 'entry', component: EntryComponent },
      { path: 'entry/resources', component: EntryResourcesComponent },
      { path: 'entry/person', component: EntryPersonComponent },
      { path: 'entry/congregations', component: EntryCongregationComponent },
      { path: 'entry/orgs', component: EntryOrgsComponent },
      { path: 'entry/events', component: EntryEventComponent }
    ])
  ],
  providers: [
    SubmitService,
    ContentfulService
  ],
  exports: [
    RouterModule
  ]
})

export class EntryModule {
}
