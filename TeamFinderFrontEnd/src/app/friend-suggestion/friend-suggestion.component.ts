import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import axios from 'axios';
import { UserService } from '../login/user.service';

@Component({
  selector: 'app-friend-suggestion',
  templateUrl: './friend-suggestion.component.html',
  styleUrls: ['./friend-suggestion.component.css']
})
export class FriendSuggestionComponent implements OnInit {
  @Output() childEvent = new EventEmitter();
  friendSuggestionList:any;
  user:any;
  constructor(private userService:UserService) { }

  ngOnInit() {
    console.log("here")
    this.userService.userCast.subscribe(user=>{
      console.log(user)
      this.user = user
    })
    axios.get('/user/friendSuggestion').then(res=>{
      console.log(res.data)
      this.friendSuggestionList = res.data;
    })
  }
  triggerCustomEvent() {
    this.childEvent.emit();
  }
}
