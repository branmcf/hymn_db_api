import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Routing, RootComponent } from './../routes';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { EntryComponent } from './entryLogin/entryLogin.component';
import { EntryResourcesComponent } from './entryResources/entryResources.component';
import { EntryPersonComponent } from './entryPerson/entryPerson.component';
import { EntryCongregationComponent } from './entryCongregation/entryCongregation.component';
import { EntryOrgsComponent } from './entryOrgs/entryOrgs.component';
import { EntryEventComponent } from './entryEvent/entryEvent.component';
import { EntryReviewComponent } from './entryReview/entryReview.component';
import { EntryLandingComponent } from './entryLanding/entryLanding.component';
import { HeaderModule } from '../header/header.module';
import { SharedModule } from './../shared/shared.module';

import { SubmitService } from '../services/submit.service';
import { ContentfulService } from '../services/contentful.service';
import { UserService } from '../services/user.service';

@NgModule({
  id: 'entry',
  declarations: [
    EntryResourcesComponent,
    EntryComponent,
    EntryLandingComponent,
    EntryPersonComponent,
    EntryCongregationComponent,
    EntryOrgsComponent,
    EntryEventComponent,
    EntryReviewComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    HeaderModule,
    SharedModule,
    RouterModule.forRoot([
      { path: 'entry', component: EntryComponent },
      { path: 'entry/welcome', component: EntryLandingComponent },
      { path: 'entry/resources', component: EntryResourcesComponent },
      { path: 'entry/person', component: EntryPersonComponent },
      { path: 'entry/congregations', component: EntryCongregationComponent },
      { path: 'entry/orgs', component: EntryOrgsComponent },
      { path: 'entry/events', component: EntryEventComponent },
      { path: 'entry/review', component: EntryReviewComponent },
    ])
  ],
  providers: [
    SubmitService,
    ContentfulService,
    UserService,
  ],
  exports: [
    RouterModule
  ]
})

export class EntryModule {
}
