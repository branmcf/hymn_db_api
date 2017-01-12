import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContentfulService } from './../../services/contentful.service';

@Component({
  selector: 'hymn-entry-resources',
  template: require('./entryResources.html'),
  styleUrls: ['app/shared/entryNavbar/entryNavbar.css'],
  providers: [ContentfulService]
})

export class EntryResourcesComponent implements OnInit {
  public content;
  private observer;
	constructor (private route: ActivatedRoute,
    private router: Router,
    private contentful: ContentfulService) {
      this.observer = {
        next: x => {
          console.log('Observer got a next value: ' + JSON.stringify(x));
        },
        error: err => console.error('Observer got an error: ' + err),
        complete: () => console.log('Observer got a complete notification')
      };
  }
  ngOnInit() {
    // tslint:disable-next-line:no-string-literal
    // this.content = this.route.snapshot.data['content'];
    // this.contentful.getResourcesForm().subscribe(this.observer);
    this.contentful.getResourcesForm().then((content) => {
      this.content = JSON.parse(content);
    });
  }

	next() {
  	this.router.navigate(['entry/person']);
	}
}
