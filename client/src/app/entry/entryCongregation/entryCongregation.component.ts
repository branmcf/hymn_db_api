import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { SubmitService } from './../../services/submit.service';
import { ContentfulService } from './../../services/contentful.service';


@Component({
  selector: 'hymn-entry-congregation',
  template: require('./entryCongregation.html')
})

export class EntryCongregationComponent {
  content: JSON;
  data: any;
  submission: any;
  countryOtherText: string;
  denomOther: string;
  shapeOther: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private submitService : SubmitService,
    private contentful: ContentfulService) {

  }

  ngOnInit() {
      this.contentful.getCongregationForm().then((content) => {
      this.content = JSON.parse(content);
    });

    this.route.params.forEach(x => this.load(+x['user.id']));

    this.submission = {
      type: 'Congregation',
      user: '',
      uid: '',
      data: {
        name: '',
        url: '',
        denomination: '',
        city: '',
        state: '',
        country: '',
        hymn_soc_member: '',
        categories: {
          A_hymn_written_prior_to_1970: false,
          Newly_composed_hymn_within_the_last_10_years: false,
          Praise_and_Worship_Song_CCM: false,
          Psalm_Setting: false,
          Chant_Gregorian_Anglican_Pointed_or_Taize: false,
          Older_hymn_text_set_to_a_new_contemporary_tune_or_retuned: false,
          Song_from_another_country_or_World_Song: false,
          Secular_Song: false,
        },
        instruments: {
          Acappella: false,
          Organ: false,
          Piano: false,
          Guitar_not_full_band: false,
          Band_guitar_bass_drums_etc: false,
          Orchestra_Wind_Ensemble: false,
          Handbells: false,
          Obligato_instruments_flute_clarinet_trumpet_etc: false,
          congInstruOther: ''
        },
        shape: '',
        clothing: '',
        geography: '',
        ethnicities: {
          White: false,
          Black: false,
          Hispanic_Latin_American_Caribbean: false,
          Native_American_Indigenous_Peoples: false,
          Asian: false,
          Middle_Eastern: false,
          congEthOther: ''
        },
        attendance: ''
      }
    };
  }

  typesOptions = [
    "A hymn written prior to 1970",
    "Newly composed hymn (within the last 10 years)",
    "Praise and Worship Song (CCM)",
    "Psalm Setting",
    "Chant (Gregorian, Anglican, Pointed or Taize)",
    "Older hymn text set to a new contemporary tune (or 're-tuned')",
    "Song from another country (or 'World Song')",
    "Secular Song"
  ]

  private getUser() {

  }

  private load(id) {
    if (!id) {
      return;
    }

    var onload = (data) => {
      if (data) {
        this.data = data;
      }
      else {

      }
    };
  }

  submit() {
    // this.submitService.submitCongregation(this.submission);
    var userInfo = sessionStorage.getItem('userInfo');
    var obj = (JSON.parse(userInfo));

    this.submission.user = obj.first_name + ' ' + obj.last_name;
    this.submission.uid = obj.user_id;

    if (this.countryOtherText) {
      this.submission.data.country = this.countryOtherText;
    }
    if (this.denomOther) {
      this.submission.data.denomination = this.denomOther;
    }
    if (this.shapeOther) {
      this.submission.data.shape = this.shapeOther;
    }
    console.log(this.submission);
    this.submitService.submitCongregation(this.submission);
  }

  next() {
    this.router.navigate(['entry/orgs']);
  }
}
