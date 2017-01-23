import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UserService } from './../../services/user.service'

@Component({
  selector: 'hymn-entry-login',
  template: require('./entryLogin.html'),
})

export class EntryComponent {
  user: any;
  incorrect: boolean;

	constructor (private route: ActivatedRoute,
    private router: Router,
		private loginService : UserService) {
    	
		}

	ngOnInit() {
		this.user = {}
		this.incorrect = false;
	}

    login() {
        this.loginService.login(this.user).then(x => {
						document.cookie = "isLoggedIn=true";
            this.router.navigateByUrl('entry/welcome');
        });
    }
}
