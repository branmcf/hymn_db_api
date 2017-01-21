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
      type: [],
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
  typesOptionsMap = {
    "A hymn written prior to 1970" : false,
    "Newly composed hymn (within the last 10 years)" : false,
    "Praise and Worship Song (CCM)" : false,
    "Psalm Setting" : false,
    "Chant (Gregorian, Anglican, Pointed or Taize)" : false,
    "Older hymn text set to a new contemporary tune (or 're-tuned')" : false,
    "Song from another country (or 'World Song')" : false,
    "Secular Song" : false
  };
  typesOptionsChecked = [];

  initTypesOptionsMap() {
      for (var x = 0; x < this.typesOptions.length; x++) {
      this.typesOptionsMap[this.typesOptions[x]] = false;
    }
  }

  updateCheckedOptions(option, event) {
   this.typesOptionsMap[option] = event.target.checked;
  }

  updateOptions() {
    for(var x in this.typesOptionsMap) {
        if(this.typesOptionsMap[x]) {
            this.typesOptionsChecked.push(x);
        }
    }
    this.typesOptions = this.typesOptionsChecked;
    this.typesOptionsChecked = [];
  }

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
