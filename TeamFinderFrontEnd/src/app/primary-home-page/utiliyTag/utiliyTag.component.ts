import { Component, OnInit } from '@angular/core';

export interface AutoCompleteModel {
  value: any;
  display: string;
}
@Component({
  selector: 'app-utiliyTag',
  templateUrl: './utiliyTag.component.html',
  styleUrls: ['./utiliyTag.component.css']
})

export class UtiliyTagComponent implements OnInit {
  //TODO: change the harcoded tags.
  public items = [
    {display: 'Pizza', value: 1},
    {display: 'Pasta', value: 2},
    {display: 'Parmesan', value: 3},
  ];

  constructor() { }

  ngOnInit() {
    const urerTags =[{

    }];

  }

}
