import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  public bankName?:any;
  private maxPageCount=3;
  public currentPage=0;
  constructor(private route:ActivatedRoute,private router:Router) { }

  ngOnInit() {
    this.bankName = this.route.snapshot
    console.log(this.bankName);
  }
  skip(){
    
    
  }
  next(){
    this.currentPage = this.currentPage % 4;
    console.log(this.currentPage)
    this.currentPage++;
  }
}
