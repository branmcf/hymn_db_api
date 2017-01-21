import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UserService } from './../../services/user.service'

@Component({
  selector: 'hymn-entry-login',
  template: require('./entryLogin.html'),
})

export class EntryComponent {
  user: {
		id: number;
    email: string;
    password: string;
  }




	constructor (private route: ActivatedRoute,
    private router: Router,
		private loginService : UserService) {
			this.user = {
				id: 1,
      	email: '',
     		password: '',
    	}
		}

	ngOnInit() {

	}

	login() {
		  // var navToProfile = (data) => {
      // if (data) {
      //   this.user = data;
  		this.router.navigate(['entry/resources']);
			// }
		}

		// this.loginService.loginUser(this.user).then(navToProfile);
}
