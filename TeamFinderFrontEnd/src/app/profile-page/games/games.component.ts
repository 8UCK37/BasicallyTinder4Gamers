import { json } from '@angular-devkit/core';
import { forEach } from '@angular-devkit/schematics';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BoundElementProperty } from '@angular/compiler';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';

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
    ])
  ]
})
export class GamesComponent implements OnInit {
  public gameList: any[] = [{ appid: 1, name: "BGMI" }, { appid: 2, name: "FREE FIRE" }];
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
  constructor(private modalService: NgbModal, private router: Router, private route: ActivatedRoute) {
    this.ownProfile = this.route.snapshot.data['ownProfile'];
  }

  ngOnInit(): void {
    if (this.ownProfile) {
      this.getOwnedGamesfrmDb();
      this.result=[]
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
  change(index: any) {
    this.result[index][1] = !this.result[index][1]
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
    this.deleteAppid();
    const selected: any[]=[]
    this.result.forEach((element: any) => {
      if (element[1]) {
        selected.push(element)
      }
    });
    selected.forEach(element => {
       axios.post('gameSelect', { appid: element[0].appid }).then(res => {
        }).catch(err => console.log(err))
    });
  }


  deleteAppid() {
    axios.post('selectedDelete').then(res => {
    }).catch(err => console.log(err))
  }

  async saveOwnedGames() {
    this.result = [];
    this.gameList = [];
    await axios.get('accountData', { params: { id: this.steamId } }).then(res => {
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
      res.data.forEach((element: any) => {
        this.result.forEach((gameEle: any) => {
          if (element.appid == gameEle[0].appid) {
            //gameEle[0].playtime_forever=(gameEle[0].playtime_forever/60).toFixed(2)
            gameEle[1] = true
          }
        });
      });
    }).catch(err => console.log(err))
    this.selectedList = this.result
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
  }
  async getShowCase() {
    this.showcase = [];
    this.frndownedgames = [];
    await axios.post('getFrndOwnedGames', { frnd_id: this.profile_id }).then(res => {
      if(res.data[0]!=null){
      this.frndownedgames = JSON.parse(res.data[0]?.games)}
      //console.log(this.showcase)
    }).catch(err => console.log(err))
    await axios.post('getFrndSelectedGames', { frnd_id: this.profile_id }).then(res => {
      res.data.forEach((selected: any) => {
        this.frndownedgames.forEach(owned => {
          //console.log(selected.appid)
          if (owned.appid == selected.appid) {
            this.showcase.push(owned)
          }
        });
      });
    }).catch(err => console.log(err))
  }
}
