import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  public searchedList: any[]=[];
  public selectedGames: any[] = [];
  @Output() childEvent = new EventEmitter();
  gameSearch: any;
  public MobileGameList: any[] = [{ appid: 1, name: "Battle Grounds Mobile India(BGMI)",selected:false,photo:'https://w0.peakpx.com/wallpaper/626/833/HD-wallpaper-bgmi-trending-pubg-bgmi-logo-bgmi-iammsa-pubg.jpg' }, { appid: 2, name: "Free Fire",selected:false,photo:'https://upload.wikimedia.org/wikipedia/en/7/75/FreeFireBannerLogo.jpg' },{appid:3,name:"COD Mobile",selected:false,photo:'https://w0.peakpx.com/wallpaper/953/729/HD-wallpaper-nikto-codm-cod-mobile-gaming.jpg'}];
  public MobileGameDummy:any[]=this.MobileGameList;
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
        element.photo=`url(https://steamcdn-a.akamaihd.net/steam/apps/${element.appid}/library_600x900.jpg)`
        this.gameList.push(element)
      });
      for (let i = 0; i < this.gameList.length; i++) {
        this.result.push([this.gameList[i], false])
      }
        this.searchedList=structuredClone(this.gameList);
    }).catch(err => console.log(err))
    console.log(this.gameList)

  }

  onCheckboxClick(event: any, index: any) {
    this.gameList[index].selected=!this.gameList[index].selected;
    //console.log('Game selected:', this.gameList[index]);
    this.selectedGames=this.gameList.filter(game=>game.selected);
    this.utilsServiceService.setPreferredGamesObj(this.selectedGames);
  }

  triggerCustomEvent() {
    this.childEvent.emit();
  }

searchGames(){
  console.log(this.gameSearch)
  if(this.gameSearch.length!=0){
  this.searchedList=this.gameList.filter((game:any) =>
    game.name.toLowerCase().includes(this.gameSearch.toLowerCase())
  );
  this.MobileGameList=this.MobileGameDummy.filter((game:any) =>
  game.name.toLowerCase().includes(this.gameSearch.toLowerCase())
);
  }else{
    this.searchedList=this.gameList
    this.MobileGameList=this.MobileGameDummy
  }
}
}

