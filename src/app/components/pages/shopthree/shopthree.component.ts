import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopthree',
  templateUrl: './shopthree.component.html',
  styleUrls: ['./shopthree.component.css']
})
export class ShopthreeComponent implements OnInit {
  // Instagram
  instaclassname = "secondary-bg";
  // Footer style
  classname = "";
  ftlogo = "assets/img/logo.png"

  constructor() { }

  ngOnInit(): void {
  }

}
