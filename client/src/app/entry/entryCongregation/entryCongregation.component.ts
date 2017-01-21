import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { SubmitService } from './../../services/submit.service';
import { ContentfulService } from './../../services/contentful.service';


@Component({
  selector: 'hymn-entry-congregation',
  template: require('./entryCongregation.html'),
  styleUrls: ['app/shared/entryNavbar/entryNavbar.css']
})

export class EntryCongregationComponent {
  content: JSON;
  // name: string;
  // url: string;
  // city: string;
  // state: string;
  // country: any;
  // denom: any;
  // members: any;
  // type: any[];
  // instrument: any[];
  // shape: any;
  // attire: any;
  // location: any;
  // ethnicity: any[];
  // attendance: any;

  submission: any;

  // submission: {
  //   name: string;
  //   url: string;
  //   city: string;
  //   state: string;
  //   country: any;
  //   denom: any;
  //   members: any;
  //   type: any[];
  //   instrument: any[];
  //   shape: any;
  //   attire: any;
  //   location: any;
  //   ethnicity: any[];
  //   attendance: any;
  // };



  constructor(private route: ActivatedRoute,
    private router: Router,
    private submitService : SubmitService,
    private contentful: ContentfulService) {

  }

  ngOnInit() {
    this.contentful.getCongregationForm().then((content) => {
      this.content = JSON.parse(content);
      this.submission = {};
      this.submission.type = {};
    });

    this.route.params.forEach(x => this.load(+x['user.id']));
    // this.name = '';
    // this.url = '';
    // this.city = '';
    // this.state = '';
    // this.country = '';
    // this.denom = '';
    // this.members = [];
    // this.type = [];
    // this.instrument = [];
    // this.shape = '';
    // this.attire = '';
    // this.location = '';
    // this.ethnicity = [];
    // this.attendance = '';

    this.submission = {
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
        // congType1: '',
        // congType2: '',
        // congType3: '',
        // congType4: '',
        // congType5: '',
        // congType6: '',
        // congType7: '',
        // congType8: '',
      },
      instrument: [],
      shape: '',
      attire: '',
      location: '',
      ethnicity: [],
      attendance: '',
      temp: '',
    }
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
        this.submission = data;
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
