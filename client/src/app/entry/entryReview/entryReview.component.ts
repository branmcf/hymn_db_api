import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'hymn-entry-review',
  template: require('./entryReview.html'),
//   styleUrls: ['app/shared/entryNavbar/entryNavbar.css']
})

export class EntryReviewComponent {
	constructor (private route: ActivatedRoute,
    private router: Router) {

  }

	next() {
  	this.router.navigate(['entry/person']);
	}
}
