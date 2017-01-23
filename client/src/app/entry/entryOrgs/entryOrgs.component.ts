import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContentfulService } from './../../services/contentful.service';


@Component({
  selector: 'hymn-entry-orgs',
  template: require('./entryOrgs.html'),
})

export class EntryOrgsComponent implements OnInit {
  content: JSON;
  submission: any;

  constructor (private route: ActivatedRoute,
    private router: Router,
    private contentful: ContentfulService) {

  }

  ngOnInit() {
    this.contentful.getOrgsForm().then((content) => {
      this.content = JSON.parse(content);
    });
    this.route.params.forEach(x => this.load(+x['user.id']));

    this.submission = {
      type: 'Organization',
      
      data: {
        name: '',
        url: '',
        parent: '',
        denomination: '',
        city: '',
        state: '',
        country: '',
        geographic_area: '',
        resource_free: '',
        event_free: '',
        membership_free: '',
        mission: '',
        method: ''
        }
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

  submit() {
     // this.submitService.submitCongregation(this.submission);
    console.log(JSON.stringify(this.submission));
  }

}
