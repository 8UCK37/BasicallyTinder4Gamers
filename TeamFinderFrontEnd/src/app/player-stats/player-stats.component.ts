import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { stringify } from 'uuid';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css']
})
export class PlayerStatsComponent implements OnInit {
steamId:any;
  mapData!: string;
  weaponData!: JSON;

  constructor() { }

  ngOnInit() {
     axios.get('stats/weapon', { params: { id: this.steamId } }).then(res => {
      this.weaponData=(res.data);
  })

     axios.get('stats/map', { params: { id: this.steamId } }).then(res => {
     this.mapData=JSON.stringify(res.data);
})

console.log("data map",this.mapData)
console.log("data weapon",this.weaponData)
}
}
