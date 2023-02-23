import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { ActivatedRoute,Router } from '@angular/router';
@Component({
  selector: 'app-showfriendgames',
  templateUrl: './showfriendgames.component.html',
  styleUrls: ['./showfriendgames.component.css']
})
export class ShowfriendgamesComponent implements OnInit {
  public frnd_id:any;
  public frndData:any;
  constructor(private route: ActivatedRoute) { }
  public usr: any;
  public userparsed: any;
  public showcase:any[]=[];
  public frndownedgames:any[]=[]
  ngOnInit(): void {
    this.usr = localStorage.getItem('user');
    this.userparsed = JSON.parse(this.usr);

    this.route.queryParams.subscribe(params => {
      this.frnd_id = params['id'];
      this.getShowCase();
    });

  }
  getShowCase(){
    this.showcase=[];
    this.frndownedgames=[];
    axios.post('getFrndOwnedGames',{frnd_id:this.frnd_id}).then(res=>{
      this.frndownedgames=JSON.parse(JSON.parse(res.data[0].games))
      //console.log(this.frndownedgames)
      axios.post('getFrndSelectedGames',{frnd_id:this.frnd_id}).then(res=>{
        res.data.forEach((selected: any) => {
          this.frndownedgames.forEach(owned => {
            //console.log(selected.appid)
            if(owned.appid==selected.appid){
              this.showcase.push(owned)
            }
          });
        });
      }).catch(err =>console.log(err))
      //console.log(this.showcase)
    }).catch(err =>console.log(err))
  }
}
