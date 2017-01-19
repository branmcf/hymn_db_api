import { Component, OnInit, Injectable, EventEmitter, Input, ViewContainerRef} from '@angular/core';
import { Route, Router, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import {MdDialog, MdDialogRef} from '@angular/material';


@Component({
	// tslint:disable-next-line:component-selector-prefix
	selector: 'entry-nav-modal',
	templateUrl: 'app/shared/entryNavModal/entryNavModal.html',
})

export class EntryNavModalComponent {
	dialogRef: MdDialogRef<NavDialog>;
	constructor(public dialog: MdDialog) {}

	openDialog() {
    this.dialogRef = this.dialog.open(NavDialog, {
      disableClose: false,
      width: '50%',
      height: '50%',
      position: {left: '25%'},
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('result: ' + result);
      this.dialogRef = null;
    });
  }
}

@Component({
  selector: 'nav-dialog',
  templateUrl: 'app/shared/entryNavModal/entryNavDialog.html',
  styleUrls: ['app/shared/entryNavModal/entryNavDialog.css']
})
export class NavDialog {
  constructor(public dialogRef: MdDialogRef<NavDialog>) { }
}
