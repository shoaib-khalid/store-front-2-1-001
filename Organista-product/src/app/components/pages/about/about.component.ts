import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  // Instagram
  instaclassname = "secondary-bg";
  // Footer style
  classname = "";
  ftlogo = "assets/img/logo.png"
  constructor() { }


  ngOnInit(): void {
  }

}
