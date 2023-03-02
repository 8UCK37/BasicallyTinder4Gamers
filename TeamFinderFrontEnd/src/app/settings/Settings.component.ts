import { Component, OnInit } from '@angular/core';
import axios from 'axios';
@Component({
  selector: 'app-Settings',
  templateUrl: './Settings.component.html',
  styleUrls: ['./Settings.component.css']
})
export class SettingsComponent implements OnInit {
  public newUserName: any;
  posts: any;
  constructor() { }

  ngOnInit() {
  }

  async changeName() {
    console.log(this.newUserName);
    await axios.post('userNameUpdate', { name: this.newUserName }).then(res => {
      //console.log(res.data

      //console.log(res.data.profilePicture)
    }).catch(err => console.log(err))
    window.location.reload();
  }

}
