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

  constructor(private route: ActivatedRoute,
    private router: Router,
    private submitService : SubmitService,
    private contentful: ContentfulService) {

  }

  ngOnInit() {
    this.contentful.getCongregationForm().then((content) => {
      this.content = JSON.parse(content);
      this.submission = {}
      this.submission.data = {};
      this.submission.data.type = {};
      this.submission.data.instruments = {};
      this.submission.data.ethnicities = {};
    });

    this.route.params.forEach(x => this.load(+x['user.id']));

    this.submission = {
      type: "Congregation",

      data: {
        name: '',
        url: '',
        city: '',
        state: '',
        country: '',
        denom: '',
        members: [],
        type: {
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
        attire: '',
        location: '',
        ethnicities: {
          White: false,
          Black: false,
          Hispanic_Latin_American_Caribbean: false,
          Native_American_Indigenous_Peoples: false,
          Asian: false,
          Middle_Eastern: false,
          congEthOther: ''
        },
        attendance: '',
        temp: '',
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
    console.log(this.submission);
  }

  next() {
    this.router.navigate(['entry/orgs']);
  }
}
