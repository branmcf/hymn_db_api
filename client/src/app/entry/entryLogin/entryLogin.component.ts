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
		private userService : UserService) {
    	
		}

  ngOnInit() {
		this.user = {}
	}

  login() {
      this.userService.login(this.user).then(x => {
            var responseInfo = JSON.parse(x);
            console.log(responseInfo);
            sessionStorage.setItem('userInfo', JSON.stringify(responseInfo));
            this.router.navigateByUrl('entry/welcome');
        });
    }
}
