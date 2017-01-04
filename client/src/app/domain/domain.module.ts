import { NgModule, Injector } from '@angular/core';
import { HttpModule, XHRBackend, BrowserXhr, ResponseOptions,  XSRFStrategy } from '@angular/http';
import { InMemoryWebApiModule, InMemoryBackendService } from 'angular-in-memory-web-api';

import { SubmissionRepositoryService } from './submissions/submission-repository.service'

@NgModule({
	id: 'domain',
	imports: [
		HttpModule
    ],
	providers: [
		SubmissionRepositoryService
	]
})

export class DomainModule {}