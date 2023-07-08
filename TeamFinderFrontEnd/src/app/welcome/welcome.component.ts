import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsServiceService } from '../utils/utils-service.service';
import axios from 'axios';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  public bankName?:any;
  private maxPageCount=3;
  public currentPage=0;
  public selectedGames: any[] = [];
  progress:any;
  constructor(private route:ActivatedRoute,private router:Router,public utilsServiceService : UtilsServiceService) { }

  ngOnInit() {
    this.bankName = this.route.snapshot
    console.log(this.bankName);
    this.utilsServiceService.preferredGamesObj$.subscribe(gamesArr=>{
      this.selectedGames=gamesArr
    })
  }
  next(){
    //this.currentPage = this.currentPage % 4;
    console.log(this.currentPage)
    if (this.currentPage===3){
      this.currentPage=0
      this.router.navigate(['/home']);
    }
    this.currentPage++;
    //console.log(this.selectedGames);
    if(this.selectedGames.length>0){
      this.submitGames();
    }
    if(this.currentPage===1){
      this.progress=33.33;
    }
    else if(this.currentPage===2){
      this.progress=66.66;
    }
    else {
      this.progress=100;
    }
  }
  async submitGames(){
    console.log('submitGames called')
    await axios.post('savePreffredGames',{games:this.selectedGames}).then(res => {
      console.log(res)
    }).catch(err => console.log(err))
  }
}
