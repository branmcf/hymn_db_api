import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SubmitService {

    private _apiUrl = 'http://polls.apiblueprint.org/';

    constructor(private http: Http) { }

    submitCongregation(submission): Promise<any> {
        return this.http
			.post(this._apiUrl + '/congregation', submission)
			.toPromise()
			.then(() => submission)
			.catch(x => alert(x.json().error));
    }
}