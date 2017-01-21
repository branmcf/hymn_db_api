import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContentfulService } from './../../services/contentful.service';

@Component({
  selector: 'hymn-entry-person',
  template: require('./entryPerson.html'),
})

export class EntryPersonComponent implements OnInit {
  content: JSON;
  fname: string;
  lname: string;
  email: string;
  city: string;
  state: string;
  country: string;
  website: string;
  social: string;
  emphasis: string;
  isMember: any;
  topics: any[];
  ethnicities: any[];
  categories: any[];

  submission: {
    fname: string;
    lname: string;
    email: string;
    city: string;
    state: string;
    country: string;
    website: string;
    social: string;
    emphasis: string;
    isMember: any;
    topics: any[];
    ethnicities: any[];
    categories: any[];
  };

  constructor (private route: ActivatedRoute,
    private router: Router,
    private contentful: ContentfulService) {
  }

  ngOnInit() {
    this.contentful.getPersonForm().then((content) => {
      this.content = JSON.parse(content);
    });
    this.route.params.forEach(x => this.load(+x['user.id']));
    this.fname = '';
    this.lname = '';
    this.email = '';
    this.city = '';
    this.state = '';
    this.country = '';
    this.website = '';
    this.social = '';
    this.emphasis = '';
    this.isMember = '';
    this.topics = [];
    this.ethnicities = [];
    this.categories = [];

    this.submission = {
      fname: '',
      lname: '',
      email: '',
      city: '',
      state: '',
      country: '',
      website: '',
      social: '',
      emphasis: '',
      isMember: '',
      topics: [],
      ethnicities: [],
      categories: []
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
  	this.router.navigate(['entry/congregations']);
	}
}
