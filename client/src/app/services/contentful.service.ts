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
    getEntry(entryID: string) {
        return this.client.getEntry(entryID)
        .then(function (entry) {
        //    return util.inspect(entry, { depth: null });
            return JSON.stringify(entry);
        });
    }

    getLandingPage() {
        return this.getEntry('5w7209ikAEy0ieiqkOW6so')
        .then((page) => {
            return page;
        });
    }

    getResourcesForm() {
        // return this.getEntry('73N7PxAbegmGu2gwSqa46o');
        // return Observable.fromPromise(this.client.getEntry('73N7PxAbegmGu2gwSqa46o'));
        // return Observable.of({fields: {title: 'hey', instructions: 'what up'}});
        return Promise.resolve(this.client.getEntry('73N7PxAbegmGu2gwSqa46o')
            .then((form) => {
                return JSON.stringify(form);
            }));
    }

    getOrgsForm() {
        // return this.getEntry('3LFm4Uq6lWEEM40qWkMKWG')
        // .then((form) => {
        //     return form;
        // });
        return Promise.resolve(this.client.getEntry('3LFm4Uq6lWEEM40qWkMKWG')
            .then((form) => {
                return JSON.stringify(form);
            }));

        // return Promise.resolve(JSON.stringify({fields: {instructions: 'what', title: 'wut'}}));

    }

    getPersonForm() {
        return this.getEntry('4Io2dsT11KQW0UmsIcSKOQ')
        .then((form) => {
            return form;
        });
    }

    getCongregationForm() {
        return this.getEntry('36bnlQ1OKsYUIQoEkUWeYG')
        .then((form) => {
            return form;
        });
    }

    getEventForm() {
        return this.getEntry('26KrDew6nyooYKWAeayeq4')
        .then((form) => {
            return form;
        });
    }
}

