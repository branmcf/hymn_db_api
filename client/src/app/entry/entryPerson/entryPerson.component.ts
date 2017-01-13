import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'hymn-entry-person',
  template: require('./entryPerson.html'),
  styleUrls: ['app/shared/entryNavbar/entryNavbar.css']
})

export class EntryPersonComponent {
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
  }


  constructor (private route: ActivatedRoute,
  private router: Router) {


  }

  ngOnInit() {
    this.route.params.forEach(x => this.load(+x['user.id']));
    this.fname = '',
    this.lname = '',
    this.email = '',
    this.city = '',
    this.state = '',
    this.country = '',
    this.website = '',
    this.social = '',
    this.emphasis = '',
    this.isMember = '',
    this.topics = [],
    this.ethnicities = [],
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
