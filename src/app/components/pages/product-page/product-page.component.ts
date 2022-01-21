import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductpageComponent implements OnInit {
 
 
  classname = "";
  ftlogo = "assets/img/logo.png"

  constructor() { }

  ngOnInit(): void {
  }

}
