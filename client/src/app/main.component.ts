import { Component } from '@angular/core';
import { ContentfulService } from './services/contentful.service';


@Component({
  selector: 'hymn-app',
  template: require('./main.html')
})
export class MainComponent {
  constructor(private contentful: ContentfulService) {}
}
