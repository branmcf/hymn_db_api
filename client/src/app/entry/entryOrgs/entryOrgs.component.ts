import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'hymn-entry-orgs',
  template: require('./entryOrgs.html'),
})

export class EntryOrgsComponent {
  constructor (private route: ActivatedRoute,
    private router: Router) {

  }

	next() {
  	this.router.navigate(['entry/orgs']);
	}
}
