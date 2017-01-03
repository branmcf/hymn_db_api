import { NgModule } from '@angular/core';

import { EntryNavComponent } from './entryNavbar/entryNavbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@NgModule ({
	id: 'shared',
	imports: [
		BrowserModule,
		RouterModule
	],
	declarations: [
        EntryNavComponent,
    ],
    exports: [
        EntryNavComponent,
    ]
})

export class SharedModule {}
