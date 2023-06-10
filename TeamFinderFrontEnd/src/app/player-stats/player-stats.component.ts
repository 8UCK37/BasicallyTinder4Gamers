import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css']
})
export class PlayerStatsComponent implements OnInit {
  playerStats:any;
  constructor() { }
  ngOnInit() {
this.playerWeaponStates();
}
async playerWeaponStates()
{
  await axios.get('stats/mapAndWeaponDataFromSteamId').then(res => {
    this.playerStats=(structuredClone(res.data.playerStats));
    console.log(res.data.playerStats)
    console.log(res.data.weaponStats)

}).catch(err=>console.log(err))
}
}
