import { Component } from '@angular/core';

@Component({
  selector: 'hymn-entry',
  template: require('./entry.html'),
})

export class EntryComponent {
  constructor() {
    console.log('Entry');
  }
}
