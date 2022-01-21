import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blogmasonry',
  templateUrl: './blogmasonry.component.html',
  styleUrls: ['./blogmasonry.component.css']
})
export class BlogmasonryComponent implements OnInit {
  // Instagram
  instaclassname = "secondary-bg";
  // Footer style
  classname = "";
  ftlogo = "assets/img/logo.png"

  constructor() { }

  ngOnInit(): void {
  }

}
