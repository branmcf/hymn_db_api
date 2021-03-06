/// <reference path="../../typings/index.d.ts"/>

import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { EntryModule } from './entry/entry.module';

@Component({
  selector: 'hymn-root',
  template: '<router-outlet></router-outlet>'
})
export class RootComponent {}

export const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'entry',
    loadChildren: './entry/entry.module#EntryModule'
  }
];

export const Routing = RouterModule.forRoot(routes);
