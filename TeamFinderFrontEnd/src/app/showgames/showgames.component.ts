import { forEach } from '@angular-devkit/schematics';
import { BoundElementProperty } from '@angular/compiler';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';

@Component({
  selector: 'app-showgames',
  templateUrl: './showgames.component.html',
  styleUrls: ['./showgames.component.css']
})
export class ShowgamesComponent implements OnInit {
  public gameList:any[]=[{appid:1,name:"BGMI"},{appid:2,name:"FREE FIRE"}];
  public selectedList:any[]=[];
  public result: any[]=[];
  steamId: any;

  constructor(private modalService: NgbModal,private router: Router) { }

  ngOnInit(): void {
    this.getOwnedGames();
    this.result=[];
  }
  openScrollableContent(longContent:any) {
		this.modalService.open(longContent, { scrollable: true });
	}
  change(index: any){
    this.result[index][1]=!this.result[index][1]
  }
  async submit(){
    //console.log(this.result)
    this.setSelectedGames();
    this.modalService.dismissAll()
  }
  close(){
    //reverting to onInit State
    this.gameList=[{appid:1,name:"BGMI"},{appid:2,name:"FREE FIRE"}];
    this.result=[];
    this.selectedList=[]
    this.getOwnedGames();
    this.modalService.dismissAll()
  }
  getOwnedGames() {
      //console.log("showgames")
      axios.get('accountData',{params:{id:this.steamId}}).then(res=>{
        //console.log(res.data.ownedGames)
        res.data.ownedGames.forEach((element: any) => {
          this.gameList.push(element)
        });
        for (let i=0; i<this.gameList.length; i++){
          this.result.push([this.gameList[i],false])
        }
        this.getSelectedGames();
      }).catch(err =>console.log(err))
  }

  setSelectedGames(){
    this.deleteAppid();
    this.result.forEach((element: any) => {
        if(element[1]){
          //console.log(element[0].appid)
          axios.post('gameSelect',{appid:element[0].appid}).then(res=>{
            //console.log("sent req" ,res)
          }).catch(err =>console.log(err))
        }
    });
  }
  getSelectedGames(){
    axios.get('getSelectedGames').then(res=>{
      //console.log(res.data)
      res.data.forEach((element: any) => {
          this.result.forEach((gameEle: any) => {
            //console.log(gameEle[1])
            if(element.appid==gameEle[0].appid){
              gameEle[1]=true
            }
          });
      });
      //console.log(this.result)
    }).catch(err=>console.log(err))
    this.selectedList=this.result
    //console.log(this.selectedList)
  }
  deleteAppid(){
    //console.log("delete called")
    axios.post('selectedDelete').then(res=>{
      console.log("deletedq" ,res)
    }).catch(err =>console.log(err))
  }
}
