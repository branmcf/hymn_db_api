import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'hymn-sidebar',
  template: require('./entrySidebar.html'),
})

export class EntrySidebarComponent {
  constructor (private route: ActivatedRoute,
    private router: Router) {

  }

}
