import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabloid',
  templateUrl: './tabloid.component.html',
  styleUrls: ['./tabloid.component.scss']
})
export class TabloidComponent implements OnInit {

  constructor() {
    type dataRow = {
      id:string,
      volume:number,
      deleted?:boolean
    }
    let resData:dataRow[]
  }
  resData = [{id:'i-A', volume:123, deleted:false},{id:'i-B', volume:456, deleted:true},{id:'i-C', volume:123, deleted:false}]

  ngOnInit(): void {
  }

}
