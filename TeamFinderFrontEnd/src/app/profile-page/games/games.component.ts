import { json } from '@angular-devkit/core';
import { forEach } from '@angular-devkit/schematics';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BoundElementProperty } from '@angular/compiler';
import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { UserService } from 'src/app/login/user.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css'],
  animations: [
    trigger('flipState', [
      state('active', style({
        transform: 'rotateY(180deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0)'
      })),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in'))
    ]),
    trigger('appear', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(200px)'
      })),
      transition('void => *', [
        animate(300, style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ])
    ])
  ]

})
export class GamesComponent implements OnInit {
  public gameList: any[] = [];
  public MobileGameList: any[] = [{ appid: 1, name: "Battle Grounds Mobile India(BGMI)",selected:false,photo:'https://w0.peakpx.com/wallpaper/626/833/HD-wallpaper-bgmi-trending-pubg-bgmi-logo-bgmi-iammsa-pubg.jpg' }, { appid: 2, name: "Free Fire",selected:false,photo:'https://upload.wikimedia.org/wikipedia/en/7/75/FreeFireBannerLogo.jpg' },{appid:3,name:"COD Mobile",selected:false,photo:'https://w0.peakpx.com/wallpaper/953/729/HD-wallpaper-nikto-codm-cod-mobile-gaming.jpg'}];
  public MobileGameDummy:any[]=this.MobileGameList;
  public selectedList: any[] = [];
  public result: any[] = [];
  public ownedGames: any;
  steamId: any;
  public gameSearch:any
  flip: string = 'inactive';
  public showcase: any[] = [];
  public frndownedgames: any[] = []
  ownProfile: any;
  public profile_id: any;
  public showgames:boolean=true
  constructor(public userService:UserService, private modalService: NgbModal, private router: Router, private route: ActivatedRoute) {
    this.ownProfile = this.route.snapshot.data['ownProfile'];
  }

  ngOnInit(): void {
    if (this.ownProfile) {
      this.userService.userCast.subscribe(usr=>{
        //console.log("user data" , usr)
        if(usr){
        this.getOwnedGamesfrmDb();
        this.result=[]
      }
      })
    } else {
      this.route.queryParams.subscribe(params => {
        this.profile_id = params['id'];
        //console.log(this.profile_id)
        this.getShowCase();
      });
    }
  }
  openScrollableContent(longContent: any) {
    this.modalService.open(longContent, { scrollable: true });
  }
  changeSteam(index: any) {
    this.result[index][1] = !this.result[index][1]
  }
  changeMobile(index: any) {
    this.MobileGameList[index].selected = !this.MobileGameList[index].selected
  }
  submit() {
    this.setSelectedGames();
    this.modalService.dismissAll()
  }
  close() {
    //reverting to onInit State
    this.gameList = [{ appid: 1, name: "BGMI" }, { appid: 2, name: "FREE FIRE" }];
    this.result = [];
    this.selectedList = []
    this.getOwnedGamesfrmDb();
    this.modalService.dismissAll()
  }

  setSelectedGames() {
    var selected:String='';
    this.result.forEach((element: any, index: number) => {
      if (element[1]) {
        if (selected=='') {
          selected += element[0].appid;
        } else {
          selected += ',' + element[0].appid;
        }
      }
    });
    this.MobileGameList.forEach((element: any, index: number) => {
      if (element.selected) {
        if (selected=='') {
          selected += element.appid;
        } else {
          selected += ',' + element.appid;
        }
      }
    });
    console.log(selected.split(','))

    axios.post('gameSelect', { appid: selected }).then(res => {
      }).catch(err => console.log(err))
    this.selectedList.sort((a, b) => b[0].playtime_forever - a[0].playtime_forever);
  }

  async saveOwnedGames() {
    this.result = [];
    this.gameList = [];
    await axios.get('accountData').then(res => {
      //console.log(res.data)
      res.data.ownedGames.forEach((element: any) => {
        this.gameList.push(element)
      });
      for (let i = 0; i < this.gameList.length; i++) {
        this.result.push([this.gameList[i], false])
      }

      this.getSelectedGames();
    }).catch(err => console.log(err))
    //console.log(this.gameList)
    await axios.post('saveOwnedgames',{data:this.gameList}).then(res => {

    }).catch(err => console.log(err))
  }

  async getSelectedGames() {
    //console.log(this.result)
    await axios.get('getSelectedGames').then(res => {
      if(res.data.length!=0){
      res.data[0].appid.split(",").forEach((element: any) => {
        //console.log(element)
        this.result.forEach((gameEle: any) => {
          if (element == gameEle[0].appid) {
            gameEle[1] = true
          }
        });
        this.MobileGameList.forEach(game => {
          if(game.appid==element){
            game.selected=true
          }
        });
      });
    }
    }).catch(err => console.log(err))
    this.selectedList = this.result
    this.selectedList.sort((a, b) => b[0].playtime_forever - a[0].playtime_forever);
    //console.log(this.selectedList)
  }

  async getOwnedGamesfrmDb() {
    this.result = [];
    this.gameList = [];
    await axios.get('getOwnedgames').then(res => {
      //console.log(res.data[0].games)
      if (res.data.length != 0) {
        const ownedGames = JSON.parse(res.data[0].games)
        ownedGames.forEach((element: any) => {
          this.gameList.push(element)
        });
        for (let i = 0; i < this.gameList.length; i++) {
          this.result.push([this.gameList[i], false])
        }
      }
    }).catch(err => console.log(err))
    this.getSelectedGames();
    //console.log(this.result)
    //console.log(this.MobileGameList)
  }
  async getShowCase() {
    this.showcase = [];
    this.frndownedgames = [];
    await axios.post('getFrndOwnedGames', { frnd_id: this.profile_id }).then(res => {
      if(res.data[0]!=null){
      this.frndownedgames = JSON.parse(res.data[0]?.games)}
      //console.log(this.frndownedgames)
    }).catch(err => console.log(err))
    await axios.post('getFrndSelectedGames', { frnd_id: this.profile_id }).then(res => {
      //console.log(res.data[0].appid.split(","))

      res.data[0]?.appid.split(",").forEach((selected: any) => {
        this.frndownedgames.forEach(owned => {
          //console.log(selected.appid)
          if (owned.appid == selected) {
            this.showcase.push(owned)
          }
        });
        this.MobileGameList.forEach(game => {
          if(game.appid==selected){
            game.selected=true
          }
        });
      });
    }
    ).catch(err => console.log(err))
    //console.log(this.showcase)
    this.showcase.sort((a, b) => b.playtime_forever - a.playtime_forever);
  }
  searchGames(){
    //console.log(this.gameSearch)
    if(this.gameSearch.length!=0){
    this.result=this.selectedList.filter((game) =>
      game[0].name.toLowerCase().includes(this.gameSearch.toLowerCase())
    );
    this.MobileGameList=this.MobileGameDummy.filter((game) =>
    game.name.toLowerCase().includes(this.gameSearch.toLowerCase())
  );
    }else{
      this.result=this.selectedList
      this.MobileGameList=this.MobileGameDummy
    }
  }
}
