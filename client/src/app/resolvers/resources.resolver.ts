import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ContentfulService } from '../services/contentful.service';

@Injectable()
export class TransactionResolver implements Resolve<any> {
  constructor(
    private contentfulService: ContentfulService
  ) {}

  resolve(route: ActivatedRouteSnapshot): void {
    // return this.contentfulService.getResourcesForm();
  }
}
