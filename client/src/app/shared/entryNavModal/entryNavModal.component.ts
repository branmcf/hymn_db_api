import { Component, OnInit, Injectable, EventEmitter, Input, ViewContainerRef} from '@angular/core';
import { Route, Router, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';

@Component({
	// tslint:disable-next-line:component-selector-prefix
	selector: 'entry-nav-modal',
	templateUrl: 'app/shared/entryNavModal/entryNavModal.html',
})

export class EntryNavModalComponent {
	constructor() {}
}
