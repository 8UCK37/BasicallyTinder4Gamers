import { json } from '@angular-devkit/core';
import { forEach } from '@angular-devkit/schematics';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BoundElementProperty } from '@angular/compiler';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';

@Component({
  selector: 'app-showgames',
  templateUrl: './showgames.component.html',
  styleUrls: ['./showgames.component.css'],
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
export class ShowgamesComponent implements OnInit {
  public gameList:any[]=[{appid:1,name:"BGMI"},{appid:2,name:"FREE FIRE"}];
  public selectedList:any[]=[];
  public result: any[]=[];
  public ownedGames:any;
  steamId: any;
  flip: string = 'inactive';
  constructor(private modalService: NgbModal,private router: Router) { }

  ngOnInit(): void {
    //this.getOwnedGames();
    this.getOwnedGamesfrmDb();
    this.result=[];

  }
  openScrollableContent(longContent:any) {
		this.modalService.open(longContent, { scrollable: true });
	}
  change(index: any){
    this.result[index][1]=!this.result[index][1]
  }
  async submit(){
    this.setSelectedGames();
    this.modalService.dismissAll()
  }
  close(){
    //reverting to onInit State
    this.gameList=[{appid:1,name:"BGMI"},{appid:2,name:"FREE FIRE"}];
    this.result=[];
    this.selectedList=[]
    this.getOwnedGamesfrmDb();
    this.modalService.dismissAll()
  }

  setSelectedGames(){
    this.deleteAppid();
    this.result.forEach((element: any) => {
        if(element[1]){
          axios.post('gameSelect',{appid:element[0].appid}).then(res=>{
          }).catch(err =>console.log(err))
        }
    });
  }
  getSelectedGames(){
    axios.get('getSelectedGames').then(res=>{
      res.data.forEach((element: any) => {
          this.result.forEach((gameEle: any) => {
            if(element.appid==gameEle[0].appid){
              //gameEle[0].playtime_forever=(gameEle[0].playtime_forever/60).toFixed(2)
              gameEle[1]=true
            }
          });
      });

    }).catch(err=>console.log(err))
    this.selectedList=this.result

  }
  deleteAppid(){
    axios.post('selectedDelete').then(res=>{
    }).catch(err =>console.log(err))
  }
  async saveOwnedGames(){
    this.result=[];
    this.gameList=[];
    await axios.get('accountData',{params:{id:this.steamId}}).then(res=>{
      res.data.ownedGames.forEach((element: any) => {
        this.gameList.push(element)
      });
      for (let i=0; i<this.gameList.length; i++){
        this.result.push([this.gameList[i],false])
      }
      this.getSelectedGames();
    }).catch(err =>console.log(err))
  }
  getOwnedGamesfrmDb(){
    this.result=[];
    this.gameList=[];
    axios.get('getOwnedgames').then(res=>{
      if(res.data.length!=0){
      const ownedGames=JSON.parse(JSON.parse(res.data[0].games))
      ownedGames.forEach((element: any) => {
        this.gameList.push(element)
      });
      for (let i=0; i<this.gameList.length; i++){
        this.result.push([this.gameList[i],false])
      }
      this.getSelectedGames();}
    }).catch(err=>console.log(err))
  }
  indexprinter(i:any){
    console.log(i)
  }
}
