import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit {
  public postId:any;
  public newPost:any;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.postId = params['post_id'];
      console.log(this.postId)
      this.getPostByPostId(parseInt(this.postId))
    });
  }
  async getPostByPostId(id:any){
    await axios.post('getPostByPostId',{postId:id}).then(res=>{
      res.data.forEach((post: any) => {
        post.tagArr=post.tagnames?.split(',')
        post.photoUrlArr=post.photoUrl?.split(',')
      });
      this.newPost=res.data
      console.log(this.newPost)
    }).catch(err=>console.log(err))
  }

}
