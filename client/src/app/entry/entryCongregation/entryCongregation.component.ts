import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { SubmitService } from './../../services/submit.service'

@Component({
  selector: 'hymn-entry-congregation',
  template: require('./entryCongregation.html'),
  styleUrls: ['app/shared/entryNavbar/entryNavbar.css']
})

export class EntryCongregationComponent {
  title: string;
  type: string;
  url: string;
  author: string;
  parent: string;
  desc: string;
  category: any[];
  topic: any[];
  accompany: any[];
  lang: any[];
  ensemble: any[];
  ethnicity: any;
  isInvolved: any;
  free: any;

  submission: {
    title: string;
    type: string;
    url: string;
    author: string;
    parent: string;
    desc: string;
    category: any[];
    topic: any[];
    accompany: any[];
    lang: any[];
    ensemble: any[];
    ethnicity: any;
    isInvolved: any;
    free: any;
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private submitService : SubmitService) {

  }

  ngOnInit() {
    this.route.params.forEach(x => this.load(+x['user.id']));

    this.title = '';
    this.type = '';
    this.url = '';
    this.author = '';
    this.parent = '';
    this.desc = '';
    this.category = [];
    this.topic = [];
    this.accompany = [];
    this.lang = [];
    this.ensemble = [];
    this.ethnicity = '';
    this.isInvolved = '';
    this.free = '';

    this.submission = {
      title: '',
      type: '',
      url: '',
      author: '',
      parent: '',
      desc: '',
      category: [],
      topic: [],
      accompany: [],
      lang: [],
      ensemble: [],
      ethnicity: '',
      isInvolved: '',
      free: '',
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

    this.au

  }



  submit() {
    this.submission.title = this.title;
    this.submission.type = this.type;
    this.submission.url = this.url;
    this.submission.author = this.author;
    this.submission.parent = this.parent;
    this.submission.desc = this.desc;
    this.submission.category = this.category;
    this.submission.topic = this.topic;
    this.submission.accompany = this.accompany;
    this.submission.lang = this.lang;
    this.submission.ensemble = this.ensemble;
    this.submission.ethnicity = this.ethnicity;
    this.submission.isInvolved = this.isInvolved;
    this.submission.free = this.free
  }

  next() {
    this.router.navigate(['entry/orgs']);
  }
}
