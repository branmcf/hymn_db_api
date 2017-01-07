import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { SubmissionResources } from './submission'

@Injectable()
export class SubmissionRepositoryService {
	protected _apiUrl  = 'app/submission';

    constructor(private http: Http){}

	list() : Promise<any[]> {
		return this.http.get(this._apiUrl)
		.toPromise()
		.then(x => x.json().data as any[]);
	}	

	get(id: number): Promise<any> {
		var pluck = x => (x && x.length) ? x[0] : undefined;
		return this.http
			.get(`${this._apiUrl}/?id=${id}`)
			.toPromise()
			.then(x => pluck(x.json().data))
			.catch(x => alert(x.json().error));
	}

	add(submission) : Promise<any> {
		return this.http
			.post(this._apiUrl, submission)
			.toPromise()
			.then(() => submission)
			.catch(x => alert(x.json().error));
	}

	update(submission) : Promise<any> {
		return this.http
			.put(`${this._apiUrl}/${submission.id}`, submission)
			.toPromise()
			.then(() => submission)
			.catch(x => alert(x.json().error));
	}

	delete(id: number) : Promise<any> {
		return this.http
			.delete(`${this._apiUrl}/?id=${id}`)
			.toPromise()
			.catch(x => alert("Submission has been deleted!"));
	}
}
