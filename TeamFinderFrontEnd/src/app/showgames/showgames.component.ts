import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-showgames',
  templateUrl: './showgames.component.html',
  styleUrls: ['./showgames.component.css']
})
export class ShowgamesComponent implements OnInit {
  public list:string[]=["BGMI","FREE FIRE"]
  public result: any
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.result=[]
    for (let i=0; i<this.list.length; i++){
      this.result.push([this.list[i],false])
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
}
