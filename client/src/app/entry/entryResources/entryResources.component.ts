import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'hymn-entry-resources',
  template: require('./entryResources.html'),
  styleUrls: ['app/shared/entryNavbar/entryNavbar.css']
})

export class EntryResourcesComponent {
	constructor (private route: ActivatedRoute,
    private router: Router) {

  }

	next() {
  	this.router.navigate(['entry/person']);
	}
}
