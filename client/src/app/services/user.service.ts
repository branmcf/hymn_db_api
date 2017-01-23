import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
    private _apiUrl = 'https://private-91abd-node46.apiary-mock.com';

    constructor(private http: Http){}

    login(user) : Promise<any> {
        return this.http
            .post(this._apiUrl + '/login', user)
            .toPromise()
            .then(this.extractData);
    }

    private extractData(res: Response) {
        let body = res['_body'];
        console.log("SUCCESS: ", res)
        return body || {};
    }
}

