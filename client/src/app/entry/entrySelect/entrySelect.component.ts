import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'hymn-entry-select',
  template: require('./entrySelect.html'),
//   styleUrls: ['app/shared/entryNavbar/entryNavbar.css']
})

export class EntrySelectComponent {
	constructor (private route: ActivatedRoute,
    private router: Router) {

  }

}
