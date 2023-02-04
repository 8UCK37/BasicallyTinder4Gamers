import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-showgames',
  templateUrl: './showgames.component.html',
  styleUrls: ['./showgames.component.css']
})
export class ShowgamesComponent implements OnInit {
  public list:string[]=["BGMI","FREE FIRE"]
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  openScrollableContent(longContent:any) {
		this.modalService.open(longContent, { scrollable: true });
	}
}
