import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-linked-accounts',
  template: `
    <p>Steam ID: {{ steamId }}</p>
  `,
  templateUrl: './linked-accounts.component.html',
  styleUrls: ['./linked-accounts.component.css']
})
export class LinkedAccountsComponent implements OnInit {
  steamId: string='';
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.steamId = this.route.snapshot.queryParams['steamid'];
  }
  printSteamId(){
    console.log(this.steamId);
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
