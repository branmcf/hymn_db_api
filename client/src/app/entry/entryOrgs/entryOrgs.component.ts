import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContentfulService } from './../../services/contentful.service';


@Component({
  selector: 'hymn-entry-orgs',
  template: require('./entryOrgs.html'),
  styleUrls: ['app/shared/entryNavbar/entryNavbar.css']
})

export class EntryOrgsComponent implements OnInit{
  public content;
  constructor (private route: ActivatedRoute,
    private router: Router,
    private contentful: ContentfulService) {

  }

	next() {
  	this.router.navigate(['entry/orgs']);
	}

  ngOnInit() {
    this.contentful.getOrgsForm().then((content) => {
      this.content = JSON.parse(content);
    });
  }
}
