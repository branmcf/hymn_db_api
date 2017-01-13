import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { SubmitService } from './../../services/submit.service'

@Component({
  selector: 'hymn-entry-congregation',
  template: require('./entryCongregation.html'),
  styleUrls: ['app/shared/entryNavbar/entryNavbar.css']
})

export class EntryCongregationComponent {
  name: string;
  url: string;
  city: string;
  state: string;
  country: any;
  denom: any;
  members: any;
  type: any[];
  instrument: any[];
  shape: any;
  attire: any;
  location: any;
  ethnicity: any[];
  attendance: any;

  submission: {
    name: string;
    url: string;
    city: string;
    state: string;
    country: any;
    denom: any;
    members: any;
    type: any[];
    instrument: any[];
    shape: any;
    attire: any;
    location: any;
    ethnicity: any[];
    attendance: any;
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private submitService : SubmitService) {

  }

  ngOnInit() {
    this.route.params.forEach(x => this.load(+x['user.id']));
    this.name = '',
    this.url = '',
    this.city = '',
    this.state = '',
    this.country = '',
    this.denom = '',
    this.members = [],
    this.type = [],
    this.instrument = [],
    this.shape = '',
    this.attire = '',
    this.location = '',
    this.ethnicity = [],
    this.attendance = '',

    this.submission = {
      name: '',
      url: '',
      city: '',
      state: '',
      country: '',
      denom: '',
      members: [],
      type: [],
      instrument: [],
      shape: '',
      attire: '',
      location: '',
      ethnicity: [],
      attendance: '',
    }
  }

  private load(id) {
    if (!id) {
      return;
    }

    var onload = (data) => {
      if (data) {
        this.submission = data;
      } else {

      }
    };

  }



  submit() {
    // this.submission.title = this.title;
    // this.submission.type = this.type;
    // this.submission.url = this.url;
    // this.submission.author = this.author;
    // this.submission.parent = this.parent;
    // this.submission.desc = this.desc;
    // this.submission.category = this.category;
    // this.submission.topic = this.topic;
    // this.submission.accompany = this.accompany;
    // this.submission.lang = this.lang;
    // this.submission.ensemble = this.ensemble;
    // this.submission.ethnicity = this.ethnicity;
    // this.submission.isInvolved = this.isInvolved;
    // this.submission.free = this.free
  }

  next() {
    this.router.navigate(['entry/orgs']);
  }
}
