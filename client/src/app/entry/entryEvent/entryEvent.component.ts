import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContentfulService } from './../../services/contentful.service';
import { SubmitService } from './../../services/submit.service';


@Component({
  selector: 'hymn-entry-event',
  template: require('./entryEvent.html'),
})

export class EntryEventComponent implements OnInit {
  content: JSON;
  submission: any;
  eventOccurance: any;

  constructor (private route: ActivatedRoute,
    private router: Router,
    private contentful: ContentfulService,
    private submitService: SubmitService) {

  }

  ngOnInit() {
    this.contentful.getEventForm().then((content) => {
      this.content = JSON.parse(content);
    });
    this.route.params.forEach(x => this.load(+x['user.id']));

    this.submission = {
      type: 'Event',
      data: {
        title: '',
        occurance: '',
        url: '',
        parent: '',
        topic: '',
        description: '',
        event_date: '',
        cost: '',
        city: '',
        state: '',
        country: '',
        hymn_soc_member: ''
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
    var userInfo = sessionStorage.getItem('userInfo');
    var obj = (JSON.parse(userInfo));

    this.submission.user = obj.first_name + ' ' + obj.last_name;
    this.submission.uid = obj.user_id;

    if(this.eventOccurance) {
      this.submission.data.occurance = this.eventOccurance;
    }
    console.log(this.submission);

    this.submitService.submitEvent(this.submission);

	}
}
