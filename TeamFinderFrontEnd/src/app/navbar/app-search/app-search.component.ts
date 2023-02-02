import { Component, OnInit, Renderer2 } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { UserService } from 'src/app/login/user.service';

@Component({
  selector: 'app-app-search',
  templateUrl: './app-search.component.html',
  styleUrls: ['./app-search.component.css']
})
export class AppSearchComponent implements OnInit {
  faCoffee = faCoffee;
  selected?: string;
  searchResults: string[] = [];
  constructor(public user: UserService ,private renderer: Renderer2 ,private auth: AngularFireAuth) { }

  public usr:any;
  public userparsed:any;
  public profileurl:any;
  ngOnInit(): void {
    // this.show=false;
    // this.usr = localStorage.getItem('user');
    // this.userparsed=JSON.parse(this.usr);
    // console.log("logged in :" ,  this.user.isLoggedIn)
    this.auth.authState.subscribe(user=>{
      if(user) {
        this.userparsed = user
        axios.get('saveuser').then(res=>{
          //console.log("save user" ,res)
          this.profileurl = `http://localhost:3000/static/profilePicture/${user.uid}.jpg`
        }).catch(err =>console.log(err))
      }
    })
  }
  getUsers(){
    this.searchResults=[];
    axios.post('searchFriend',{searchTerm: this.selected}).then(res=>{
      res.data.forEach((element: { name: string; }) => {
        this.searchResults.push(element.name);
      });
      //console.log(res.data)
    }).catch(err=>console.log(err))
  }
}
