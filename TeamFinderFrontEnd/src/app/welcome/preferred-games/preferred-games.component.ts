import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';

@Component({
  selector: 'app-preferred-games',
  templateUrl: './preferred-games.component.html',
  styleUrls: ['./preferred-games.component.css']
})
export class PreferredGamesComponent implements OnInit {
  public result: any[] = [];
  public gameList: any[] = [];
  selectedGames: any[] = [];

  constructor(public utilsServiceService : UtilsServiceService) { }

  ngOnInit(): void {
    this.saveOwnedGames()
  }
  async saveOwnedGames() {
    this.result = [];
    this.gameList = [];
    await axios.get('accountData').then(res => {
      console.log(res.data)
      res.data.ownedGames.forEach((element: any) => {
        element.selected=false;
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
  onCheckboxClick(event: any, index: any) {
    this.gameList[index].selected=true;
    console.log('Game selected:', this.gameList[index]); 
    this.submit(this.gameList[index]); 
  }
  async submit(game: any){
    await axios.post('savepreffredGames',{games:game}).then(res => {
      console.log(res)
    }).catch(err => console.log(err))
  }
}
