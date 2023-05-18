import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css']
})
export class PlayerStatsComponent implements OnInit {
steamId:any;
  constructor() { }

  ngOnInit() {
     axios.get('stats/weapon', { params: { id: this.steamId } }).then(res => {
      console.log("Data"+JSON.stringify(res.data));

  })
}
}
