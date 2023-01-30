import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-linked-accounts',
  templateUrl: './linked-accounts.component.html',
  styleUrls: ['./linked-accounts.component.css']
})
export class LinkedAccountsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
