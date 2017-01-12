import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Routing, RootComponent } from './../../routes';

@Component({
  selector: 'hymn-entry-login',
  template: require('./entryLogin.html'),
})

export class EntryComponent {
  title : string;

  user: {
    name: string;
    password: string;
  }

	constructor (private route: ActivatedRoute,
    private router: Router) {
			this.user = {
      	name: '',
     		password: '',
    	}
		}

	login() {
		  var navToProfile = (data) => {
      if (data) {
        this.user = data;
  		this.router.navigate(['entry/resources']);
			}
		}
	}
}
