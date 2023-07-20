import { Component, Input, OnInit } from '@angular/core';
import { average } from 'color.js';

@Component({
  selector: 'app-friend-suggestion-box',
  templateUrl: './friend-suggestion-box.component.html',
  styleUrls: ['./friend-suggestion-box.component.css']
})
export class FriendSuggestionBoxComponent implements OnInit {
  @Input() name = ''
  @Input() profileImage  = ''
  @Input() createdAt= ''
  @Input() bio=''
  public img: string []=[];
  constructor() { }

  ngOnInit() {
    this.img.push(this.profileImage)
    console.log(this.img)
  }
}
