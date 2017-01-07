import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import * as contentful from 'contentful';
import * as util from 'util';

declare var process: any;

@Injectable()
export class ContentfulService { 

    private client = contentful.createClient({
        // This is the space ID. A space is like a project folder in Contentful terms
        space: process.env.CONTENTFUL_SPACE,
        // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
        accessToken: process.env.CONTENTFUL_TOKEN
    });
    constructor() { 

        this.client.getEntry('6dbjWqNd9SqccegcqYq224')
        .then(function (entry) {
            console.log(util.inspect(entry, {depth: null}))
        });

    }

    
}
