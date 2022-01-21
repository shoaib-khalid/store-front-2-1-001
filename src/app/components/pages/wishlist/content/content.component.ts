import { Component, OnInit } from '@angular/core';
import wishlistPost from '../../../../data/wishlist.json';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor() { }
  public wishlist: { img: string }[] = wishlistPost;

  ngOnInit(): void {
  }

}
