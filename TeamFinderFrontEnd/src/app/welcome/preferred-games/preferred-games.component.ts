import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-preferred-games',
  templateUrl: './preferred-games.component.html',
  styleUrls: ['./preferred-games.component.css']
})
export class PreferredGamesComponent implements OnInit {
  public result: any[] = [];
  public gameList: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.saveOwnedGames()
  }
  async saveOwnedGames() {
    this.result = [];
    this.gameList = [];
    await axios.get('accountData').then(res => {
      console.log(res.data)
      res.data.ownedGames.forEach((element: any) => {
        this.gameList.push(element)
      });
      for (let i = 0; i < this.gameList.length; i++) {
        this.result.push([this.gameList[i], false])
      }
    }).catch(err => console.log(err))
    console.log(this.gameList)
    await axios.post('saveOwnedgames',{data:this.gameList}).then(res => {
      console.log(res)
    }).catch(err => console.log(err))
  }
}
