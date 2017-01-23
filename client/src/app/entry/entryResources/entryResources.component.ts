import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContentfulService } from './../../services/contentful.service';

@Component({
  selector: 'hymn-entry-resources',
  template: require('./entryResources.html'),
  providers: [ContentfulService]
})

export class EntryResourcesComponent implements OnInit {
  content: JSON;
  submission: any;

	constructor (private route: ActivatedRoute,
    private router: Router,
    private contentful: ContentfulService) {
}

  ngOnInit() {
    this.contentful.getResourcesForm().then((content) => {
      this.content = JSON.parse(content);
    });

    this.route.params.forEach(x => this.load(+x['user.id']));

    this.submission = {
      type: 'Resource',
      data: {
        title: '',
        type: '',
        url: '',
        author: '',
        parent: '',
        description: '',
        categories: {
          A_hymn_written_prior_to_1970: false,
          Newly_composed_hymn_within_the_last_10_years: false,
          Song_by_local_church_musicians: false,
          Praise_and_Worship_Song_CCM: false,
          Psalm_Setting: false,
          Chant_Gregorian_Anglican_Pointed_or_Taize: false,
          Older_hymn_text_set_to_a_new_contemporary_tune_or_retuned: false,
          Song_from_another_country_or_World_Song: false,
          Secular_Song: false,
          other: ''
        },
        topic: {
          Psalm_Setting: false,
          Lectionary_Based: false,
          Social_Justice: false,
          other: ''
        },
        accompaniment: {
          Acappella: false,
          Organ: false,
          Piano: false,
          Guitar_no_band: false,
          Guitar_with_band: false,
          Orchestra: false,
          Handbells: false,
          Obligato: false,
          other: ''
        },
        languages: {
          English: false,
          Spanish: false,
          French: false,
          other: ''
        },
        ensembles: {
          Choir: false,
          Cantor: false,
          Song_Enlivener: false,
          Solo: false,
          Lead_Singer_from_Band_with_Other_Vocalists: false,
          other: ''
        },
        ethnicities: {
          White: false,
          Black: false,
          Hispanic_Latinx_Caribbean: false,
          Native_American_Indigenous_Peoples: false,
          Asian: false,
          African: false,
          Middle_Eastern: false,
          other: ''
        },
        hymn_soc_member: '',
        is_free: ''
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

	next() {
  	this.router.navigate(['entry/person']);
	}
}
