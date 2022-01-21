import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-postsingle',
  templateUrl: './postsingle.component.html',
  styleUrls: ['./postsingle.component.css']
})
export class PostsingleComponent implements OnInit {
  // Instagram
  instaclassname = "secondary-bg";
  // Footer style
  classname = "";
  ftlogo = "assets/img/logo.png"

  constructor() { }

  ngOnInit(): void {
  }

}
