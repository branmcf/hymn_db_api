import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContentfulService } from './../../services/contentful.service';

@Component({
  selector: 'hymn-entry-resources',
  template: require('./entryResources.html'),
  styleUrls: ['app/shared/entryNavbar/entryNavbar.css'],
  providers: [ContentfulService]
})

export class EntryResourcesComponent {
  public title;
  public instructions;

	constructor (private route: ActivatedRoute,
    private router: Router,
    private contentful: ContentfulService) {
  }

  ngOnInit() {
    this.contentful.getResourcesForm()
      .then((content) => {
        content = JSON.parse(content);
        this.title = content.fields.title;
        this.instructions = content.fields.instructions;
        console.log(this.instructions);
      });
  }

	next() {
  	this.router.navigate(['entry/person']);
	}
}
