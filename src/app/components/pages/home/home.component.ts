import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor() { }
  // Instagram
  instaclassname = "primary-bg";
  // Footer style
  classname = "";
  ftlogo = "assets/img/logo.png"
  ngOnInit(): void {
  }

}
