import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'hymn-entry-congregation',
  template: require('./entryCongregation.html'),
  styleUrls: ['app/shared/entryNavbar/entryNavbar.css']
})

export class EntryCongregationComponent {
  constructor (private route: ActivatedRoute,
    private router: Router) {

  }

	next() {
  	this.router.navigate(['entry/orgs']);
	}
}
