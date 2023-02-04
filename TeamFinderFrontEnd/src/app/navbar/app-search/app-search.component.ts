import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  @ViewChild('dropdown', { static: true }) dropdown: ElementRef;
  faCoffee = faCoffee;
  selected?: string;
  searchResults: any[] = [];
  public show:boolean =true;

  constructor(public user: UserService ,private renderer: Renderer2 ,private auth: AngularFireAuth) {
    this.dropdown = new ElementRef(null)
  }


  public usr:any;
  public userparsed:any;
  public profileurl:any;
  ngOnInit(): void {
    document.addEventListener('click', this.handleClickOutside.bind(this));

    this.show=true;
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
  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }
  getUsers(){
    this.searchResults=[];
    axios.post('searchFriend',{searchTerm: this.selected}).then(res=>{
      // res.data.forEach((element: { name: string; }) => {
      //   this.searchResults.push(element.name);
      // });
      res.data.forEach((element: {id:string, name: string,profilePicture:string; }) => {
        this.searchResults.push({id:element.id,name:element.name,dp:element.profilePicture});
      });
      console.log(res.data)
    }).catch(err=>console.log(err))
  }
  sendReq(data:string){
    axios.post('addFriend',{from:this.userparsed.uid,to:data}).then(res=>{
      console.log("sent req" ,res)
    }).catch(err =>console.log(err))
    //console.log(this.userparsed)
  }
  onclick(userinfo:any){
    console.log("clicked")
  }
  handleClickOutside(event: { target: any; }) {
    if (!this.dropdown.nativeElement.contains(event.target)) {
      console.log("baire")
      this.show=false;
    }else{
      console.log("vitore")
      this.show=true;
    }

  }
}
