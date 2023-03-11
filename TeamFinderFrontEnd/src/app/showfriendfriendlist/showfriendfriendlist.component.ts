import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-showfriendfriendlist',
  templateUrl: './showfriendfriendlist.component.html',
  styleUrls: ['./showfriendfriendlist.component.css']
})
export class ShowfriendfriendlistComponent implements OnInit {
  public friendList: any[] = [];
  frnd_id: any;

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.frnd_id = params['id'];
  });
    this.getfriendlist();
    console.log(this.frnd_id)
  }
  getfriendlist() {
    this.friendList = [];
    axios.post('friendsoffriendData', { frnd_id: this.frnd_id }).then(res => {
      res.data.forEach((data: any) => {
        this.friendList.push({ data })
      });
    }).catch(err => console.log(err))
    console.log(this.friendList)
  }
  onclick(userid:any){
    console.log(userid)
    this.router.navigate(['/user'], { queryParams: { id: userid } });
    this.ngOnInit()
  }
}
