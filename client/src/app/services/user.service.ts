import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { CanActivate } from '@angular/router';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService implements CanActivate {
    private _apiUrl = 'https://private-91abd-node46.apiary-mock.com';

    constructor(private http: Http){}

    get(user_id: number): Promise<any> {
        return this.http
            .get(`${this._apiUrl}/user/${user_id}`)
            .toPromise()
            .then(x => x['_body'] as any);
    }

    login(user): Promise<any> {
        return this.http
            .post(this._apiUrl + '/login', user)
            .toPromise()
            .then(this.extractData);
    }

    private extractData(res: Response) {
        const body = res['_body'];
        return body || {};
    }

    canActivate() {
        const userInfo = sessionStorage.getItem('userInfo');
        if (userInfo) {
            return true;
        }
        return false;
    }
}

