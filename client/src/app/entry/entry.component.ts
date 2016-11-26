import { Component } from '@angular/core';

@Component({
  selector: 'hymn-entry',
  template: require('./entry.html'),
})

export class EntryComponent {
  title : string;
	user: any;

	constructor () {
			this.user = {};
			this.title = 'New Account';
  }

	next() {
    console.log('next');
	}
}
