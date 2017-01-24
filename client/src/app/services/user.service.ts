import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
    private _apiUrl = 'https://private-91abd-node46.apiary-mock.com';

    constructor(private http: Http){}

    get(user_id : number) : Promise<any> {
		return this.http
			.get(`${this._apiUrl}/user/${user_id}`)
			.toPromise()
			.then(x => x['_body'] as any);
    }

    login(user) : Promise<any> {
        return this.http
            .post(this._apiUrl + '/login', user)
            .toPromise()
            .then(this.extractData);
    }

    private extractData(res: Response) {
        let body = res['_body'];
        return body || {};
    }
}

