import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import axios from 'axios';

@Component({
  selector: 'app-profile-post',
  templateUrl: './profile-post.component.html',
  styleUrls: ['./profile-post.component.css']
})
export class ProfilePostComponent implements OnInit {
  @ViewChild('image') input!:ElementRef;

  constructor(private auth: AngularFireAuth) { }
public picture:any;
  ngOnInit() {
    this.getPost();

  }
  getPost(){
    axios.get('getpost').then(res=>{
      //this.picture=res.data
      console.log(res.data)
    }).catch(err=>console.log(err))
  }

}
