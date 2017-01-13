import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import * as contentful from 'contentful';
import * as util from 'util';
import { Observable } from 'rxjs/Rx';

declare var process: any;

@Injectable()
export class ContentfulService {

    private client = contentful.createClient({
        space: process.env.CONTENTFUL_SPACE,
        accessToken: process.env.CONTENTFUL_TOKEN
    });
    constructor() {

        // this.getLandingPage()
        // .then((contents) => {
        //     console.log(contents);
        // });

    }

    getEntries() {
        this.client.getEntries()
        .then(function (entries) {
            console.log(util.inspect(entries, {depth: null}));
            return entries;
        });
    }

    // contentful definition of entry is used here

    getLandingPage() {
        return this.client.getEntry('5w7209ikAEy0ieiqkOW6so')
        .then((page) => {
            return page;
        });
    }

    getResourcesForm() {
        return Promise.resolve(this.client.getEntry('73N7PxAbegmGu2gwSqa46o')
            .then((form) => {
                return JSON.stringify(form);
            }));
    }

    getOrgsForm() {
        return Promise.resolve(this.client.getEntry('3LFm4Uq6lWEEM40qWkMKWG')
            .then((form) => {
                return JSON.stringify(form);
            }));
    }

    getPersonForm() {
        return Promise.resolve(this.client.getEntry('4Io2dsT11KQW0UmsIcSKOQ')
            .then((form) => {
                return JSON.stringify(form);
            }));
    }

    getCongregationForm() {
         return Promise.resolve(this.client.getEntry('36bnlQ1OKsYUIQoEkUWeYG')
            .then((form) => {
                return JSON.stringify(form);
            }));
    }

    getEventForm() {
        return Promise.resolve(this.client.getEntry('26KrDew6nyooYKWAeayeq4')
            .then((form) => {
                return JSON.stringify(form);
            }));
    }
}

