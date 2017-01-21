import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContentfulService } from './../../services/contentful.service';


@Component({
  selector: 'hymn-entry-orgs',
  template: require('./entryOrgs.html'),
})

export class EntryOrgsComponent implements OnInit {
  content: JSON;
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
  };

  constructor (private route: ActivatedRoute,
    private router: Router,
    private contentful: ContentfulService) {

  }

  ngOnInit() {
    this.contentful.getOrgsForm().then((content) => {
      this.content = JSON.parse(content);
    });
    this.route.params.forEach(x => this.load(+x['user.id']));
    this.name = '';
    this.url = '';
    this.parent = '';
    this.denoms = [];
    this.city = '';
    this.state = '';
    this.country = '';
    this.geo = [];
    this.resourceFree = '';
    this.eventFree = '';
    this.membershipCharge = '';
    this.mission = '';
    this.method = '';
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
    };
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

}
