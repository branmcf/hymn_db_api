import { Component } from '@angular/core';

@Component({
  selector: 'hymn-entry',
  template: require('./entry.html'),
})

export class EntryComponent {
  title : string;
	user: any;
	departments: any[];

	constructor () {
      this.departments = [
			{ id: 1, name: 'IT' },
			{ id: 2, name: 'Marketing' },
			{ id: 3, name: 'Accounting' },
			{ id: 4, name: 'HR' }
		];

			this.user = {};

			this.title = 'New Account';
  }


	next() {
    console.log('next');
	}
}
