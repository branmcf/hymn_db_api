import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContentfulService } from './../../services/contentful.service';

@Component({
  selector: 'hymn-entry-landing',
  template: require('./entryLanding.html'),
})

export class EntryLandingComponent {
}