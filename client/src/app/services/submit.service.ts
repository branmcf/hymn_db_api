import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SubmitService {

    private _apiUrl = 'app/submissions';

    constructor(private http: Http) { }

    submit(submission): Promise<any> {
        return this.http
			.post(this._apiUrl, submission)
			.toPromise()
			.then(() => submission)
			.catch(x => alert(x.json().error));
    }
}