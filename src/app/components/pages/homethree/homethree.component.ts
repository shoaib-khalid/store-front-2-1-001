import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../../api.service';
@Component({
  selector: 'app-homethree',
  templateUrl: './homethree.component.html',
  styleUrls: ['./homethree.component.css']
})
export class HomethreeComponent implements OnInit {
  // Instagram
  instaclassname = "secondary-bg";
  // Footer style
  classname = "andro_footer-dark";
  ftlogo = "assets/img/logo-light.png"

  constructor( private api:ApiService) { }

  ngOnInit(){
    
  }

}
