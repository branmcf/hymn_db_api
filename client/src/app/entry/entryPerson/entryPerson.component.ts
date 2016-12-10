import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'hymn-entry-person',
  template: require('./entryPerson.html'),
})

export class EntryPersonComponent {
  constructor (private route: ActivatedRoute,
    private router: Router) {

  }

	next() {
  	this.router.navigate(['entry/congregations']);
	}
}
