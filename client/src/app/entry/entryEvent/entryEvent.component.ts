import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContentfulService } from './../../services/contentful.service';

@Component({
  selector: 'hymn-entry-event',
  template: require('./entryEvent.html'),
})

export class EntryEventComponent implements OnInit {
  content: JSON;
  title: string;
  occurance: any;
  url: string;
  parent: string;
  topic: string;
  desc: string;
  date: string;
  cost: any;
  city: string;
  state: string;
  country: string;
  isInvolved: any;

  submission: {
    title: string;
    occurance: any;
    url: string;
    parent: string;
    topic: string;
    desc: string;
    date: string;
    cost: any;
    city: string;
    state: string;
    country: string;
    isInvolved: any;
  }
  constructor (private route: ActivatedRoute,
    private router: Router,
    private contentful: ContentfulService) {

  }

  ngOnInit() {
    this.contentful.getEventForm().then((content) => {
      this.content = JSON.parse(content);
    });
    this.route.params.forEach(x => this.load(+x['user.id']));
    this.title = '';
    this.occurance = '';
    this.url = '';
    this.parent = '';
    this.topic = '';
    this.desc = '';
    this.date = '';
    this.cost = '';
    this.city = '';
    this.state = '';
    this.country = '';
    this.isInvolved = '';

    this.submission = {
      title: '',
      occurance: '',
      url: '',
      parent: '',
      topic: '',
      desc: '',
      date: '',
      cost: '',
      city: '',
      state: '',
      country: '',
      isInvolved: ''
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


	next() {
  	this.router.navigate(['']);
	}
}
