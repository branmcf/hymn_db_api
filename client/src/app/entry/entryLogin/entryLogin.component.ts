import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Routing, RootComponent } from './../../routes';

@Component({
  selector: 'hymn-entry-login',
  template: require('./entryLogin.html'),
})

export class EntryComponent {
  title : string;
	user: any;

	constructor (private route: ActivatedRoute,
    private router: Router) {}

	next() {
  	this.router.navigate(['entry/resources']);
	}
}
