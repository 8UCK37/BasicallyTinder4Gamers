import { forEach } from '@angular-devkit/schematics';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';

@Component({
  selector: 'app-showgames',
  templateUrl: './showgames.component.html',
  styleUrls: ['./showgames.component.css']
})
export class ShowgamesComponent implements OnInit {
  public GameNamelist:string[]=["BGMI","FREE FIRE"]
  public result: any
  steamId: any;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getOwnedGames();

    this.result=[];
    for (let i=0; i<this.GameNamelist.length; i++){
      this.result.push([this.GameNamelist[i],false])
    }

  }
  openScrollableContent(longContent:any) {
		this.modalService.open(longContent, { scrollable: true });
	}
  change(index: any){
    this.result[index][1]=!this.result[index][1]
  }
  submit(){
    console.log(this.result)
    this.modalService.dismissAll()
  }
  getOwnedGames() {
      //console.log("showgames")
      axios.get('accountData',{params:{id:this.steamId}}).then(res=>{
        //console.log(res.data.ownedGames)
        res.data.ownedGames.forEach((element: any) => {
          this.GameNamelist.push(element.name)
        });
      }).catch(err =>console.log(err))
  }
  //load the selected appids in a json and send it to the table golu bc toke bolchi
  setSelectedGames(){
    axios.post('gameSelect',{appid:'12345'}).then(res=>{
      console.log("sent req" ,res)
    }).catch(err =>console.log(err))
  }
  getSelectedGames(){
    axios.get('getSelectedGames').then(res=>{
      console.log(res.data)
    }).catch(err=>console.log(err))
  }
}
