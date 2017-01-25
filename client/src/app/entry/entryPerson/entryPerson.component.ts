import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContentfulService } from './../../services/contentful.service';
import { SubmitService } from './../../services/submit.service';


@Component({
  selector: 'hymn-entry-person',
  template: require('./entryPerson.html'),
})

export class EntryPersonComponent implements OnInit {
  content: JSON;
  submission: any;

  constructor (private route: ActivatedRoute,
    private router: Router,
    private contentful: ContentfulService,
    private submitService: SubmitService) {
  }

  ngOnInit() {
    this.contentful.getPersonForm().then((content) => {
      this.content = JSON.parse(content);
    });
    this.route.params.forEach(x => this.load(+x['user.id']));

    this.submission = {
      type: 'Person',
      data: {
        first_name: '',
        last_name: '',
        email: '',
        city: '',
        state: '',
        country: '',
        url: '',
        social_url: '',
        emphasis: '',
        hymn_soc_member: '',
        topics: {
          Contemporary_Song_Band: false,
          Traditional_Hymnody: false,
          Musician_Pastor_Relationship_Song_Band: false,
          Cantoring: false,
          Song_Enlivening: false,
          Keyboards: false,
          Worship_Planning: false
        },
        ethnicities: {
          White: false,
          Black: false,
          Hispanic_Latin_American_Caribbean: false,
          Native_American_Indigenous_Peoples: false,
          Asian: false,
          Middle_Eastern: false,
          Other: ''
        },
        categories: {
          Choir: false,
          Cantor: false,
          Song_Enlivener: false,
          Solo: false,
          Lead_Singer_from_Band_with_Other_Vocalists: false,
          Other: ''

        }
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
    var userInfo = sessionStorage.getItem('userInfo');
    var obj = (JSON.parse(userInfo));

    this.submission.user = obj.first_name + ' ' + obj.last_name;
    this.submission.uid = obj.user_id;

    console.log(this.submission);

    this.submitService.submitPerson(this.submission);
  }

	
}
