import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopone',
  templateUrl: './shopone.component.html',
  styleUrls: ['./shopone.component.css']
})
export class ShoponeComponent implements OnInit {
  // Instagram
  instaclassname = "secondary-bg";
  // Footer style
  classname = "";
  ftlogo = "assets/img/logo.png"

  constructor() { }

  ngOnInit(): void {
  }

}
