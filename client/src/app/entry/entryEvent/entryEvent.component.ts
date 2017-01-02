import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'hymn-entry-event',
  template: require('./entryEvent.html'),
  styleUrls: ['app/entry/entryEvent/entryEvent.css']
})

export class EntryEvent {
  constructor (private route: ActivatedRoute,
    private router: Router) {

  }

	next() {
  	this.router.navigate(['']);
	}
}
