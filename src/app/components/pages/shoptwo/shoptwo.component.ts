import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shoptwo',
  templateUrl: './shoptwo.component.html',
  styleUrls: ['./shoptwo.component.css']
})
export class ShoptwoComponent implements OnInit {
  // Instagram
  instaclassname = "secondary-bg";
  // Footer style
  classname = "";
  ftlogo = "assets/img/logo.png"

  constructor() { }

  ngOnInit(): void {
  }

}
