import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-productsingletwo',
  templateUrl: './productsingletwo.component.html',
  styleUrls: ['./productsingletwo.component.css']
})
export class ProductsingletwoComponent implements OnInit {
  // Instagram
  instaclassname = "secondary-bg";
  // Footer style
  classname = "";
  ftlogo = "assets/img/logo.png"

  constructor() { }

  ngOnInit(): void {
  }

}
