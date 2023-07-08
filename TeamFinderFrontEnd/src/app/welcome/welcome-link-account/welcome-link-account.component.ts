import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-welcome-link-account',
  templateUrl: './welcome-link-account.component.html',
  styleUrls: ['./welcome-link-account.component.css']
})
export class WelcomeLinkAccountComponent implements OnInit {
  @Output() childEvent = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  triggerCustomEvent() {
    this.childEvent.emit();
  }
}
