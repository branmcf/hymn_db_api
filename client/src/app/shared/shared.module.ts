import { NgModule } from '@angular/core';

import { EntryNavComponent } from './entryNavbar/entryNavbar.component';
import { EntryNavModalComponent } from './entryNavModal/entryNavModal.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import 'hammerjs';


@NgModule ({
	id: 'shared',
	imports: [
		BrowserModule,
		RouterModule,
	],
	declarations: [
        EntryNavComponent,
		EntryNavModalComponent,
    ],
    exports: [
        EntryNavComponent,
		EntryNavModalComponent,
    ]
})

export class SharedModule {}
