import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { UserService } from '../login/user.service';

@Component({
  selector: 'app-primary-home-page',
  templateUrl: './primary-home-page.component.html',
  styleUrls: ['./primary-home-page.component.css']
})
export class PrimaryHomePageComponent implements OnInit {

  constructor(public user: UserService) { }
  public usr:any;
  ngOnInit(): void {
    this.usr = localStorage.getItem('user');
  }

  callBackend(){
    axios.get('/test?ID=12345')
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    })
  }
}
