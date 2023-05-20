import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-friend-suggestion-box',
  templateUrl: './friend-suggestion-box.component.html',
  styleUrls: ['./friend-suggestion-box.component.css']
})
export class FriendSuggestionBoxComponent implements OnInit {
  @Input() name = ''
  @Input() profileImage = ''
  constructor() { }

  ngOnInit() {
  }

}
