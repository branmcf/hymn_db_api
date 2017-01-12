import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'hymn-entry-orgs',
  template: require('./entryOrgs.html'),
  styleUrls: ['app/shared/entryNavbar/entryNavbar.css']
})

export class EntryOrgsComponent {
  name: string;
  url: string; 
  parent: string;
  denoms: any[];
  city: string;
  state: string;
  country: any;
  geo: any[];
  resourceFree: any;
  eventFree: any;
  membershipCharge: any;
  mission: string;
  method: string;

  submission: {
    name: string;
    url: string; 
    parent: string;
    denoms: any[];
    city: string;
    state: string;
    country: any;
    geo: any[];
    resourceFree: any;
    eventFree: any;
    membershipCharge: any;
    mission: string;
    method: string;
  }

  constructor (private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit() {
    this.route.params.forEach(x => this.load(+x['user.id']));
    this.name = '',
    this.url = '',
    this.parent = '',
    this.denoms = [],
    this.city = '',
    this.state = '',
    this.country = '',
    this.geo = [],
    this.resourceFree = '',
    this.eventFree = '',
    this.membershipCharge = '',
    this.mission = '',
    this.method = ''
  
    this.submission = {
      name: '',
      url: '',
      parent: '',
      denoms: [],
      city: '',
      state: '',
      country: '',
      geo: [],
      resourceFree: '',
      eventFree: '',
      membershipCharge: '',
      mission: '',
      method: ''
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
  	this.router.navigate(['entry/orgs']);
	}
}
